import api from "../services/api";
import { logout } from "../features/authSlice";
import { clearCart } from "../UserLayout/redux/features/cartSlice";
import { clearWishlist } from "../UserLayout/redux/features/wishlistSlice";
import { clearOrders } from "../UserLayout/redux/features/orderSlice";

export const Logout = async (dispatch, userId) => {
  try {
    if (userId) {
      await api.patch(`/users/${userId}`, { isOnline: false });
    }
  } catch (error) {
    console.error("Failed to update user offline status:", error);
  } finally {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(clearOrders());
  }
};