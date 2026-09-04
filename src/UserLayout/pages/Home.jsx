import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../redux/features/thunks/wishlistThunk";
import { fetchCarts } from "../redux/features/thunks/cartThunk";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
      dispatch(fetchCarts(user.id));
    }
  }, [user?.id, dispatch]);

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