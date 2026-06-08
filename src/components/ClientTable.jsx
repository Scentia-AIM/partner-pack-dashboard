import Client from "./Client";
import { useEffect, useState } from "react";

export default function ClientTable({ clients }) {
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [clients]);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;

  const visibleClients = clients.slice(startIndex, endIndex);

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const maxVisiblePages = 3;

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const visiblePageNumbers = [];

  for (let page = startPage; page <= endPage; page++) {
    visiblePageNumbers.push(page);
  }

  return (
    <div className="card m-32">
      <div className="col-6 head">
        <p>Client</p>
        <p>Contract</p>
        <p>Seat Usage</p>
        <p>Last Upload</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      <Client clients={visibleClients} />

      {totalPages > 1 && (
        <div className="pagination m-t-32">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          {visiblePageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={currentPage === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}

          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
