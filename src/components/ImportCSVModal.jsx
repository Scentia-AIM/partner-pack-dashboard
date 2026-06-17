import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ImportCSVModal({ closeModal, onImport, contracts }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [closeModal]);

  function handleOverlayClick(event) {
    if (event.target.className === "modal-overlay") {
      closeModal();
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");

    const headers = lines[0].split(",").map((header) => header.trim());

    const rows = lines.slice(1).map((line, index) => {
      const values = line.split(",").map((value) => value.trim());

      const row = headers.reduce((object, header, headerIndex) => {
        object[header] = values[headerIndex];
        return object;
      }, {});

      return {
        id: index + 1,
        clientName: row.clientName,
        contractNumber: row.contractNumber,
        learnerName: row.learnerName,
        location: row.location,
        courseName: row.courseName,
        courseType: row.courseType,
        unitsCompleted: Number(row.unitsCompleted),
        totalUnits: Number(row.totalUnits),
        lastProgressDate: row.lastProgressDate || null,
        endDate: row.endDate || null,
        attended: row.attended === "true",
      };
    });

    return rows;
  }

  function matchRowsToContracts(rows) {
    const matchedRows = [];
    const unmatchedRows = [];

    rows.forEach((row) => {
      const matchingContract = contracts.find((contract) => {
        return (
          contract.clientName.toLowerCase() === row.clientName.toLowerCase() &&
          String(contract.contractNumber) === String(row.contractNumber)
        );
      });

      if (!matchingContract) {
        unmatchedRows.push(row);
        return;
      }

      matchedRows.push({
        ...row,
        contract_id: matchingContract.id,
      });
    });

    return {
      matchedRows,
      unmatchedRows,
    };
  }

  function formatRowsForSupabase(rows) {
    return rows.map((row) => ({
      contract_id: row.contract_id,
      learner_name: row.learnerName,
      location: row.location,
      course_name: row.courseName,
      course_type: row.courseType,
      units_completed: row.unitsCompleted,
      total_units: row.totalUnits,
      last_progress_date: row.lastProgressDate,
      end_date: row.endDate,
      attended: row.attended,
    }));
  }

  function getUniqueContractIds(rows) {
    return [...new Set(rows.map((row) => row.contract_id))];
  }

  async function getExistingStudentRecords(contractIds) {
    const { data, error } = await supabase
      .from("student_records")
      .select("*")
      .in("contract_id", contractIds);

    if (error) {
      console.error("Existing student records error:", error);
      return [];
    }

    return data;
  }

  async function uploadRowsToSupabase(rowsForSupabase) {
    const contractIds = getUniqueContractIds(rowsForSupabase);

    const { error: deleteError } = await supabase
      .from("student_records")
      .delete()
      .in("contract_id", contractIds);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw new Error("Could not clear existing student records.");
    }

    const { data, error: insertError } = await supabase
      .from("student_records")
      .insert(rowsForSupabase)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Could not upload new student records.");
    }

    return data;
  }

  function createRecordKey(row) {
    return `${row.contract_id}-${row.learner_name}-${row.course_name}`;
  }

  function compareStudentRecords(existingRows, newRows) {
    const activityItems = [];

    newRows.forEach((newRow) => {
      const matchingExistingRow = existingRows.find((existingRow) => {
        return createRecordKey(existingRow) === createRecordKey(newRow);
      });

      if (!matchingExistingRow) {
        return;
      }

      const oldUnits = matchingExistingRow.units_completed;
      const newUnits = newRow.units_completed;
      const totalUnits = newRow.total_units;

      const wasCompleted = oldUnits < totalUnits;
      const isNowCompleted = newUnits === totalUnits;

      if (wasCompleted && isNowCompleted) {
        activityItems.push({
          contractId: newRow.contract_id,
          type: "course_completed",
          message: `${newRow.learner_name} completed ${newRow.course_name}`,
        });

        return;
      }

      if (newUnits > oldUnits) {
        activityItems.push({
          contractId: newRow.contract_id,
          type: "unit_progress",
          message: `${newRow.learner_name} progressed from ${oldUnits} to ${newUnits} units`,
        });
      }

      if (matchingExistingRow.attended !== true && newRow.attended === true) {
        activityItems.push({
          contractId: newRow.contract_id,
          type: "workshop_attended",
          message: `${newRow.learner_name} attended ${newRow.course_name}`,
        });
      }
    });

    return activityItems;
  }

  function formatActivityItemsForSupabase(activityItems) {
    return activityItems.map((item) => ({
      contract_id: item.contractId,
      type: item.type,
      message: item.message,
    }));
  }

  async function saveActivityItems(activityItems) {
    if (activityItems.length === 0) return [];

    const rowsForSupabase = formatActivityItemsForSupabase(activityItems);

    const { data, error } = await supabase
      .from("recent_activity")
      .insert(rowsForSupabase)
      .select();

    if (error) {
      console.error("Recent activity insert error:", error);
      throw new Error("Could not save recent activity.");
    }

    return data;
  }

  function handleUpload() {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = async function (event) {
      const csvText = event.target.result;
      const importedRows = parseCSV(csvText);

      const { matchedRows, unmatchedRows } = matchRowsToContracts(importedRows);

      const rowsForSupabase = formatRowsForSupabase(matchedRows);

      const contractIds = getUniqueContractIds(rowsForSupabase);

      const existingRows = await getExistingStudentRecords(contractIds);

      const activityItems = compareStudentRecords(
        existingRows,
        rowsForSupabase,
      );

      try {
        setIsUploading(true);
        setUploadError("");
        setUploadMessage("");

        const insertedRows = await uploadRowsToSupabase(rowsForSupabase);
        const savedActivityItems = await saveActivityItems(activityItems);

        setUploadMessage(`${insertedRows.length} learner records uploaded.`);
        setParsedRows(matchedRows);

        onImport({
          matchedRows,
          unmatchedRows,
          rowsForSupabase,
          activityItems: savedActivityItems,
        });
      } catch (error) {
        setUploadError(error.message);
      } finally {
        setIsUploading(false);
      }

      console.log("Activity items:", activityItems);

      console.log("Existing rows from Supabase:", existingRows);

      console.log("Matched rows:", matchedRows);
      console.log("Unmatched rows:", unmatchedRows);
      console.log("Rows formatted for Supabase:", rowsForSupabase);
    };

    reader.readAsText(selectedFile);
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal card">
        <h2>Import Client Data</h2>
        <p>
          Upload the latest master CSV to update client contracts, seat usage
          and learner progress data.
        </p>

        <button className="close-btn" type="button" onClick={closeModal}>
          ×
        </button>

        <form className="m-t-32">
          <label className="drop-container" id="dropcontainer">
            <span>Upload master CSV file</span>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {parsedRows.length > 0 && (
              <p>{parsedRows.length} learner records found.</p>
            )}
            {isUploading && <p>Uploading learner records...</p>}

            {uploadMessage && <p>{uploadMessage}</p>}

            {uploadError && <p className="error">{uploadError}</p>}
          </label>

          <div className="modal-actions">
            <button
              className="btn secondary"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="btn upload"
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading..." : "Publish master CSV"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
