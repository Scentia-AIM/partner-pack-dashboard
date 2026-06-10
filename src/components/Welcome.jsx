import { Link } from "react-router-dom";
export default function Welcome() {
  const pathParts = location.pathname.split("/").filter(Boolean);

  const clientName = pathParts[1];
  return (
    <div className="welcome">
      <h1>Hello {clientName}...</h1>
      <p>
        This dashboard provides visibility into learner performance, progression
        health and upcoming milestones across qualifications, workshops and
        coaching programs.
      </p>
      <Link to="students">
        <button className="btn m-t-16">View students</button>
      </Link>
    </div>
  );
}
