import "../styles/student-overview.css";
import FilterBar from "../components/FilterBar";
import StudentTable from "../components/StudentTable";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StudentOverview() {
  const REST_SUPER_CONTRACT_ID = "2ddab48f-b288-4298-bd27-54b4931739f7";

  const [studentRecords, setStudentRecords] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState("");

  useEffect(() => {
    async function getStudentRecords() {
      setIsLoadingStudents(true);
      setStudentError("");

      const { data, error } = await supabase
        .from("student_records")
        .select("*")
        .eq("contract_id", REST_SUPER_CONTRACT_ID)
        .order("learner_name", { ascending: true });

      if (error) {
        console.error("Student records error:", error);
        setStudentError("Could not load student records.");
        setIsLoadingStudents(false);
        return;
      }

      const formattedStudents = data.map((student) => ({
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

      setStudentRecords(formattedStudents);
      setIsLoadingStudents(false);
    }

    getStudentRecords();
  }, []);

  const [courseName, setCourseName] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");

  const getStatus = (student) => {
    const progress = Math.round(
      (student.unitsCompleted / student.totalUnits) * 100,
    );

    if (progress === 100) return "complete";

    if (progress === 0) return "not_started";

    const daysSinceProgress = Math.floor(
      (new Date() - new Date(student.lastProgressDate)) / (1000 * 60 * 60 * 24),
    );

    return daysSinceProgress <= 30 ? "active" : "inactive";
  };

  const availableForCourse = studentRecords.filter((student) => {
    const studentStatus = getStatus(student);

    return (
      (location === "all" || student.location === location) &&
      (status === "all" || studentStatus === status)
    );
  });

  const courseOptions = [
    ...new Set(availableForCourse.map((student) => student.courseName)),
  ];

  const availableForLocation = studentRecords.filter((student) => {
    const studentStatus = getStatus(student);

    return (
      (courseName === "all" || student.courseName === courseName) &&
      (status === "all" || studentStatus === status)
    );
  });

  const locationOptions = [
    ...new Set(availableForLocation.map((student) => student.location)),
  ];

  const filteredStudents = studentRecords.filter((student) => {
    const studentStatus = getStatus(student);

    const matchesCourse =
      courseName === "all" || student.courseName === courseName;

    const matchesLocation = location === "all" || student.location === location;

    const matchesStatus = status === "all" || studentStatus === status;

    return matchesCourse && matchesLocation && matchesStatus;
  });

  function resetFilters() {
    setCourseName("all");
    setLocation("all");
    setStatus("all");
  }

  return (
    <div className="student-overview">
      <div className="header">
        <div className="title m-t-32">
          <h1>Student Overview</h1>
          <p>
            View learner enrolments, progress and completion timelines in one
            place. Use filters to monitor activity, review course progress and
            identify learners who may need follow-up.
          </p>
        </div>
      </div>

      <FilterBar
        courseName={courseName}
        setCourseName={setCourseName}
        location={location}
        setLocation={setLocation}
        status={status}
        setStatus={setStatus}
        courseOptions={courseOptions}
        locationOptions={locationOptions}
        resetFilters={resetFilters}
      />

      <StudentTable
        students={filteredStudents}
        isLoadingStudents={isLoadingStudents}
        studentError={studentError}
      />
    </div>
  );
}
