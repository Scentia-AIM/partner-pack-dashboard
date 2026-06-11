import aimLogo from "../assets/aim-logo.png";
import "../styles/login.css";

export default function DashboardNotFound() {
  return (
    <div className="not-found">
      <img alt="AIM Logo" src={aimLogo} />

      <div className="card">
        <p>Dashboard unavailable</p>
        <h1>Premium Partner Pack Not Found</h1>
        <p className="notice">
          We couldn't find a dashboard for this client and contract number.
          Please check the link and try again.
        </p>
      </div>
      <p className="copyright">
        &copy; Copyright {new Date().getFullYear()} Australian Institute of
        Business. All Rights Reserved.
      </p>
    </div>
  );
}
