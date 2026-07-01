import Student from "./Student";
import { useState, useEffect } from "react";

export default function StudentTable({
  students,
  isLoadingStudents,
  studentError,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;

  const visibleStudents = students.slice(startIndex, endIndex);

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

  if (isLoadingStudents) {
    return (
      <div className="card m-32">
        <p className="m-t-32">Loading students...</p>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="card m-32">
        <p className="m-t-32">{studentError}</p>
      </div>
    );
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
          <Student students={visibleStudents} />

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

function StudentMobileCard({ student }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="student-mobile-card">
      <button
        className="student-mobile-header"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="student-mobile-name">{student.learnerName}</p>
          <p className="student-mobile-course">{student.courseName}</p>
        </div>

        <div className="student-mobile-status">
          <StatusPill
            unitsCompleted={student.unitsCompleted}
            totalUnits={student.totalUnits}
            lastProgressDate={student.lastProgressDate}
          />

          <span className="student-mobile-toggle">{isOpen ? "−" : "+"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="student-mobile-body">
          <div>
            <span>Location</span>
            <strong>{student.location || "-"}</strong>
          </div>

          <div>
            <span>Progress</span>
            {student.courseType !== "short_course" ? (
              <ProgressBar
                unitsCompleted={student.unitsCompleted}
                totalUnits={student.totalUnits}
              />
            ) : (
              <AttendancePill
                attended={student.attended}
                endDate={student.endDate}
              />
            )}
          </div>

          <div>
            <span>End date</span>
            <strong>{formatDate(student.endDate)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
