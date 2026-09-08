import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function Admin() {
  return (
    <div>
      <NavbarAdmin />
      <div className="mt-15">
        <Outlet/>
      </div>
    </div>
  );
}

export default Admin;
