import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const toggleBlockuser = createAsyncThunk(
  "users/toggleBlockuser",
  async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${userId}`, {
        isBlocked: Boolean(isBlocked),
      });

      if (!res.data) throw new Error("Failed to update block status");

      return res.data;
    } catch (err){
        return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
);
