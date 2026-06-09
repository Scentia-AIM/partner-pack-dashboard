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
          <Route path="/admin" element={<AdminHome />} />

          <Route
            path="/:clientName/:contractNumber"
            element={<Home seatAllocation={seatAllocation} />}
          />

          <Route
            path="/:clientName/:contractNumber/students"
            element={<StudentOverview />}
          />

          <Route
            path="/:clientName/:contractNumber/enrolled-courses"
            element={<EnrolledCourses />}
          />

          <Route
            path="/:clientName/:contractNumber/locations"
            element={<StudentLocations />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
