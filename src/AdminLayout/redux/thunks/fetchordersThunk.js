import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api"


export const fetchOrderList = createAsyncThunk(
    "orderDetails/fetchOrderList",
    async (_, { rejectWithValue }) => {
        try{
            const res = await api.get('/orders')
            return res.data
        }catch(err){
            return rejectWithValue(
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch orders"
            )
        }

    }
)