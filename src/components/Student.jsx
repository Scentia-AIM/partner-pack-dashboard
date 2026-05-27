import AttendancePill from "./AttendancePill";
import ProgressBar from "./ProgressBar";
import StatusPill from "./StatusPill";
import { students } from "../data/mockStudents";

export default function Student() {
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
      <p>{student.endDate}</p>
      <StatusPill
        unitsCompleted={student.unitsCompleted}
        totalUnits={student.totalUnits}
        lastProgressDate={student.lastProgressDate}
      />
    </div>
  ));
}
