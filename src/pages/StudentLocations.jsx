import "../styles/student-locations.css";
import LocationCard from "../components/LocationCard";
import { students } from "../data/mockStudents";

export default function Locations() {
  const locationCounts = students.reduce((counts, student) => {
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
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
