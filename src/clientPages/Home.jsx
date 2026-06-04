import "../styles/home.css";
import KeyInsights from "../components/KeyInsights";
import RecentActivity from "../components/RecentActivity";
import Welcome from "../components/Welcome";
import { students } from "../data/mockStudents";

export default function Home({ seatAllocation }) {
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

  const expiringThisMonth = students.filter((student) => {
    const today = new Date();
    const endDate = new Date(student.endDate);

    return (
      endDate.getMonth() === today.getMonth() &&
      endDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const latestUnitCompleted = "Luke completed Unit 6";
  const latestWorkshopAttendance = "Sarah attended Mini MBA workshop";

  return (
    <div className="home">
      <div className="header">
        <Welcome />
        <RecentActivity
          expiringThisMonth={expiringThisMonth}
          inactiveLearners={inactiveLearners}
          latestUnitCompleted={latestUnitCompleted}
          latestWorkshopAttendance={latestWorkshopAttendance}
        />
      </div>
      <KeyInsights
        seatsUsedPercentage={seatsUsedPercentage}
        learnersOnTrackPercentage={learnersOnTrackPercentage}
        inactiveLearners={inactiveLearners}
      />
    </div>
  );
}
