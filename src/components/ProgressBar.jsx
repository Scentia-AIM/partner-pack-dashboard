export default function ProgressBar({ unitsCompleted, totalUnits }) {
  const progress = Number((unitsCompleted / totalUnits) * 100).toFixed(0);
  return (
    <div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}>
          {progress}%
        </div>
      </div>
      <p className="unit-count">
        {unitsCompleted} out of {totalUnits} units
      </p>
    </div>
  );
}
