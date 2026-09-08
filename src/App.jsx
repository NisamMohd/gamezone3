import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./UserLayout/pages/Home";
import Index from "./UserLayout/pages/Index";
import Products from "./UserLayout/pages/Products";
import ProductDetails from "./UserLayout/pages/ProductDetails";
import Wishlists from "./UserLayout/pages/Wishlists";
import Cart from "./UserLayout/pages/Cart";
import CheckOut from "./UserLayout/pages/CheckOut";
import Orders from "./UserLayout/pages/Orders";
import Settings from "./UserLayout/pages/Settings";
import Register from "./UserLayout/pages/Register";
import Login from "./UserLayout/pages/Login";
import ProtectedRoute from "./UserLayout/services/ProtectedRoute";
import PublicRoute from "./UserLayout/services/PublicRoute";
import Admin from "./AdminLayout/pages/Admin";
import Dashboard from "./AdminLayout/pages/Dashboard";
import AdminRoute from "./services/AdminRoute";
import UserRoutes from "./UserLayout/services/UserRoutes";
import UserManagement from "./AdminLayout/pages/UserManagment"
function App() {
  return (
    <Routes>
      {/* User Routes  */}

      {/* MAIN APPLICATION LAYOUT (NAVBAR + OUTLET) */}
      <Route element={<UserRoutes/>}>
        <Route path="/" element={<Home />}>
          {/* PUBLIC OPEN ACCESS ROUTES */}
          <Route index element={<Index />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />

          {/* PROTECTED AUTHENTICATED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="wishlists" element={<Wishlists />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* GUEST-ONLY PUBLIC ROUTES (BLOCKED WHEN LOGGED IN) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN PROTECTED ROUTES */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="usermanagment" element={<UserManagement/>} />
        </Route>
      </Route>

      {/* CATCH-ALL REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
