import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function EditContractModal({
  contract,
  closeModal,
  onContractUpdated,
}) {
  const [seatAllocation, setSeatAllocation] = useState(
    contract.seatAllocation || "",
  );
  const [startDate, setStartDate] = useState(contract.startDate || "");
  const [endDate, setEndDate] = useState(contract.endDate || "");
  const [status, setStatus] = useState(contract.status || "Active");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

    if (!seatAllocation) {
      setFormError("Please set a seat allocation.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError("");

      const { error } = await supabase
        .from("contracts")
        .update({
          seat_allocation: Number(seatAllocation),
          start_date: startDate || null,
          end_date: endDate || null,
          status,
        })
        .eq("id", contract.id);

      if (error) {
        console.error("Update contract error:", error);
        throw new Error("Could not update contract.");
      }

      await onContractUpdated();
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
        <h2>Edit contract</h2>
        <p>
          Update the contract details, seat allocation and contract status for
          this client.
        </p>

        <button className="close-btn" type="button" onClick={closeModal}>
          ×
        </button>

        <form className="m-t-32" onSubmit={handleSubmit}>
          <div className="form-group col-2">
            <div>
              <label>Client</label>
              <input type="text" value={contract.clientName} disabled />
            </div>
            <div>
              <label>Contract number</label>
              <input type="text" value={contract.contractNumber} disabled />
            </div>
          </div>

          <div className="form-group">
            <label>Client login email</label>
            <input type="email" value={contract.loginEmail || ""} disabled />
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

          {formError && <p className="error">{formError}</p>}

          <div className="modal-actions m-t-16">
            <button
              className="btn secondary"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button className="btn upload" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
