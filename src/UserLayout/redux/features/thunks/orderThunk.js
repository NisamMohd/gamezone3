import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../services/api";
import { clearCart } from "../cartSlice";
import { updateProductStock } from "../productSlice";
import { fetchProducts } from "./productThunks";

// CREATE ORDER THUNK
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    { userId, items, shippingAddress, totalAmount, paymentMethod, isDirectBuy },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // 1. Prepare Order Object
      const orderData = {
        userId,
        items: items.map((item) => ({
          productId: item.productId || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          category: item.category || "",
        })),
        shippingAddress,
        totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery",
        status: "Order Confirmed",
        createdAt: new Date().toISOString(),
      };

      // 2. Post order to db.json /orders
      const { data: createdOrder } = await api.post("/orders", orderData);

      // 3. Reduce and update product stock in db.json for each purchased item
      for (const item of items) {
        const prodId = item.productId || item.id;
        const orderedQty = Number(item.quantity) || 1;

        try {
          const { data: prod } = await api.get(`/products/${prodId}`);
          if (prod) {
            const currentStock = prod.stock !== undefined ? Number(prod.stock) : 10;
            const updatedStock = Math.max(0, currentStock - orderedQty);

            // Update in db.json
            await api.patch(`/products/${prodId}`, {
              stock: updatedStock,
            });

            // Update Redux product state immediately
            dispatch(
              updateProductStock({
                productId: prodId,
                newStock: updatedStock,
              })
            );
          }
        } catch (err) {
          console.warn(`Could not update stock for product ${prodId}:`, err);
        }
      }

      // Re-fetch all products to keep entire application state in sync
      dispatch(fetchProducts());

      // 4. Update user's address in db.json under /users/:id
      try {
        await api.patch(`/users/${userId}`, {
          address: shippingAddress,
        });
      } catch (err) {
        console.warn("Could not save address to user profile:", err);
      }

      // 5. If ordered from cart, clear cart in server & redux
      if (!isDirectBuy) {
        try {
          const { data: userCartItems } = await api.get(`/carts?userId=${userId}`);
          for (const item of userCartItems) {
            await api.delete(`/carts/${item.id}`);
          }
          dispatch(clearCart());
        } catch (err) {
          console.warn("Could not clear server cart items:", err);
        }
      }

      return createdOrder;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
    }
  }
);

// FETCH USER ORDERS THUNK
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders?userId=${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch orders"
      );
    }
  }
);

// FETCH USER SAVED ADDRESS THUNK
export const fetchUserAddress = createAsyncThunk(
  "orders/fetchUserAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      return data.address || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user address"
      );
    }
  }
);

// UPDATE USER ADDRESS THUNK
export const updateUserAddress = createAsyncThunk(
  "orders/updateUserAddress",
  async ({ userId, address }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/users/${userId}`, { address });
      return data.address;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user address"
      );
    }
  }
);
