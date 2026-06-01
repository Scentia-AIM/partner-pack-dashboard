import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import StudentOverview from "./components/StudentOverview";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const seatAllocation = 10;
  return (
    <BrowserRouter basename="/partner-pack-dashboard">
      <div className="main">
        <img className="swoosh" src="/assets/aim-swoosh.svg" alt="AIM Swoosh" />
        <Sidebar seatAllocation={seatAllocation} />
        <div></div>
        <Routes>
          <Route path="/" element={<Home seatAllocation={seatAllocation} />} />
          <Route path="/students" element={<StudentOverview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
