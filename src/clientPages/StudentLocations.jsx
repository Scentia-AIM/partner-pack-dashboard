import "../styles/student-locations.css";
import LocationCard from "../components/LocationCard";

export default function Locations({
  currentContract,
  studentRecords,
  isLoadingStudents,
  studentError,
}) {
  const locationCounts = studentRecords.reduce((counts, student) => {
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
