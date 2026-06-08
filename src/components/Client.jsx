export default function Client({ clients }) {
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
        <button>Dashboard</button>
        <button>Edit</button>
      </div>
    </div>
  ));
}
