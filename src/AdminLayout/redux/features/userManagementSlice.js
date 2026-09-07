import { createSlice } from "@reduxjs/toolkit";
import { customerList } from "../thunks/customerThunk";


const userManagementSlice = createSlice({
    name : 'users',
    initialState : {
        items : [],
        status : 'idle',
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        // Customers
            .addCase(customerList.fulfilled, ( state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
        
        
        // handles pending and rejected actions
            .addMatcher(
            (action) => action.type.startsWith("users/") && action.type.endsWith("/pending"),
            (state) => {
                state.status = 'loading';
                state.error = null;
            })

            .addMatcher(
                (action) => action.type.startsWith("users/") && action.type.endsWith("/rejected"),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            )
    }
})