export default function FilterBar({
  courseName,
  setCourseName,
  location,
  setLocation,
  status,
  setStatus,
}) {
  return (
    <div className="filter-bar m-t-64">
      <select
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      >
        <option value="all">All Courses</option>
        <option value="full_stack">Full Stack Development</option>
        <option value="data_science">Data Science</option>
        <option value="cyber_security">Cyber Security</option>
        <option value="cloud_computing">Cloud Computing</option>
        <option value="short_course">Short Course</option>
      </select>
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="all">All Locations</option>
        <option value="melbourne">Melbourne</option>
        <option value="sydney">Sydney</option>
        <option value="brisbane">Brisbane</option>
        <option value="perth">Perth</option>
        <option value="adelaide">Adelaide</option>
        <option value="canberra">Canberra</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Complete</option>
        <option value="inactive">Inactive</option>
        <option value="not_started">Not Started</option>
      </select>
      <button className="btn primary">Reset</button>
    </div>
  );
}
