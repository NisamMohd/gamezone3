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
        createdAt: new Date().toISOString(), 
        status : "online",
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (!res.data || res.data.length === 0) {
        return rejectWithValue("Invalid email or password");
      }

      const status = await api.patch(`/users?${res.data?.id}`,{
        status : "online"
      })
      if(!status.data || status.data.length === 0){
        return rejectWithValue("can.t update status")
      }

      return res.data[0];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);