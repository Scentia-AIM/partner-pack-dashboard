import { Link } from "react-router-dom";

export default function CourseCard({ courses, count }) {
  return (
    <div className="card">
      {Object.keys(courses).map((courseName) => (
        <div className="course" key={courseName}>
          <div className="title">
            <p>BSB40920</p>
            <h3>{courseName}</h3>
          </div>

          <p className="user-count">{courses[courseName]} Users</p>
          <Link className="link" to="/students">
            View &gt;
          </Link>
        </div>
      ))}
    </div>
  );
}
