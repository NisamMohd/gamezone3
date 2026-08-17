import React from "react";
import Home from "./UserLayout/pages/Home";
import { Route, Routes } from "react-router-dom";
import Products from "./UserLayout/pages/Products";
import Wishlists from "./UserLayout/pages/Wishlists";
import Register from "./UserLayout/pages/Register";
import Login from "./UserLayout/pages/Login";
import Cart from "./UserLayout/pages/Cart";
import Index from "./UserLayout/pages/Index";
import ProductDetails from "./UserLayout/pages/ProductDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Index />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="wishlists" element={<Wishlists />} />

          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </div>
  );
}

export default App;
