import api from "../../../services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlists",
    async (userId) => {
        const res = await api.get(`/wishlists?userId=${userId}`)
        return res.data
    }
)


export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async(product, userId, {getState}) => {
        const { items } = getState().wishlist;

        const existing = items.find(
            (i) => String(i.productId) === String(product.id)
        );

        if(existing){
            return existing;
        }

        const res = await api.post("/wishlists", {
            userId,
            productId: product.id,
            title: product.title,
            price: product.price,
            image : product.image,
        });

        return res.data
    }
)

export const removeFromWishList = createAsyncThunk(
  "wishlist/removeFromWishList",
  async (id) => {
    await api.delete(`/wishlists/${id}`);
    return id;
  },
);