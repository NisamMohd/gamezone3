import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const addProduct =
  ("adminProducts/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await api.post(`/products`, productData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to Add data",
      );
    }
  });
