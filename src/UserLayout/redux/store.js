import { configureStore } from "@reduxjs/toolkit";
import productReducer  from './features/productSlice'
import cartReducer from './features/cartSlice'
import wishlistReducer from './features/wishlistSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
})