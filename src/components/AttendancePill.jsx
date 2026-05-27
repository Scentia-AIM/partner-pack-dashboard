export default function AttendancePill({ attended, endDate }) {
  let className = "status-pill";
  let text = "";

  const today = new Date();
  const courseDate = new Date(endDate);

  return (
    <div className="attendance-pill">
      <div>
        {attended === true ? (
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.8335 8.50002L6.33957 12.0061L13.8532 4.49316"
              stroke="#15134F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.7281 12.7279L16.9707 16.9705M16.9707 16.9705L21.2133 21.2132M16.9707 16.9705L12.7281 21.2132M16.9707 16.9705L21.2133 12.7279"
              stroke="#15134F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
      </div>
      {attended === true
        ? "Attended course"
        : courseDate < today
          ? "Did not attend"
          : "Not yet attended"}
    </div>
  );
}
