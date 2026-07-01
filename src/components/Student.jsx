import { useState } from "react";
import AttendancePill from "./AttendancePill";
import ProgressBar from "./ProgressBar";
import StatusPill from "./StatusPill";

function formatDate(date) {
  if (!date) return "No date available";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function StudentMobileCard({ student, isOpen, onToggle }) {
  return (
    <div className="student-mobile-card">
      <button
        className="student-mobile-header"
        type="button"
        onClick={onToggle}
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
        </div>
      </button>

      {isOpen && (
        <div className="student-mobile-body">
          <div>
            <span>Location</span>
            <p>{student.location}</p>
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
            <p>{formatDate(student.endDate)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Student({ students }) {
  const [openStudentId, setOpenStudentId] = useState(null);

  function toggleStudent(studentId) {
    setOpenStudentId((currentOpenStudentId) => {
      if (currentOpenStudentId === studentId) {
        return null;
      }

      return studentId;
    });
  }

  return (
    <>
      <div className="student-desktop-list">
        {students.map((student) => (
          <div className="student col-6" key={student.id}>
            <p>{student.learnerName}</p>
            <p>{student.location}</p>
            <p>{student.courseName}</p>

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

            <p>{formatDate(student.endDate)}</p>

            <StatusPill
              unitsCompleted={student.unitsCompleted}
              totalUnits={student.totalUnits}
              lastProgressDate={student.lastProgressDate}
            />
          </div>
        ))}
      </div>

      <div className="student-mobile-list">
        {students.map((student) => (
          <StudentMobileCard
            key={student.id}
            student={student}
            isOpen={openStudentId === student.id}
            onToggle={() => toggleStudent(student.id)}
          />
        ))}
      </div>
    </>
  );
}
