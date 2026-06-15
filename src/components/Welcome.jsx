import { Link } from "react-router-dom";
export default function Welcome() {
  const pathParts = location.pathname.split("/").filter(Boolean);

  const clientName = pathParts[1];

  const clientNameReformatted = clientName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="welcome">
      <h1>Hello {clientNameReformatted}...</h1>
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
