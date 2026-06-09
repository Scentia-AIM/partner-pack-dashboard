import Student from "./Student";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function createSlug(text) {
  return text.toLowerCase().replaceAll(" ", "-");
}

export default function StudentTable({ students }) {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  const contractStudents = students.filter((student) => {
    const studentClientSlug = createSlug(student.clientName);

    const matchesClient = studentClientSlug === clientName;
    const matchesContract = student.contractNumber === contractNumber;

    return matchesClient && matchesContract;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  // If the students change (e.g. due to filters), reset to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  // Calculate total pages based on the number of students and students per page
  const totalPages = Math.ceil(students.length / studentsPerPage);
  // Calculate the index range for the students to display on the current page
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;

  const visibleStudents = students.slice(startIndex, endIndex);

  // Functions to navigate between pages
  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  // Calculate the range of page numbers to display in the pagination controls
  const maxVisiblePages = 3;

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  // Generate an array of page numbers to display in the pagination controls
  const visiblePageNumbers = [];

  for (let page = startPage; page <= endPage; page++) {
    visiblePageNumbers.push(page);
  }
  // Function to navigate directly to a specific page when a page number is clicked
  function goToPage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="card m-32">
      <div className="col-6 head">
        <p>Student</p>
        <p>Location</p>
        <p>Course</p>
        <p>Progress</p>
        <p>End date</p>
        <p>Status</p>
      </div>
      {students.length === 0 ? (
        <p className="m-t-32">No students match these filters.</p>
      ) : (
        <>
          <Student students={contractStudents} />
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

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
