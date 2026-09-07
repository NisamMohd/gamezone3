import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function Admin() {
 
  return (
    <div>
      <NavbarAdmin/>
      <Outlet />
    </div>
  );
}

export default Admin;
