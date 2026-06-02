import "../styles/student-locations.css";
import LocationCard from "../components/LocationCard";

export default function Locations() {
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
        <LocationCard />
        <LocationCard />
        <LocationCard />
        <LocationCard />
        <LocationCard />
      </div>
    </div>
  );
}
