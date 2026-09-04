import { createSlice } from "@reduxjs/toolkit";

const loadUser = () =>{
    try{
        const stored = localStorage.getItem("gamezone_user")
        return stored ? JSON.parse(stored) : null
    }catch{
        return null
    }
}

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : loadUser(),
        status : 'idle',
        error : null
    },
    reducers : {
        logout : (state) => {
            state.user = null
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('gamezone_user')
        },
        clearAuthError : (state) =>{
            state.error = null
        }
    },
    extraReducers : (builder) => {
        builder
    }
})