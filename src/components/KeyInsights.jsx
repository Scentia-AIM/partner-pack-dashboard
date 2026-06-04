import { Link } from "react-router-dom";

export default function KeyInsights({
  seatsUsedPercentage,
  learnersOnTrackPercentage,
  inactiveLearners,
}) {
  return (
    <>
      <h2 className="m-t-64 m-b-16">Key Insights</h2>
      <div className="card key-insights">
        <div className="insight">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-users"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="m-16">
            <span>{seatsUsedPercentage}%</span> of seat allocations used
          </h3>
          <Link to="/students/" className="link">
            View more &gt;
          </Link>
        </div>
        <div className="insight">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-users"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="m-16">
            <span>{learnersOnTrackPercentage}% learners</span> on track to
            complete
          </h3>
          <Link to="/students/" className="link">
            View more &gt;
          </Link>
        </div>
        <div className="insight">
          <div className="icon risk">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-users"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="m-16">
            <span>{inactiveLearners} learners</span> require intervention
          </h3>
          <Link to="/students/" className="link">
            View more &gt;
          </Link>
        </div>
      </div>
    </>
  );
}
