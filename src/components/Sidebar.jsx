import "../styles/sidebar.css";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import aimLogo from "../assets/aim-logo.png";

export default function Sidebar({ currentContract }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const formattedClientName = currentContract?.clients?.name
    .replace(" ", "-")
    .toLowerCase();

  const clientBasePath =
    !isAdminPage && formattedClientName && currentContract?.contract_number
      ? `/${formattedClientName}/${currentContract?.contract_number}`
      : "";

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="sidebar">
      {!isAdminPage ? (
        <div className="container">
          <Link
            to={clientBasePath}
            end
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <img alt="AIM Logo" src={aimLogo} />
          </Link>
          <div className="m-16">
            <p className="client">{currentContract?.clients?.name}</p>
            <p className="package">Premium Partner Pack</p>
          </div>

          <p className="seats">
            Student Seats: <span>{currentContract?.seat_allocation}</span>
          </p>

          <select className="contract-select">
            <option value="contract 1234">
              Contract {currentContract?.contract_number}
            </option>
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
            <p className="date">
              Last updated: <span>XXXXXXX</span>
            </p>
            <p>
              Contract Number:
              <span> {currentContract?.contract_number}</span>
            </p>
            <p>
              Contract End Date:{" "}
              <span>{formatDate(currentContract?.end_date)}</span>
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
