import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Home;