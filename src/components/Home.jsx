import "../styles/home.css";
import KeyInsights from "./KeyInsights";
import RecentActivity from "./RecentActivity";
import Welcome from "./Welcome";

export default function Home() {
  return (
    <div className="home">
      <div className="header">
        <Welcome />
        <RecentActivity />
      </div>
      <KeyInsights />
    </div>
  );
}
