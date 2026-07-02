import { useState } from "react";
import AttendancePill from "./AttendancePill";
import StatusPill from "./StatusPill";

export default function StudentMobileCard({ student, getStatus, formatDate }) {
  const [isOpen, setIsOpen] = useState(false);

  const progress = Math.round(
    (student.unitsCompleted / student.totalUnits) * 100,
  );

  const status = getStatus(student);

  return (
    <article className="student-mobile-card">
      <button
        className="student-mobile-card-header"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3>{student.learnerName}</h3>
          <p>{student.courseName}</p>
        </div>

        <div className="student-mobile-card-status">
          <StatusPill status={status} />
          <span>{isOpen ? "−" : "+"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="student-mobile-card-body">
          <div>
            <span>Progress</span>
            <strong>
              {student.unitsCompleted}/{student.totalUnits} units ({progress}%)
            </strong>
          </div>

          <div>
            <span>Last progress</span>
            <strong>{formatDate(student.lastProgressDate)}</strong>
          </div>

          <div>
            <span>End date</span>
            <strong>{formatDate(student.endDate)}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{student.location || "-"}</strong>
          </div>

          <div>
            <span>Attendance</span>
            <AttendancePill attended={student.attended} />
          </div>
        </div>
      )}
    </article>
  );
}
