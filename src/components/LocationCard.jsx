export default function LocationCard({ location, count }) {
  return (
    <div className="card location">
      <img
        src="https://images.pexels.com/photos/8436835/pexels-photo-8436835.jpeg?_gl=1*oregl5*_ga*MTYwMzY2MzY0MS4xNzgwMzY5MzQz*_ga_8JE65Q40S6*czE3ODAzNjkzNDIkbzEkZzEkdDE3ODAzNjkzOTUkajckbDAkaDA."
        alt="City"
      />
      <div>
        <h3>{location}</h3>
        <p>
          {count} {count > 1 ? "Students" : "Student"}
        </p>
      </div>
    </div>
  );
}
