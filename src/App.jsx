import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import StudentOverview from "./pages/StudentOverview";
import EnrolledCourses from "./pages/EnrolledCourses";
import StudentLocations from "./pages/StudentLocations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import aimSwoosh from "./assets/aim-swoosh.svg";

export default function App() {
  const seatAllocation = 10;
  return (
    <BrowserRouter basename="/partner-pack-dashboard">
      <div className="main">
        <img className="swoosh" src={aimSwoosh} alt="AIM Swoosh" />
        <Sidebar seatAllocation={seatAllocation} />
        <div></div>
        <Routes>
          <Route path="/" element={<Home seatAllocation={seatAllocation} />} />
          <Route path="/students" element={<StudentOverview />} />
          <Route path="/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/locations" element={<StudentLocations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
