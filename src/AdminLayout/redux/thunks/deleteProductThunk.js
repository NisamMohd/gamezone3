import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/products/${productId}`);
      return productId;
    } catch (err){
        return rejectWithValue(
            error.response?.data?.message || 
            err.message ||
            "Failed attempt to Delete product"
        )
    }
  },
);
