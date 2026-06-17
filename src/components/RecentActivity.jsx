import { Link } from "react-router-dom";

function formatActivityMessage(message) {
  const words = message.split(" ");
  const studentName = words.slice(0, 2).join(" ");
  const restOfMessage = words.slice(2).join(" ");

  return (
    <>
      <span>{studentName}</span> {restOfMessage}
    </>
  );
}

export default function RecentActivity({
  expiringThisMonth,
  inactiveLearners,
  activityItems,
}) {
  return (
    <div className="activity">
      <h2>Recent Activity</h2>
      <ul>
        <li className="risk">
          <span>{expiringThisMonth}</span> enrolments expire this month
        </li>
        <li className="risk">
          <span>{inactiveLearners}</span> learners inactive for 30+ days
        </li>
        {activityItems.map((item) => (
          <li key={item.id}>{formatActivityMessage(item.message)}</li>
        ))}
      </ul>
      <Link to="students" className="link">
        View more &gt;
      </Link>
    </div>
  );
}
