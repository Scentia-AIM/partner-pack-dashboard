import { Link } from "react-router-dom";
export default function Welcome({ currentContract }) {
  return (
    <div className="welcome">
      <h1>Hello {currentContract.clients.name}...</h1>
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
