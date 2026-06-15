import "../styles/home.css";
import KeyInsights from "../components/KeyInsights";
import RecentActivity from "../components/RecentActivity";
import Welcome from "../components/Welcome";

export default function Home({
  currentContract,
  studentRecords,
  isLoadingStudents,
  studentError,
}) {
  const contractStudents = studentRecords;
  const contractSeatAllocation = currentContract.seat_allocation;

  const totalLearners = contractStudents.length;

  const seatsUsedPercentage =
    contractSeatAllocation > 0
      ? Math.round((totalLearners / contractSeatAllocation) * 100)
      : 0;

  const activeLearners = contractStudents.filter((student) => {
    const progress = Math.round(
      (student.unitsCompleted / student.totalUnits) * 100,
    );

    if (progress === 0 || progress === 100) return false;
    if (!student.lastProgressDate) return false;

    const daysSinceProgress = Math.floor(
      (new Date() - new Date(student.lastProgressDate)) / (1000 * 60 * 60 * 24),
    );

    return daysSinceProgress <= 30;
  }).length;

  const inactiveLearners = contractStudents.filter((student) => {
    const progress = Math.round(
      (student.unitsCompleted / student.totalUnits) * 100,
    );

    if (progress === 0 || progress === 100) return false;
    if (!student.lastProgressDate) return false;

    const daysSinceProgress = Math.floor(
      (new Date() - new Date(student.lastProgressDate)) / (1000 * 60 * 60 * 24),
    );

    return daysSinceProgress > 30;
  }).length;

  const learnersOnTrackPercentage =
    totalLearners > 0 ? Math.round((activeLearners / totalLearners) * 100) : 0;

  const expiringThisMonth = contractStudents.filter((student) => {
    const today = new Date();
    const endDate = new Date(student.endDate);

    return (
      endDate.getMonth() === today.getMonth() &&
      endDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const latestUnitCompleted = "Luke completed Unit 6";
  const latestWorkshopAttendance = "Sarah attended Mini MBA workshop";

  if (studentError) {
    return <p className="m-t-32">{studentError}</p>;
  }

  return (
    <div className="home">
      <div className="header">
        <Welcome />
        <RecentActivity
          expiringThisMonth={expiringThisMonth}
          inactiveLearners={inactiveLearners}
          latestUnitCompleted={latestUnitCompleted}
          latestWorkshopAttendance={latestWorkshopAttendance}
          isLoading={isLoadingStudents}
        />
      </div>

      <KeyInsights
        seatsUsedPercentage={seatsUsedPercentage}
        learnersOnTrackPercentage={learnersOnTrackPercentage}
        inactiveLearners={inactiveLearners}
        isLoading={isLoadingStudents}
      />
    </div>
  );
}
