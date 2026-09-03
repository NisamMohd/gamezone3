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

function App() {
  return (
    <Routes>
      {/* User Routes  */}

      {/* MAIN APPLICATION LAYOUT (NAVBAR + OUTLET) */}
      <Route path="/" element={<Home />}>
        {/* PUBLIC OPEN ACCESS ROUTES */}
        <Route index element={<Index />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />

        {/* PROTECTED AUTHENTICATED ROUTES */}
        <Route
          path="wishlists"
          element={
            <ProtectedRoute>
              <Wishlists />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* GUEST-ONLY PUBLIC ROUTES (BLOCKED WHEN LOGGED IN) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* CATCH-ALL REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
