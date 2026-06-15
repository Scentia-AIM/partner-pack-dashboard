import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ClientLogin from "../clientPages/ClientLogin";
import DashboardNotFound from "./DashboardNotFound";
import aimLogo from "../assets/aim-logo.png";

function createSlug(text) {
  return text.toLowerCase().replaceAll(" ", "-");
}

function formatStudentRecords(data) {
  return data.map((student) => ({
    id: student.id,
    contractId: student.contract_id,
    learnerName: student.learner_name,
    location: student.location,
    courseName: student.course_name,
    courseType: student.course_type,
    unitsCompleted: student.units_completed,
    totalUnits: student.total_units,
    lastProgressDate: student.last_progress_date,
    endDate: student.end_date,
    attended: student.attended,
  }));
}

export default function AccessFirewall({ children }) {
  const [currentContract, setCurrentContract] = useState(null);
  const [isLoadingContract, setIsLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);

  const [studentRecords, setStudentRecords] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState("");

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

      if (!matchingContract) {
        setCurrentContract(null);
        setStudentRecords([]);
        setIsLoadingContract(false);
        return;
      }

      setCurrentContract(matchingContract);
      setIsLoadingContract(false);

      setIsLoadingStudents(true);
      setStudentError("");

      const { data: studentsData, error: studentsError } = await supabase
        .from("student_records")
        .select("*")
        .eq("contract_id", matchingContract.id)
        .order("learner_name", { ascending: true });

      if (studentsError) {
        console.error("Student records error:", studentsError);
        setStudentError("Could not load student records.");
        setIsLoadingStudents(false);
        return;
      }

      setStudentRecords(formatStudentRecords(studentsData));
      setIsLoadingStudents(false);
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
  return children({
    currentContract,
    studentRecords,
    isLoadingStudents,
    studentError,
  });
}
