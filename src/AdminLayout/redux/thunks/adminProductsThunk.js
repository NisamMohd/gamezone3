import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const fetchProducts = createAsyncThunk(
    "adminProducts/fetchproducts",
    async (_,{ rejectWithValue }) => {
        try{
            const res = await api.get('/products')
            return res.data
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 
                error.message ||
                "Failed to fetch products"
            )
        }
    }
)