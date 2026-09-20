import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderList } from "../thunks/fetchordersThunk";


const orderDetailsSlice = createSlice({
    name : "orderDetails",
    initialState : {
        status : "idle",
        items : [],
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchOrderList.pending, (state) => {
                state.status = "loading"
            })

            .addCase(fetchOrderList.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.items = action.payload
            })

            .addCase(fetchOrderList.rejected, (state) => {
                state.status = "failed"
                state.error = action.payload
            })
    }
})

export default orderDetailsSlice.reducer;