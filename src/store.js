import { configureStore } from "@reduxjs/toolkit";
import productReducer from './UserLayout/redux/features/productSlice'
import cartReducer from './UserLayout/redux/features/cartSlice'
import wishlistReducer from './UserLayout/redux/features/wishlistSlice'
import orderReducer from './UserLayout/redux/features/orderSlice'
import authReducer from './features/authSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer,
        auth: authReducer
    }
})