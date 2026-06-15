import AttendancePill from "./AttendancePill";
import ProgressBar from "./ProgressBar";
import StatusPill from "./StatusPill";

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function Student({ students }) {
  return students.map((student) => (
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
        <AttendancePill attended={student.attended} endDate={student.endDate} />
      )}
      <p>{formatDate(student.endDate)}</p>
      <StatusPill
        unitsCompleted={student.unitsCompleted}
        totalUnits={student.totalUnits}
        lastProgressDate={student.lastProgressDate}
      />
    </div>
  ));
}
