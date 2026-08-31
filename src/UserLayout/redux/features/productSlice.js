import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./thunks/productThunks";

const initialState = {
    products:[],
    loading : false,
    error: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers:{
        updateProductStock: (state, action) => {
            const { productId, newStock } = action.payload;
            const prod = state.products.find((p) => String(p.id) === String(productId));
            if (prod) {
                prod.stock = newStock;
            }
        },
    },
    extraReducers: (builder) => {
        builder

        // FETCHPRODUCTS
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })

            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }
})

export const { updateProductStock } = productSlice.actions;
export default productSlice.reducer;