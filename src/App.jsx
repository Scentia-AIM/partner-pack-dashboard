import Sidebar from "./components/Sidebar";
import Home from "./clientPages/Home";
import StudentOverview from "./clientPages/StudentOverview";
import EnrolledCourses from "./clientPages/EnrolledCourses";
import StudentLocations from "./clientPages/StudentLocations";
import AccessFirewall from "./components/AccessFirewall";
import AdminHome from "./adminPages/AdminHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import aimSwoosh from "./assets/aim-swoosh.svg";

function AppFrame({ children, currentContract }) {
  return (
    <div className="main">
      <img className="swoosh" src={aimSwoosh} alt="AIM Swoosh" />
      <Sidebar currentContract={currentContract} />
      <div></div>
      {children}
    </div>
  );
}
export default function App({}) {
  return (
    <BrowserRouter basename="/partner-pack-dashboard/">
      <Routes>
        <Route
          path="/admin"
          element={
            <AppFrame>
              <AdminHome />
            </AppFrame>
          }
        />

        <Route
          path="/:clientName/:contractNumber"
          element={
            <AccessFirewall>
              {({
                currentContract,
                studentRecords,
                isLoadingStudents,
                studentError,
              }) => (
                <AppFrame currentContract={currentContract}>
                  <Home
                    currentContract={currentContract}
                    studentRecords={studentRecords}
                    isLoadingStudents={isLoadingStudents}
                    studentError={studentError}
                  />
                </AppFrame>
              )}
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/students"
          element={
            <AccessFirewall>
              {({
                currentContract,
                studentRecords,
                isLoadingStudents,
                studentError,
              }) => (
                <AppFrame currentContract={currentContract}>
                  <StudentOverview
                    currentContract={currentContract}
                    studentRecords={studentRecords}
                    isLoadingStudents={isLoadingStudents}
                    studentError={studentError}
                  />
                </AppFrame>
              )}
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/enrolled-courses"
          element={
            <AccessFirewall>
              {({
                currentContract,
                studentRecords,
                isLoadingStudents,
                studentError,
              }) => (
                <AppFrame currentContract={currentContract}>
                  <EnrolledCourses
                    currentContract={currentContract}
                    studentRecords={studentRecords}
                    isLoadingStudents={isLoadingStudents}
                    studentError={studentError}
                  />
                </AppFrame>
              )}
            </AccessFirewall>
          }
        />

        <Route
          path="/:clientName/:contractNumber/locations"
          element={
            <AccessFirewall>
              {({
                currentContract,
                studentRecords,
                isLoadingStudents,
                studentError,
              }) => (
                <AppFrame currentContract={currentContract}>
                  <StudentLocations
                    currentContract={currentContract}
                    studentRecords={studentRecords}
                    isLoadingStudents={isLoadingStudents}
                    studentError={studentError}
                  />
                </AppFrame>
              )}
            </AccessFirewall>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
