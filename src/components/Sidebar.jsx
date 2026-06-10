import "../styles/sidebar.css";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import aimLogo from "../assets/aim-logo.png";

export default function Sidebar({ seatAllocation }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const pathParts = location.pathname.split("/").filter(Boolean);

  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  const clientBasePath =
    !isAdminPage && clientName && contractNumber
      ? `/${clientName}/${contractNumber}`
      : "";
  return (
    <div className="sidebar">
      {!isAdminPage ? (
        <div className="container">
          <Link to={`${clientBasePath}/`}>
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
            <option value="contract 1234">Contract {contractNumber}</option>
          </select>

          <ul className="menu">
            <li>
              <NavLink
                to={clientBasePath}
                end
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`${clientBasePath}/students`}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Students
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`${clientBasePath}/enrolled-courses`}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Enrolled Courses
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`${clientBasePath}/locations`}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Locations
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`${clientBasePath}/contact`}
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
              Contract Number: <span>{contractNumber}</span>
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
