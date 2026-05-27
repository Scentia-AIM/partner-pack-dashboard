export default function StatusPill({
  unitsCompleted,
  totalUnits,
  lastProgressDate,
}) {
  let className = "status-pill";
  let text = "";

  const progress = Math.round((unitsCompleted / totalUnits) * 100);

  const today = new Date();
  const lastProgress = new Date(lastProgressDate);

  const daysSinceProgress = Math.floor(
    (today - lastProgress) / (1000 * 60 * 60 * 24),
  );

  if (progress === 100) {
    className += " complete";
    text = "Complete";
  } else if (progress === 0) {
    className += " not-started";
    text = "Not Started";
  } else if (daysSinceProgress <= 30) {
    className += " active";
    text = "Active";
  } else {
    className += " inactive";
    text = "Inactive";
  }

  return <div className={className}>{text}</div>;
}
