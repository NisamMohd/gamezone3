import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../services/api";

export const fetchCarts = createAsyncThunk(
    "carts/fetchCarts",
    async (userId)=>{
        const res = await api.get(`/carts?userId=${userId}`)
        return res.data
    }
)

export function calculatedTotal(items){
    return items.reduce((sum,item) => sum + item.price * item.quantity, 0)
}

export const addToCart = createAsyncThunk(
  "carts/addToCarts",
  async ({ product, userId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { items } = state.cart;
      const products = state.products?.products || [];
      const prod = products.find((p) => String(p.id) === String(product.id)) || product;
      const availableStock = Number(
        prod.stock !== undefined ? prod.stock : product.stock !== undefined ? product.stock : 0
      );

      const existing = items.find(
        (i) => String(i.productId) === String(product.id)
      );

      const currentQty = existing ? Number(existing.quantity) : 0;
      const addAmount = Number(quantity) || 1;
      const targetQty = currentQty + addAmount;

      if (availableStock <= 0 || targetQty > availableStock) {
        return rejectWithValue("Not enough stock available");
      }

      if (existing) {
        const res = await api.patch(`/carts/${existing.id}`, {
          quantity: targetQty,
        });
        return res.data;
      }

      const res = await api.post("/carts", {
        userId,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category || "",
        quantity: addAmount,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to add to cart"
      );
    }
  }
);

export const incrementQty = createAsyncThunk(
  "carts/incrementQty",
  async (item, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const products = state.products?.products || [];
      const product = products.find((p) => String(p.id) === String(item.productId));
      const availableStock = product
        ? Number(product.stock !== undefined ? product.stock : 0)
        : item.stock !== undefined
        ? Number(item.stock)
        : Infinity;

      if (Number(item.quantity) >= availableStock || availableStock <= 0) {
        return rejectWithValue("Not enough stock available");
      }

      const res = await api.patch(`/carts/${item.id}`, {
        quantity: Number(item.quantity) + 1,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to increment"
      );
    }
  }
);


export const decrementQty = createAsyncThunk(
  "carts/decrementQty",
  async (item, { rejectWithValue }) => {
    if (item.quantity <= 1) {
      return rejectWithValue("Minimum quantity reached");
    }
    const res = await api.patch(`/carts/${item.id}`, {
      quantity: item.quantity - 1,
    });

    return res.data;
  }
);

export const remove = createAsyncThunk(
  "carts/remove",
  async (id) => {
    await api.delete(`/carts/${id}`)
    return id;
  }
)

export const clearCartAsync = createAsyncThunk(
  "carts/clearCartAsync",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().cart;
      await Promise.all(items.map((item) => api.delete(`/carts/${item.id}`)));
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


