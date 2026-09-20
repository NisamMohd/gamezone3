import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const addUser = createAsyncThunk(
  "users/addUser",
  async (userinfo, { rejectWithValue }) => {
    try {
      const existing = await api.get(
        `/users?email=${encodeURIComponent(userinfo.email)}`
      );

      if (existing.data.length > 0) {
        return rejectWithValue("An account with this email already exists");
      }

      const res = await api.post("/users", {
        name: userinfo.name,
        email: userinfo.email,
        password: userinfo.password,
        role: userinfo.role || "customer",
        createdAt: new Date().toISOString(),
        isOnline: false,
        isBlocked: false,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create user"
      );
    }
  }
);
