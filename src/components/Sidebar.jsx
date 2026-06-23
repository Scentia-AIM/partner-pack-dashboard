import "../styles/sidebar.css";
import aimLogo from "../assets/aim-logo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Sidebar({ currentContract }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");
  const pathParts = location.pathname.split("/").filter(Boolean);
  const clientName = pathParts[0];

  const [clientContracts, setClientContracts] = useState([]);

  useEffect(() => {
    async function getClientContracts() {
      if (!currentContract?.client_id) return;

      const { data, error } = await supabase
        .from("contracts")
        .select("id, contract_number")
        .eq("client_id", currentContract.client_id)
        .order("contract_number", { ascending: true });

      if (error) {
        console.error("Contract dropdown error:", error);
        return;
      }

      setClientContracts(data);
    }

    getClientContracts();
  }, [currentContract?.client_id]);

  const formattedClientName = currentContract?.clients?.name
    ? createSlug(currentContract.clients.name)
    : "";

  const clientBasePath =
    !isAdminPage && formattedClientName && currentContract?.contract_number
      ? `/${formattedClientName}/${currentContract?.contract_number}`
      : "";

  function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  function handleContractChange(event) {
    const selectedContractNumber = event.target.value;

    navigate(`/${clientName}/${selectedContractNumber}`);
  }

  return (
    <div className="sidebar">
      {!isAdminPage ? (
        <div className="container">
          <NavLink
            to={clientBasePath}
            end
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <img alt="AIM Logo" src={aimLogo} />
          </NavLink>
          <div className="m-16">
            <p className="client">{currentContract?.clients?.name}</p>
            <p className="package">Premium Partner Pack</p>
          </div>

          <p className="seats">
            Student Seats: <span>{currentContract?.seat_allocation}</span>
          </p>

          <select
            className="contract-select"
            value={currentContract?.contract_number || ""}
            onChange={handleContractChange}
          >
            {clientContracts.map((contract) => (
              <option key={contract.id} value={contract.contract_number}>
                Contract {contract.contract_number}
              </option>
            ))}
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
            {/* <p className="date">
              Last updated: <span>XXXXXXX</span>
            </p> */}
            <p>
              Contract Number:
              <span> {currentContract?.contract_number}</span>
            </p>
            <p>
              Contract End Date:
              <span> {formatDate(currentContract?.end_date)}</span>
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
