import "../styles/sidebar.css";
import { Link, NavLink } from "react-router-dom";
import aimLogo from "../assets/aim-logo.png";
import { useLocation } from "react-router-dom";

export default function Sidebar({ seatAllocation }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div className="sidebar">
      {!isAdminPage ? (
        <div className="container">
          <Link to="/">
            <img alt="AIM Logo" src={aimLogo} />
          </Link>
          <div className="m-16">
            <p className="client">Rest Super</p>
            <p className="package">Premium Partner Pack</p>
          </div>

          <p className="seats">
            Student Seats: <span>{seatAllocation}</span>
          </p>

          <select className="contract-select">
            <option value="contract 1234">Contract 1234</option>
            <option value="contract 5678">Contract 5678</option>
          </select>

          <ul className="menu">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/students/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Students
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/enrolled-courses/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Enrolled Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/locations/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Locations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Get In Touch
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <div className="container">
          <img alt="AIM Logo" src={aimLogo} />
          <div className="m-16">
            <p className="client">Admin</p>
            <p className="package">Premium Partner Pack</p>
          </div>
        </div>
      )}

      <div className="container">
        {!isAdminPage ? (
          <div className="details">
            <p className="date">April - May 2026</p>
            <p>
              Contract Number: <span>4387</span>
            </p>
            <p>
              Contract End Date: <span>23/03/2026</span>
            </p>
          </div>
        ) : (
          ""
        )}
        <p className="copyright">
          &copy; Copyright {new Date().getFullYear()} Australian Institute of
          Business. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
