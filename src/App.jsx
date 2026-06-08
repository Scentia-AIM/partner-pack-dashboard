import Sidebar from "./components/Sidebar";
import Home from "./clientPages/Home";
import StudentOverview from "./clientPages/StudentOverview";
import EnrolledCourses from "./clientPages/EnrolledCourses";
import StudentLocations from "./clientPages/StudentLocations";
import AdminHome from "./adminPages/AdminHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import aimSwoosh from "./assets/aim-swoosh.svg";

export default function App() {
  const seatAllocation = 10;
  return (
    <BrowserRouter basename="/partner-pack-dashboard/">
      <div className="main">
        <img className="swoosh" src={aimSwoosh} alt="AIM Swoosh" />
        <Sidebar seatAllocation={seatAllocation} />
        <div></div>
        <Routes>
          <Route path="/" element={<Home seatAllocation={seatAllocation} />} />
          <Route path="/students" element={<StudentOverview />} />
          <Route path="/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/locations" element={<StudentLocations />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
