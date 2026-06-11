import Sidebar from "./components/Sidebar";
import Home from "./clientPages/Home";
import StudentOverview from "./clientPages/StudentOverview";
import EnrolledCourses from "./clientPages/EnrolledCourses";
import StudentLocations from "./clientPages/StudentLocations";
import AccessFirewall from "./components/AccessFirewall";
import AdminHome from "./adminPages/AdminHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import aimSwoosh from "./assets/aim-swoosh.svg";

function AppFrame({ children, seatAllocation }) {
  return (
    <>
      <div className="main">
        <img className="swoosh" src={aimSwoosh} alt="AIM Swoosh" />
        <Sidebar seatAllocation={seatAllocation} />
        <div></div>
        {children}
      </div>
      <div className="footer"></div>
    </>
  );
}

export default function App() {
  const seatAllocation = 10;

  return (
    <BrowserRouter basename="/partner-pack-dashboard/">
      <Routes>
        <Route
          path="/admin"
          element={
            <AppFrame seatAllocation={seatAllocation}>
              <AdminHome />
            </AppFrame>
          }
        />

        <Route
          path="/:clientName/:contractNumber"
          element={
            <AccessFirewall>
              <AppFrame seatAllocation={seatAllocation}>
                <Home seatAllocation={seatAllocation} />
              </AppFrame>
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/students"
          element={
            <AccessFirewall>
              <AppFrame seatAllocation={seatAllocation}>
                <StudentOverview />
              </AppFrame>
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/enrolled-courses"
          element={
            <AccessFirewall>
              <AppFrame seatAllocation={seatAllocation}>
                <EnrolledCourses />
              </AppFrame>
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/locations"
          element={
            <AccessFirewall>
              <AppFrame seatAllocation={seatAllocation}>
                <StudentLocations />
              </AppFrame>
            </AccessFirewall>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
