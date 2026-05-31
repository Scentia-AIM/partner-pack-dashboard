import "../styles/home.css";
import KeyInsights from "./KeyInsights";
import RecentActivity from "./RecentActivity";
import Welcome from "./Welcome";
import { students } from "../data/mockStudents";

export default function Home() {
  //Seat Allocation
  const seatAllocation = 10;

  const totalLearners = students.length;

  const seatsUsedPercentage = Math.round(
    (totalLearners / seatAllocation) * 100,
  );

  const activeLearners = students.filter((student) => {
    const progress = Math.round(
      (student.unitsCompleted / student.totalUnits) * 100,
    );

    if (progress === 0 || progress === 100) return false;

    const daysSinceProgress = Math.floor(
      (new Date() - new Date(student.lastProgressDate)) / (1000 * 60 * 60 * 24),
    );

    return daysSinceProgress <= 30;
  }).length;

  const inactiveLearners = students.filter((student) => {
    const progress = Math.round(
      (student.unitsCompleted / student.totalUnits) * 100,
    );

    if (progress === 0 || progress === 100) return false;

    const daysSinceProgress = Math.floor(
      (new Date() - new Date(student.lastProgressDate)) / (1000 * 60 * 60 * 24),
    );

    return daysSinceProgress > 30;
  }).length;

  const learnersOnTrackPercentage = Math.round(
    (activeLearners / totalLearners) * 100,
  );

  return (
    <div className="home">
      <div className="header">
        <Welcome />
        <RecentActivity />
      </div>
      <KeyInsights
        seatsUsedPercentage={seatsUsedPercentage}
        learnersOnTrackPercentage={learnersOnTrackPercentage}
        inactiveLearners={inactiveLearners}
      />
    </div>
  );
}
