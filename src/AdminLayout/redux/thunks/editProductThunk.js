import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const editProduct = createAsyncThunk(
  "adminProducts/editProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/products/${id}`, productData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to Update product"
      );
    }
  }
);
