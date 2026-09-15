import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId, { rejectWithValue }) => {
        try{
            await api.delete(`/users/${userId}`)
            return userId;
        }catch (error) {
            return rejectWithValue (
                error.response?.data?.message || "Failed to delete User"
            )
        }
    }
)