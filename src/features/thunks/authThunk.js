import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const register = createAsyncThunk(
  "auth/register",
  async (userinfo, { rejectWithValue }) => {
    try {
      const existing = await api.get(`/users?email=${encodeURIComponent(userinfo.email)}`);

      if (existing.data.length > 0) {
        return rejectWithValue("An account with this email already exists");
      }

      const res = await api.post("/users", {
        name: userinfo.name,
        email: userinfo.email,
        password: userinfo.password,
        role: "customer",
        createdAt: new Date().toISOString(), // FIX #6: was missing ()
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);