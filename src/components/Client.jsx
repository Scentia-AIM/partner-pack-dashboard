import { Link } from "react-router-dom";

export default function Client({
  clients,
  openEditContractModal,
  openClientCSVModal,
}) {
  function createSlug(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const formatDate = (iso) => {
    if (!iso) return "No upload yet";

    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(iso));
  };

  return clients.map((client) => (
    <div className="client col-6" key={client.id}>
      <p>{client.clientName}</p>
      <p>{client.contractNumber}</p>
      <p>
        {client.seatsUsed}
        <span> / {client.seatAllocation}</span>
      </p>
      <p>{formatDate(client.lastUpload)}</p>

      <p>{client.status}</p>

      <div className="actions">
        <button
          className="link-button"
          type="button"
          onClick={() => openEditContractModal(client)}
        >
          Edit
        </button>
        <button
          type="button"
          className="link-button"
          onClick={() => openClientCSVModal(client)}
        >
          Single CSV Upload
        </button>
        <Link
          to={`/${createSlug(client.clientName)}/${client.contractNumber}/`}
          target="_blank"
        >
          Dashboard
        </Link>
      </div>
    </div>
  ));
}
