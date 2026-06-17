import "../styles/home.css";
import KeyInsights from "../components/KeyInsights";
import RecentActivity from "../components/RecentActivity";
import Welcome from "../components/Welcome";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home({
  currentContract,
  studentRecords,
  isLoadingStudents,
  studentError,
}) {
  const contractSeatAllocation = currentContract.seat_allocation;

  const totalLearners = studentRecords.length;

  const seatsUsedPercentage =
    contractSeatAllocation > 0
      ? Math.round((totalLearners / contractSeatAllocation) * 100)
      : 0;

  const activeLearners = studentRecords.filter((student) => {
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

  const inactiveLearners = studentRecords.filter((student) => {
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

  const expiringThisMonth = studentRecords.filter((student) => {
    const today = new Date();
    const endDate = new Date(student.endDate);

    return (
      endDate.getMonth() === today.getMonth() &&
      endDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const [recentActivityItems, setRecentActivityItems] = useState([]);

  useEffect(() => {
    async function getRecentActivity() {
      if (!currentContract?.id) return;

      const { data, error } = await supabase
        .from("recent_activity")
        .select("*")
        .eq("contract_id", currentContract.id)
        .order("created_at", { ascending: false })
        .limit(2);

      setRecentActivityItems(data);
    }

    getRecentActivity();
  }, [currentContract?.id]);

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
          isLoading={isLoadingStudents}
          activityItems={recentActivityItems}
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
