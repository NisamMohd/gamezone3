import { configureStore } from "@reduxjs/toolkit";
import productReducer from './features/productSlice'
import cartReducer from './features/cartSlice'
import wishlistReducer from './features/wishlistSlice'
import orderReducer from './features/orderSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer,
    }
})