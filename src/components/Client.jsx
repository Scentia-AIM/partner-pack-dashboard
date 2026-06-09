import { Link } from "react-router-dom";

export default function Client({ clients }) {
  function createSlug(text) {
    return text.toLowerCase().replaceAll(" ", "-");
  }
  return clients.map((client) => (
    <div className="client col-6" key={client.id}>
      <p>{client.clientName}</p>
      <p>Contract {client.contractNumber}</p>
      <p>
        {client.seatsUsed}
        <span> / {client.seatAllocation}</span>
      </p>
      <p>{client.lastUpload}</p>
      <p>{client.status}</p>

      <div className="actions">
        <Link>Edit</Link>
        <Link
          to={`/${createSlug(client.clientName)}/${client.contractNumber}/`}
        >
          Dashboard
        </Link>
      </div>
    </div>
  ));
}
