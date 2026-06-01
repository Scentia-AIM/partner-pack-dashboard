import { Link } from "react-router-dom";

export default function RecentActivity({
  expiringThisMonth,
  inactiveLearners,
  latestUnitCompleted,
  latestWorkshopAttendance,
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
        <li>
          <span>Luke</span> completed Unit 6
        </li>
        <li>
          <span>Sarah</span> attended Mini MBA workshop
        </li>
      </ul>
      <Link to="/students" className="link">
        View more &gt;
      </Link>
    </div>
  );
}
