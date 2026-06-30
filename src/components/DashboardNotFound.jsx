import aimLogo from "../assets/aim-logo.png";
import "../styles/login.css";

export default function DashboardNotFound({ handleSignOut }) {
  return (
    <div className="not-found">
      <img alt="AIM Logo" src={aimLogo} />

      <div className="card">
        <p>Dashboard unavailable</p>
        <h1>Premium Partner Pack Not Found</h1>
        <p className="notice">
          We couldn't find a dashboard for this client and contract. The link
          may be incorrect, or you may be logged in with a different client
          account.
        </p>
        <button
          type="button"
          className="btn secondary m-t-16"
          onClick={handleSignOut}
        >
          Sign out and try another account
        </button>
      </div>
      <p className="copyright">
        &copy; Copyright {new Date().getFullYear()} Australian Institute of
        Business. All Rights Reserved.
      </p>
    </div>
  );
}
