import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ClientLogin from "../clientPages/ClientLogin";
import "../styles/login.css";

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

      console.log("Matching contract:", matchingContract);

      setCurrentContract(matchingContract || null);
      setIsLoadingContract(false);
    }

    if (clientName && contractNumber) {
      getCurrentContract();
    }
  }, [clientName, contractNumber]);

  if (isLoadingContract) {
    return (
      <div className="home">
        <p className="m-t-32">Loading dashboard...</p>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="home">
        <p className="m-t-32">{contractError}</p>
      </div>
    );
  }

  if (!currentContract) {
    return (
      <div className="home">
        <div className="header">
          <div className="title m-t-32">
            <h1>Dashboard not found</h1>
            <p>This Premium Partner Pack dashboard could not be found.</p>
          </div>
        </div>
      </div>
    );
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
