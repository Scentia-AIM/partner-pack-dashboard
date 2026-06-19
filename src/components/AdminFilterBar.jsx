export default function AdminFilterBar({
  searchTerm,
  setSearchTerm,
  status,
  setStatus,
  resetFilters,
  openImportCSVModal,
  openCreateContractModal,
}) {
  return (
    <div className="filter-bar m-t-64">
      <input
        type="text"
        placeholder="Search Client..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>

      <button className="btn primary" type="button" onClick={resetFilters}>
        Reset
      </button>

      <button
        className="btn secondary"
        type="button"
        onClick={openCreateContractModal}
      >
        Create Contract
      </button>

      <button className="btn upload" type="button" onClick={openImportCSVModal}>
        Upload master CSV
      </button>
    </div>
  );
}
