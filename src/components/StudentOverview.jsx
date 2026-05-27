import "../styles/student-overview.css";
import FilterBar from "./FilterBar";
import StudentTable from "./StudentTable";
import { useState } from "react";

export default function StudentOverview() {
  const [courseName, setCourseName] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="student-overview">
      <div className="header">
        <div className="title m-t-32">
          <h1>Student Overview</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
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
      />
      <StudentTable />
    </div>
  );
}
