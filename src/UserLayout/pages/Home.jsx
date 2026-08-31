import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchWishlist } from "../redux/features/thunks/wishlistThunk";
import { fetchCarts } from "../redux/features/thunks/cartThunk";

function Home() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist(user.id));
      dispatch(fetchCarts(user.id));
    }
  }, [user, dispatch]);

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