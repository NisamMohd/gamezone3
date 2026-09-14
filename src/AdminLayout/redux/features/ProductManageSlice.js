import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../thunks/adminProductsThunk";

const ProductManageSlice = createSlice({
    name : "adminProducts",
    initialState : {
        items : [],
        status: "idle",
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        // FETCH PRODUCTS
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.items = action.payload;
        })

        // HANDLE PENDING STATE
        .addMatcher(
            (action) => 
                action.type.startsWith("adminProducts/") && action.type.endsWith("/pending"),
            (state) => {state.status = "loading"}
        )

        .addMatcher(
            (action) => 
                action.type.startsWith("adminProducts/") && action.type.endsWith("/rejected"),
            (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            }
        )
    }

})

export default ProductManageSlice.reducer;