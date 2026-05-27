import Student from "./Student";

export default function StudentTable() {
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
      <Student />
    </div>
  );
}
