import api from "../../../services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlists",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/wishlists?userId=${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ product, userId }, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().wishlist;

      const existing = items.find(
        (i) =>
          String(i.productId) === String(product.id) &&
          String(i.userId) === String(userId)
      );

      if (existing) {
        return existing;
      }

      const res = await api.post("/wishlists", {
        userId,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category || "",
        stock: product.stock !== undefined ? product.stock : 10,
        description: product.description || "",
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFromWishList = createAsyncThunk(
  "wishlist/removeFromWishList",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/wishlists/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ product, userId }, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().wishlist;

      const existing = items.find(
        (i) =>
          String(i.productId) === String(product.id) &&
          String(i.userId) === String(userId)
      );

      if (existing) {
        await api.delete(`/wishlists/${existing.id}`);
        return { action: "remove", id: existing.id, productId: product.id };
      } else {
        const res = await api.post("/wishlists", {
          userId,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category || "",
          stock: product.stock !== undefined ? product.stock : 10,
          description: product.description || "",
        });
        return { action: "add", item: res.data };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clearWishlistAsync",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().wishlist;
      await Promise.all(items.map((item) => api.delete(`/wishlists/${item.id}`)));
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);