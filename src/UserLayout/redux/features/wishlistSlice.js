import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, fetchWishlist, removeFromWishList } from "./thunks/wishlistThunk";


const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items:[],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchWishlist.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(addToWishlist.fulfilled,(state,action) => {
                const index = state.items.findIndex(
                    (i) => String(i.id) === String(action.payload.id)
                );
                if(index !== -1){
                    state.items[index] = action.payload;
                }else{
                    state.items.push(action.payload);
                }
            })

            .addCase(removeFromWishList.fulfilled, (state, action) => {
                state.items = state.items.filter(
                (i) => String(i.id) !== String(action.payload)
                );
             });
    }
})

export default wishlistSlice.reducer;