import { Link, useLocation } from "react-router-dom";

export default function CourseCard({ courses, count }) {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  const clientBasePath =
    clientName && contractNumber ? `/${clientName}/${contractNumber}` : "";
  return (
    <div className="card">
      {Object.keys(courses).length > 0 ? (
        Object.keys(courses).map((courseName) => (
          <div className="course" key={courseName}>
            <div className="title">
              <p>BSB40920</p>
              <h3>{courseName}</h3>
            </div>

            <p className="user-count">
              {courses[courseName]}{" "}
              {courses[courseName] > 1 ? "Students" : "Student"}
            </p>

            <Link className="link" to={`${clientBasePath}/students`}>
              View &gt;
            </Link>
          </div>
        ))
      ) : (
        <div className="course">
          <div className="title">
            <h3>No students enrolled</h3>
          </div>
        </div>
      )}
    </div>
  );
}
