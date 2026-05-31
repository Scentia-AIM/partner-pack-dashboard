import Student from "./Student";

export default function StudentTable({ students }) {
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
        <Student students={students} />
      )}
    </div>
  );
}
