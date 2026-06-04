import "../styles/student-overview.css";
import FilterBar from "../components/FilterBar";
import StudentTable from "../components/StudentTable";
import { useState } from "react";
import { students } from "../data/mockStudents";

export default function StudentOverview() {
  // States for filtering students by course, location, and status
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

  const availableForCourse = students.filter((student) => {
    const studentStatus = getStatus(student);

    return (
      (location === "all" || student.location === location) &&
      (status === "all" || studentStatus === status)
    );
  });

  const courseOptions = [
    ...new Set(availableForCourse.map((student) => student.courseName)),
  ];

  const availableForLocation = students.filter((student) => {
    const studentStatus = getStatus(student);

    return (
      (courseName === "all" || student.courseName === courseName) &&
      (status === "all" || studentStatus === status)
    );
  });

  const locationOptions = [
    ...new Set(availableForLocation.map((student) => student.location)),
  ];

  const filteredStudents = students.filter((student) => {
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

      <StudentTable students={filteredStudents} />
    </div>
  );
}
