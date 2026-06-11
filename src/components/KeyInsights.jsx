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
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.4333 38.6646C31.8698 35.8016 28.1453 34 24 34C19.8547 34 16.1298 35.8016 13.5664 38.6646M24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24C42 33.9411 33.9411 42 24 42ZM24 28C20.6863 28 18 25.3137 18 22C18 18.6863 20.6863 16 24 16C27.3137 16 30 18.6863 30 22C30 25.3137 27.3137 28 24 28Z"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 className="m-16">
            <span>{seatsUsedPercentage}%</span> of seat allocations used
          </h3>
          <Link to="students" className="link">
            View more &gt;
          </Link>
        </div>
        <div className="insight">
          <div className="icon">
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.43848 26H17.1696M6.43848 26C6.43848 36.7696 15.0866 45.5 25.7545 45.5M6.43848 26C6.43848 15.2304 15.0866 6.5 25.7545 6.5M17.1696 26H34.3394M17.1696 26C17.1696 36.7696 21.0132 45.5 25.7545 45.5M17.1696 26C17.1696 15.2304 21.0132 6.5 25.7545 6.5M34.3394 26H45.0706M34.3394 26C34.3394 15.2304 30.4958 6.5 25.7545 6.5M34.3394 26C34.3394 36.7696 30.4958 45.5 25.7545 45.5M45.0706 26C45.0706 15.2304 36.4225 6.5 25.7545 6.5M45.0706 26C45.0706 36.7696 36.4225 45.5 25.7545 45.5"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 className="m-16">
            <span>{learnersOnTrackPercentage}% learners</span> on track to
            complete
          </h3>
          <Link to="students" className="link">
            View more &gt;
          </Link>
        </div>
        <div className="insight">
          <div className="icon risk">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.1176 25.6842V18.5263M40 13.1579L36.4706 9.57895M20.5882 6H27.6471M24.1176 40C16.3207 40 10 33.5906 10 25.6842C10 17.7778 16.3207 11.3684 24.1176 11.3684C31.9146 11.3684 38.2353 17.7778 38.2353 25.6842C38.2353 33.5906 31.9146 40 24.1176 40Z"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 className="m-16">
            <span>{inactiveLearners} learners</span> require intervention
          </h3>
          <Link to="students" className="link">
            View more &gt;
          </Link>
        </div>
      </div>
    </>
  );
}
