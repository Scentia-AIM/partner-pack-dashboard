import { useState, useEffect } from "react";

export default function ImportCSVModal({ closeModal, onImport }) {
  const [selectedFile, setSelectedFile] = useState(null);

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
        seatsUsed: Number(row.seatsUsed),
        seatAllocation: Number(row.seatAllocation),
        lastUpload: row.lastUpload,
        status: row.status,
      };
    });

    return rows;
  }

  function handleUpload() {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const csvText = event.target.result;
      const importedClients = parseCSV(csvText);

      onImport(importedClients);
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
          <label class="drop-container" id="dropcontainer">
            <span>Upload master CSV file</span>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
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
              disabled={!selectedFile}
              onClick={handleUpload}
            >
              Publish master CSV
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
