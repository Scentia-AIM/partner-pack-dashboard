import ClientTable from "../components/ClientTable";
import "../styles/admin-overview.css";
import { useState, useEffect } from "react";
import AdminFilterBar from "../components/AdminFilterBar";
import ImportCSVModal from "../components/ImportCSVModal";
import { supabase } from "../lib/supabaseClient";
import CreateContractModal from "../components/CreateContractModal";
import EditContractModal from "../components/EditContractModal";
import ImportClientCSVModal from "../components/ImportClientCSVModal";

export default function AdminHome() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [isImportCSVModalOpen, setIsImportCSVModalOpen] = useState(false);
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] =
    useState(false);
  const [contractBeingEdited, setContractBeingEdited] = useState(null);
  const [contractForClientUpload, setContractForClientUpload] = useState(null);

  useEffect(() => {
    getContracts();
  }, []);

  // Get contracts database with associated client
  async function getContracts() {
    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
      id,
      client_id,
      contract_number,
      seat_allocation,
      status,
      start_date,
      end_date,
      last_upload_at,
      clients (
        name,
        auth_user_id,
        login_email
      ),
      student_records (
        id
      )
    `,
      )
      .order("contract_number", { ascending: true });

    if (error) {
      console.error("Could not load contracts:", error);
      return;
    }

    const formattedClients = data.map((row) => ({
      id: row.id,
      clientId: row.client_id,
      clientName: row.clients?.name,
      contractNumber: row.contract_number,
      seatsUsed: row.student_records?.length || 0,
      seatAllocation: row.seat_allocation,
      lastUpload: row.last_upload_at,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      authUserId: row.clients?.auth_user_id,
      loginEmail: row.clients?.login_email,
    }));

    setClients(formattedClients);
  }

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

  function openCreateContractModal() {
    setIsCreateContractModalOpen(true);
  }

  function closeCreateContractModal() {
    setIsCreateContractModalOpen(false);
  }

  function handleCSVImport({
    matchedRows,
    unmatchedRows,
    rowsForSupabase,
    activityItems,
  }) {}

  function openEditContractModal(contract) {
    setContractBeingEdited(contract);
  }

  function closeEditContractModal() {
    setContractBeingEdited(null);
  }

  function openClientCSVModal(contract) {
    setContractForClientUpload(contract);
  }

  function closeClientCSVModal() {
    setContractForClientUpload(null);
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
        openCreateContractModal={openCreateContractModal}
      />

      <ClientTable
        clients={filteredClients}
        openEditContractModal={openEditContractModal}
        openClientCSVModal={openClientCSVModal}
      />

      {isImportCSVModalOpen && (
        <ImportCSVModal
          closeModal={closeImportCSVModal}
          onImport={handleCSVImport}
          contracts={clients}
        />
      )}

      {isCreateContractModalOpen && (
        <CreateContractModal
          closeModal={closeCreateContractModal}
          clients={clients}
          onContractCreated={getContracts}
        />
      )}

      {contractBeingEdited && (
        <EditContractModal
          contract={contractBeingEdited}
          closeModal={closeEditContractModal}
          onContractUpdated={getContracts}
        />
      )}

      {contractForClientUpload && (
        <ImportClientCSVModal
          contract={contractForClientUpload}
          closeModal={closeClientCSVModal}
          onImportComplete={getContracts}
        />
      )}
    </div>
  );
}
