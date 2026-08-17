import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";


export const fetchWishlists = createAsyncThunk(
    "wishlists/fetchWishlists",
    async (userId) => {
        const res = await api.get(`/wishlists?userId=${userId}`)
        return res;
    }
)

