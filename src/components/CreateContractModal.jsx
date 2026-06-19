import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreateContractModal({
  closeModal,
  clients,
  onContractCreated,
}) {
  const [clientId, setClientId] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [seatAllocation, setSeatAllocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const uniqueClients = clients.filter((client, index, array) => {
    return (
      array.findIndex((item) => item.clientId === client.clientId) === index
    );
  });

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!clientId || !contractNumber || !seatAllocation) {
      setFormError(
        "Please select a client, enter a contract number and set a seat allocation.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setFormError("");
      setFormMessage("");

      const { data, error } = await supabase
        .from("contracts")
        .insert({
          client_id: clientId,
          contract_number: contractNumber,
          seat_allocation: Number(seatAllocation),
          start_date: startDate || null,
          end_date: endDate || null,
          status,
        })
        .select();

      if (error) {
        console.error("Create contract error:", error);
        throw new Error("Could not create contract.");
      }

      setFormMessage("Contract created successfully.");
      console.log("Created contract:", data);

      await onContractCreated();
      closeModal();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal card">
        <h2>Create a contract</h2>
        <p>
          Create a new contract, set the seat allocation and link it to an
          existing client. Learner records can then be added through the master
          CSV upload.
        </p>

        <button className="close-btn" type="button" onClick={closeModal}>
          ×
        </button>
        <form className="m-t-32" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clientId">Client</label>
            <select
              id="clientId"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
            >
              <option value="">Select client</option>
              {uniqueClients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contractNumber">Contract number</label>
            <input
              id="contractNumber"
              type="text"
              value={contractNumber}
              onChange={(event) => setContractNumber(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="seatAllocation">Seat allocation</label>
            <input
              id="seatAllocation"
              type="number"
              value={seatAllocation}
              onChange={(event) => setSeatAllocation(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              className="btn secondary"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button className="btn upload" type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create contract"}
            </button>
          </div>
        </form>

        {formMessage && <p>{formMessage}</p>}
        {formError && <p className="error">{formError}</p>}
      </div>
    </div>
  );
}
