import { useState, useEffect } from "react";
import {
  getExistingStudentRecords,
  uploadRowsToSupabase,
  saveActivityItems,
  updateContractLastUpload,
} from "../lib/csvUploadService";
import {
  parseCSV,
  matchRowsToContracts,
  formatStudentRowsForSupabase,
  getUniqueContractIds,
  compareStudentRecords,
} from "../lib/csvUploadHelpers";

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

  function handleUpload() {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        setIsUploading(true);
        setUploadError("");
        setUploadMessage("");

        // 1. Read the CSV file contents
        const csvText = event.target.result;

        // 2. Convert the CSV text into normal JavaScript rows
        const importedRows = parseCSV(csvText);

        // 3. Match each CSV row to an existing Supabase contract
        const { matchedRows, unmatchedRows } = matchRowsToContracts(
          importedRows,
          contracts,
        );

        if (matchedRows.length === 0) {
          throw new Error("No rows matched an existing contract.");
        }

        // 4. Convert matched rows into the shape expected by student_records
        const rowsForSupabase = formatStudentRowsForSupabase(matchedRows);

        // 5. Get the contract IDs included in this upload
        const contractIds = getUniqueContractIds(rowsForSupabase);

        // 6. Fetch old student records before replacing them
        // This is needed so we can compare old data vs new CSV data
        const existingRows = await getExistingStudentRecords(contractIds);

        // 7. Compare old records to new records and create recent activity messages
        const activityItems = compareStudentRecords(
          existingRows,
          rowsForSupabase,
        );

        // 8. Replace student_records with the latest CSV data
        const insertedRows = await uploadRowsToSupabase(rowsForSupabase);
        await updateContractLastUpload(contractIds);

        // 9. Save recent activity messages for the homepage
        const savedActivityItems = await saveActivityItems(activityItems);

        // 10. Update modal UI
        setUploadMessage(
          `${insertedRows.length} learner records uploaded. ${unmatchedRows.length} rows skipped.`,
        );
        setParsedRows(matchedRows);

        // 11. Let AdminHome know what happened
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
            <input
              id="csvUpload"
              className="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
            <label
              className="btn secondary file-upload-btn"
              htmlFor="csvUpload"
            >
              Choose CSV file
            </label>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            {parsedRows.length > 0 && (
              <p>{parsedRows.length} learner records found.</p>
            )}
            {isUploading && <p>Uploading learner records...</p>}

            {uploadMessage && <p>{uploadMessage}</p>}

            {uploadError && <p className="error">{uploadError}</p>}
          </label>

          <div className="modal-actions m-t-16">
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
