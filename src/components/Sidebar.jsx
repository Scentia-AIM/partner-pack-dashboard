import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="container">
        <img src="src/assets/aim-logo.png" alt="AIM Logo" />
        <div className="m-16">
          <p className="client">Rest Super</p>
          <p className="package">Premium Partner Pack</p>
        </div>

        <p className="seats">
          Student Seats: <span>300</span>
        </p>

        <select className="contract-select">
          <option value="contract 1234">Contract 1234</option>
          <option value="contract 5678">Contract 5678</option>
        </select>

        <ul className="menu">
          <li>Student Overview</li>
          <li>Enrolled Courses</li>
          <li>Locations</li>
          <li>Get In Touch</li>
        </ul>
      </div>
      <div className="container">
        <div className="details">
          <p className="date">April - May 2026</p>
          <p>
            Contract Number: <span>4387</span>
          </p>
          <p>
            Contract End Date: <span>23/03/2026</span>
          </p>
        </div>
        <p className="copyright">
          &copy; Copyright 2026 Australian Institute of Business. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}
