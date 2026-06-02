import { Link } from "react-router-dom";

export default function CourseCard({}) {
  return (
    <div className="card">
      <div className="course">
        <div className="title">
          <p>BSB40920</p>
          <h3>Certificate IV in Project Management Practice</h3>
        </div>
        <p className="user-count">26 Users</p>
        <Link className="link" to="/students">
          View &gt;
        </Link>
      </div>
    </div>
  );
}
