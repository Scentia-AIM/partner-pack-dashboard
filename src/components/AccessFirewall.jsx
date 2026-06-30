import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ClientLogin from "../clientPages/ClientLogin";
import DashboardNotFound from "./DashboardNotFound";
import aimLogo from "../assets/aim-logo.png";

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const [currentUser, setCurrentUser] = useState(null);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  const [currentContract, setCurrentContract] = useState(null);
  const [isLoadingContract, setIsLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");

  const [studentRecords, setStudentRecords] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState("");

  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  async function getCurrentContract() {
    setIsLoadingContract(true);
    setContractError("");
    setStudentError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Supabase user error:", userError);
      setCurrentUser(null);
      setHasCheckedUser(true);
      setCurrentContract(null);
      setStudentRecords([]);
      setIsLoadingContract(false);
      return;
    }

    setCurrentUser(user || null);
    setHasCheckedUser(true);

    if (!user) {
      setCurrentContract(null);
      setStudentRecords([]);
      setIsLoadingContract(false);
      return;
    }

    const { data, error } = await supabase
      .from("contracts")
      .select(
        `
          id,
          client_id,
          contract_number,
          seat_allocation,
          status,
          start_date,
          end_date,
          last_upload_at,
          clients (
            name,
            auth_user_id
          )
        `,
      )
      .eq("contract_number", contractNumber);

    if (error) {
      console.error("Supabase contract error:", error);
      setContractError("Could not load this contract.");
      setCurrentContract(null);
      setStudentRecords([]);
      setIsLoadingContract(false);
      return;
    }

    const matchingContract = data.find((contract) => {
      const contractClientName = contract.clients?.name;

      if (!contractClientName) return false;

      return createSlug(contractClientName) === clientName;
    });

    if (!matchingContract) {
      console.log("No matching contract found for:", {
        clientName,
        contractNumber,
        data,
        loggedInUser: user.email,
      });

      setCurrentContract(null);
      setStudentRecords([]);
      setIsLoadingContract(false);
      return;
    }

    setCurrentContract(matchingContract);
    setIsLoadingContract(false);

    setIsLoadingStudents(true);

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

  useEffect(() => {
    if (clientName && contractNumber) {
      getCurrentContract();
    }
  }, [clientName, contractNumber]);

  async function handleSignOut() {
    await supabase.auth.signOut();

    setCurrentUser(null);
    setCurrentContract(null);
    setStudentRecords([]);
    setHasCheckedUser(true);
  }

  if (!hasCheckedUser || isLoadingContract) {
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

  if (!currentUser) {
    return <ClientLogin onLogin={getCurrentContract} />;
  }

  if (!currentContract) {
    return <DashboardNotFound handleSignOut={handleSignOut} />;
  }

  return children({
    currentContract,
    studentRecords,
    isLoadingStudents,
    studentError,
  });
}
