import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import StudentOverview from "./components/StudentOverview";

export default function App() {
  return (
    <div className="main">
      <img
        className="swoosh"
        src="src/assets/aim-swoosh.svg"
        alt="AIM Swoosh"
      />
      <Sidebar />
      <div></div>
      {/* <Home /> */}
      <StudentOverview />
    </div>
  );
}
