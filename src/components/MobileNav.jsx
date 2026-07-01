import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import aimLogo from "../assets/aim-logo-mobile.svg";

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MobileNav({ currentContract }) {
  const navigate = useNavigate();
  const [clientContracts, setClientContracts] = useState([]);
  const formattedClientName = currentContract?.clients?.name
    ? createSlug(currentContract.clients.name)
    : "";

  const clientBasePath =
    formattedClientName && currentContract?.contract_number
      ? `/${formattedClientName}/${currentContract.contract_number}`
      : "";

  useEffect(() => {
    async function getClientContracts() {
      if (!currentContract?.client_id) return;

      const { data, error } = await supabase
        .from("contracts")
        .select("id, contract_number")
        .eq("client_id", currentContract.client_id)
        .order("contract_number", { ascending: true });

      if (error) {
        console.error("Mobile contract dropdown error:", error);
        return;
      }

      setClientContracts(data);
    }

    getClientContracts();
  }, [currentContract?.client_id]);

  function handleContractChange(event) {
    const selectedContractNumber = event.target.value;

    navigate(`/${formattedClientName}/${selectedContractNumber}`);
  }

  if (!clientBasePath) return null;

  return (
    <>
      {clientContracts.length > 1 && (
        <div className="mobile-contract-switcher">
          <select
            className="mobile-contract-select"
            value={currentContract?.contract_number || ""}
            onChange={handleContractChange}
          >
            {clientContracts.map((contract) => (
              <option key={contract.id} value={contract.contract_number}>
                Contract {contract.contract_number}
              </option>
            ))}
          </select>
        </div>
      )}
      <nav className="mobile-nav">
        <NavLink
          to={clientBasePath}
          end
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to={`${clientBasePath}/students`}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Students
        </NavLink>

        <NavLink
          to={clientBasePath}
          end
          className={({ isActive }) =>
            isActive ? "mobile-nav-home active" : "mobile-nav-home"
          }
        >
          <img src={aimLogo} alt="AIM home" />
        </NavLink>

        <NavLink
          to={`${clientBasePath}/enrolled-courses`}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Courses
        </NavLink>

        <NavLink
          to={`${clientBasePath}/locations`}
          className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          }
        >
          Locations
        </NavLink>
      </nav>
    </>
  );
}
