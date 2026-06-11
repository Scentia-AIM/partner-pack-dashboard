import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ClientLogin from "../clientPages/ClientLogin";
import DashboardNotFound from "./DashboardNotFound";
import aimLogo from "../assets/aim-logo.png";

function createSlug(text) {
  return text.toLowerCase().replaceAll(" ", "-");
}

export default function AccessFirewall({ children }) {
  const [currentContract, setCurrentContract] = useState(null);
  const [isLoadingContract, setIsLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);

  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  useEffect(() => {
    async function getCurrentContract() {
      setIsLoadingContract(true);
      setContractError("");

      const { data, error } = await supabase
        .from("contracts")
        .select(
          `
            id,
            contract_number,
            seat_allocation,
            status,
            start_date,
            end_date,
            last_upload_at,
            clients (
              name
            )
          `,
        )
        .eq("contract_number", contractNumber);

      if (error) {
        console.error("Supabase contract error:", error);
        setContractError("Could not load this contract.");
        setIsLoadingContract(false);
        return;
      }

      const matchingContract = data.find((contract) => {
        return createSlug(contract.clients.name) === clientName;
      });

      setCurrentContract(matchingContract || null);
      setIsLoadingContract(false);
    }

    if (clientName && contractNumber) {
      getCurrentContract();
    }
  }, [clientName, contractNumber]);

  if (isLoadingContract) {
    return (
      <div className="loading">
        <img alt="AIM Logo" src={aimLogo} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="loading">
        <img alt="AIM Logo" src={aimLogo} />
        <p>{contractError}</p>
      </div>
    );
  }

  if (!currentContract) {
    return <DashboardNotFound />;
  }

  if (!isClientLoggedIn) {
    return (
      <ClientLogin
        currentContract={currentContract}
        onLogin={() => setIsClientLoggedIn(true)}
      />
    );
  }
  return children;
}
