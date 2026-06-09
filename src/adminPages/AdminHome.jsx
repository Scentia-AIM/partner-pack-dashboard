import ClientTable from "../components/ClientTable";
import "../styles/admin-overview.css";
import { mockClients } from "../data/mockClients";
import { useState } from "react";
import AdminFilterBar from "../components/AdminFilterBar";
import ImportCSVModal from "../components/ImportCSVModal";

export default function AdminHome() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [isImportCSVModalOpen, setIsImportCSVModalOpen] = useState(false);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.clientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      status === "all" || client.status.toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  function resetFilters() {
    setSearchTerm("");
    setStatus("all");
  }

  function openImportCSVModal() {
    setIsImportCSVModalOpen(true);
  }

  function closeImportCSVModal() {
    setIsImportCSVModalOpen(false);
  }

  function handleCSVImport(importedClients) {
    setClients(importedClients);
    closeImportCSVModal();
  }

  return (
    <div className="admin-overview">
      <div className="header">
        <div className="title m-t-32">
          <h1>Partner Management</h1>
          <p>
            Create and manage partner accounts, upload learner CSV files and
            update active contract details. Use this section to maintain client
            records and keep Premium Partner Pack data up to date.
          </p>
        </div>
      </div>
      <AdminFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        status={status}
        setStatus={setStatus}
        resetFilters={resetFilters}
        openImportCSVModal={openImportCSVModal}
      />

      <ClientTable clients={filteredClients} />

      {isImportCSVModalOpen && (
        <ImportCSVModal
          closeModal={closeImportCSVModal}
          onImport={handleCSVImport}
        />
      )}
    </div>
  );
}
