import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../UserLayout/services/api";

export const register = createAsyncThunk(
    'auth/register',
    async ({uname,email,passwd},{rejectWithValue}) =>{
        try{
            const existing = await api.
        }catch(err){

        }
    }
)