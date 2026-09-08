import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const customerList = createAsyncThunk(
    "users/customerList",
    async (_,{ rejectWithValue }) => {
        try{
            const res = await api.get(`/users?role=customer`)

            return res.data
        }catch(err){
            return rejectWithValue( err.response?.data?.message || "Failed to fetch users")
        }
    }
)