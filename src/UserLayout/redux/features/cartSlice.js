import { createSlice } from "@reduxjs/toolkit";
import { addToCart, fetchCarts, incrementQty, decrementQty, remove } from "./thunks/cartThunk";
import { calculatedTotal } from "./thunks/cartThunk";
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items : [],
        status : "idle",
        total : 0
    },

    extraReducers: (builder) => {
        builder

        //FETCH-CART
            .addCase(fetchCarts.pending,(state) => {
                state.status = "loading" 
            })

            .addCase(fetchCarts.fulfilled,(state,action) => {
                ((state.status = "succeeded"), (state.items = action.payload), state.total = calculatedTotal(state.items));
            })

            .addCase(fetchCarts.rejected,(state) => {
                state.status = "failed"
            })

        //ADD TO CART
            .addCase(addToCart.pending, (state)=>{
                state.status = "loading"
            })

            .addCase(addToCart.fulfilled, (state, action) =>{
                    state.status = "succeeded"; 
                    const index = state.items.findIndex(
                        (item) => (item.id === action.payload.id)
                    );
                    if(index != -1){
                        state.items[index] = action.payload;
                    }else{
                    state.items.push(action.payload)
                    }
            })

            //Increment Qty
            .addCase(incrementQty.fulfilled, (state, action) => {
                    state.status = "succeeded";

                    const updatedItem = action.payload;

                    const index = state.items.findIndex(
                        (item) => item.id === updatedItem.id
                    );

                    if (index !== -1) {
                        state.items[index] = updatedItem;
                    }

                    state.total = calculatedTotal(state.items);
                    })

            .addCase(incrementQty.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || action.error.message;
                    })

            // Decrement Qty
            .addCase(decrementQty.fulfilled, (state, action) => {
                    state.status = "succeeded";

                    const updatedItem = action.payload;

                    const index = state.items.findIndex(
                        (item) => item.id === updatedItem.id
                    );

                    if (index !== -1) {
                        state.items[index] = updatedItem;
                    }

                    state.total = calculatedTotal(state.items);
                    })

            .addCase(decrementQty.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || action.error.message;
                    })

            //Remove
            .addCase(remove.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = state.items.filter((i) => i.id !== action.payload)
                state.total = calculatedTotal(state.items)
            })

            .addCase(remove.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || action.error.message
            })

}})

export default cartSlice.reducer;