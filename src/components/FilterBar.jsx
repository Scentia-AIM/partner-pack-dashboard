export default function FilterBar({
  courseName,
  setCourseName,
  location,
  setLocation,
  courseOptions,
  locationOptions,
  status,
  setStatus,
  resetFilters,
}) {
  return (
    <div className="filter-bar m-t-64">
      <select
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      >
        <option value="all">All Courses</option>

        {courseOptions.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="all">All Locations</option>

        {locationOptions.map((place) => (
          <option key={place} value={place}>
            {place}
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="complete">Complete</option>
        <option value="not_started">Not Started</option>
      </select>
      <button className="btn primary" type="button" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
