import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../UserLayout/services/api";

export const register = createAsyncThunk(
    'auth/register',
    async ({uname,email,passwd},{rejectWithValue}) =>{
        try{
            const existing = await api.get(`/users?email=${encodeURIComponent(email)}`)

            if(existing.data.length > 0){
                return rejectWithValue('An account with this email already exists')
            }

            const res = await api.post('/users',{
                name : uname,
                email,
                password : passwd,
                role : "customer",
                createdAt : new Date().toISOString
            })

            return res.data
        }catch(err){
            return rejectWithValue(err.response?.data?.message || 'Registration failed')
        }
    }
)