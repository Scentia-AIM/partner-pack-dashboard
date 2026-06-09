import "../styles/student-locations.css";
import LocationCard from "../components/LocationCard";
import { students } from "../data/mockStudents";
import { useLocation } from "react-router-dom";

function createSlug(text) {
  return text.toLowerCase().replaceAll(" ", "-");
}

export default function Locations() {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);

  const clientName = pathParts[0];
  const contractNumber = pathParts[1];

  const contractStudents = students.filter((student) => {
    if (!clientName || !contractNumber) return true;

    const studentClientSlug = createSlug(student.clientName);

    const matchesClient = studentClientSlug === clientName;
    const matchesContract = student.contractNumber === contractNumber;

    return matchesClient && matchesContract;
  });

  const locationCounts = contractStudents.reduce((counts, student) => {
    const location = student.location;

    counts[location] = (counts[location] || 0) + 1;

    return counts;
  }, {});

  return (
    <div className="student-locations">
      <div className="header">
        <div className="title m-t-32">
          <h1>Student Locations</h1>
          <p>
            Review each learner's enrolled courses, progress and key milestones.
            This page helps you monitor individual learning journeys and see
            where learners are up to.
          </p>
        </div>
      </div>

      <div className="m-t-64 col-3 gap-32">
        {Object.keys(locationCounts).map((location) => (
          <LocationCard
            key={location}
            location={location}
            count={locationCounts[location]}
          />
        ))}
      </div>
    </div>
  );
}
