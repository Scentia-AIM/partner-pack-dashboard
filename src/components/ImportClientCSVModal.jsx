import { useState, useEffect } from "react";
import {
  getExistingStudentRecords,
  uploadRowsToSupabase,
  saveActivityItems,
  updateContractLastUpload,
} from "../lib/csvUploadService";
import { compareStudentRecords } from "../lib/csvUploadHelpers";

function parseCSVLine(line) {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += character;
    }
  }

  values.push(currentValue.trim());

  return values;
}

function formatDate(dateValue) {
  if (!dateValue) return null;

  const cleanDate = dateValue.split(" ")[0];
  const parts = cleanDate.split("/");

  if (parts.length !== 3) return null;

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

function parseTecalaCSV(csvText, contractId) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerIndex = lines.findIndex((line) =>
    line.startsWith("Contact: Full Name"),
  );

  if (headerIndex === -1) {
    throw new Error("Could not find the learner rows in this CSV.");
  }

  const headers = parseCSVLine(lines[headerIndex]);

  const rows = lines.slice(headerIndex + 1).map((line) => {
    const values = parseCSVLine(line);

    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });

  return rows
    .filter((row) => row["Contact: Full Name"])
    .filter((row) => Number(row["Place Consumed"]) === 1)
    .map((row) => {
      const attendancePercentage = Number(row["Attendance Percentage"]) || 0;
      const attended = attendancePercentage >= 100;

      return {
        contract_id: contractId,
        learner_name: row["Contact: Full Name"],
        location: row["Course Offering Location"] || "Unknown",
        course_name: row["Course Offering Product Name"],
        course_type: "short_course",
        units_completed: attended ? 1 : 0,
        total_units: 1,
        last_progress_date:
          formatDate(row["End Date"]) || formatDate(row["Start Date"]),
        end_date: formatDate(row["End Date"]),
        attended,
      };
    });
}

export default function ImportClientCSVModal({
  contract,
  closeModal,
  onImportComplete,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
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
    setSelectedFile(event.target.files[0]);
    setUploadMessage("");
    setUploadError("");
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        setIsUploading(true);
        setUploadMessage("");
        setUploadError("");

        const csvText = event.target.result;

        const rowsForSupabase = parseTecalaCSV(csvText, contract.id);

        if (rowsForSupabase.length === 0) {
          throw new Error(
            "No consumed learner records were found in this CSV.",
          );
        }

        const existingRows = await getExistingStudentRecords([contract.id]);

        const activityItems = compareStudentRecords(
          existingRows,
          rowsForSupabase,
        );

        const insertedRows = await uploadRowsToSupabase(rowsForSupabase);

        await updateContractLastUpload([contract.id]);

        await saveActivityItems(activityItems);

        setUploadMessage(
          `${insertedRows.length} learner records uploaded for ${contract.clientName}.`,
        );

        await onImportComplete();
      } catch (error) {
        console.error("Client CSV upload error:", error);
        setUploadError(error.message);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(selectedFile);
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal card">
        <h2>Upload client Partner Pack CSV</h2>

        <p>
          Upload an individual csv file for {contract.clientName}, contract{" "}
          {contract.contractNumber}. All learner records in this file will be
          assigned to this contract.
        </p>

        <button className="close-btn" type="button" onClick={closeModal}>
          ×
        </button>

        <div className="m-t-32">
          <div className="drop-container">
            <span>Choose client CSV file</span>

            <input
              id="clientCsvUpload"
              className="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />

            <label
              className="btn secondary file-upload-btn"
              htmlFor="clientCsvUpload"
            >
              Choose file
            </label>

            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          </div>

          {uploadMessage && <p>{uploadMessage}</p>}
          {uploadError && <p className="error">{uploadError}</p>}

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
              {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
