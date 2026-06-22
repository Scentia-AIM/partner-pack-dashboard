import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreateContractModal({
  closeModal,
  clients,
  onContractCreated,
}) {
  const [clientMode, setClientMode] = useState("existing");
  const [clientId, setClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [accessEmail, setAccessEmail] = useState("");
  const [accessPassword, setAccessPassword] = useState("");

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

  async function testCreateClientContractFunction() {
    const { data, error } = await supabase.functions.invoke(
      "create-client-contract",
      {
        body: {
          clientName: newClientName,
          email: accessEmail,
          password: accessPassword,
          contractNumber,
          seatAllocation,
          startDate,
          endDate,
          status,
        },
      },
    );

    if (error) {
      let errorMessage = "Unknown function error.";

      try {
        const errorDetails = await error.context.json();
        errorMessage = errorDetails.error;
        console.error("Function error details:", errorDetails);
      } catch {
        console.error("Function error:", error);
      }

      setFormError(errorMessage);
      return;
    }

    console.log("Function response:", data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (clientMode === "existing" && !clientId) {
      setFormError("Please select a client.");
      return;
    }

    if (clientMode === "new" && !newClientName.trim()) {
      setFormError("Please enter a new client name.");
      return;
    }

    if (clientMode === "new" && !accessEmail.trim()) {
      setFormError("Please enter a client login email.");
      return;
    }

    if (clientMode === "new" && !accessPassword.trim()) {
      setFormError("Please enter a client login password.");
      return;
    }

    if (!contractNumber || !seatAllocation) {
      setFormError("Please enter a contract number and set a seat allocation.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError("");
      setFormMessage("");

      let selectedClientId = clientId;

      if (clientMode === "new") {
        const { data, error } = await supabase.functions.invoke(
          "create-client-contract",
          {
            body: {
              clientName: newClientName.trim(),
              email: accessEmail.trim(),
              password: accessPassword.trim(),
              contractNumber,
              seatAllocation,
              startDate,
              endDate,
              status,
            },
          },
        );

        if (error) {
          let errorMessage = "Could not create client and contract.";

          try {
            const errorDetails = await error.context.json();
            errorMessage = errorDetails.error || errorMessage;
            console.error(
              "Create client contract function error:",
              errorDetails,
            );
          } catch {
            console.error("Create client contract function error:", error);
          }

          throw new Error(errorMessage);
        }

        console.log("Created client and contract:", data);

        setFormMessage("Client and contract created successfully.");
        await onContractCreated();
        closeModal();
        return;
      }

      const { data, error } = await supabase
        .from("contracts")
        .insert({
          client_id: selectedClientId,
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
            <label htmlFor="clientMode">Client</label>
            <select
              id="clientMode"
              value={clientMode === "new" ? "new" : clientId}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "new") {
                  setClientMode("new");
                  setClientId("");
                  return;
                }

                setClientMode("existing");
                setClientId(value);
                setNewClientName("");
                setAccessEmail("");
                setAccessPassword("");
              }}
            >
              <option value="">Select client</option>

              {uniqueClients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientName}
                </option>
              ))}

              <option value="new">+ Add new client</option>
            </select>
          </div>

          {clientMode === "new" && (
            <>
              <div className="form-group">
                <label htmlFor="newClientName">New client name</label>
                <input
                  id="newClientName"
                  type="text"
                  value={newClientName}
                  onChange={(event) => setNewClientName(event.target.value)}
                  placeholder="Enter client name"
                />
              </div>

              <div className="form-group col-2">
                <div>
                  <label htmlFor="accessEmail">Client login email</label>
                  <input
                    id="accessEmail"
                    type="email"
                    value={accessEmail}
                    onChange={(event) => setAccessEmail(event.target.value)}
                    placeholder="Enter login email"
                  />
                </div>
                <div>
                  <label htmlFor="accessPassword">Client login password</label>
                  <input
                    id="accessPassword"
                    type="text"
                    value={accessPassword}
                    onChange={(event) => setAccessPassword(event.target.value)}
                    placeholder="Enter temporary password"
                  />
                </div>
              </div>
            </>
          )}

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

          <div className="modal-actions m-t-16">
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
