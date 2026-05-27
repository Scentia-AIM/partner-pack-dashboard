export default function RecentActivity() {
  return (
    <div className="activity">
      <h2>Recent Activity</h2>
      <ul>
        <li className="risk">
          <span>4 enrolments</span> expire this month
        </li>
        <li className="risk">
          <span>3 learners</span> inactive for 30+ days
        </li>
        <li>
          <span>Luke</span> completed Unit 6
        </li>
        <li>
          <span>Sarah</span> attended Mini MBA workshop
        </li>
      </ul>
      <a href="/students/">View more &gt;</a>
    </div>
  );
}
