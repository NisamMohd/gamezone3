import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const fetchCarts = createAsyncThunk(
    "carts/fetchCarts",
    async (userId)=>{
        const res = await api.get(`/carts?userId=${userId}`)
        return res.data
    }
)

export function calculatedTotal(items){
    return items.reduce((sum,item) => sum + item.price * item.quantity, 0)
}

export const addToCart = createAsyncThunk(
  "carts/addToCarts",
  async ({ product, userId }, { getState }) => {
    const { items } = getState().cart;

    
    const existing = items.find(
      (i) => i.productId === product.id
    );

    console.log("EXISTING:", existing);

    if (existing) {
      console.log("PATCHING:", existing.id);

      const res = await api.patch(`/carts/${existing.id}`, {
        quantity: existing.quantity + 1
      });


      return res.data;
    }

    console.log("CREATING NEW CART ITEM");

    const res = await api.post("/carts", {
      userId,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    return res.data;
  }
);

export const incrementQty = createAsyncThunk(
  "carts/incrementQty",
  async (item) => {
    const res = await api.patch(`/carts/${item.id}`, {
      quantity: item.quantity + 1
    });

    return res.data;
  }
)


export const decrementQty = createAsyncThunk(
  "carts/decrementQty",
  async (item) => {
    if(item.quantity == 0){
      return;
    }
    const res = await api.patch(`/carts/${item.id}`, {
      quantity: item.quantity - 1
    });

    return res.data;
  }
)

export const remove = createAsyncThunk(
  "carts/remove",
  async (id) => {
    await api.delete(`/carts/${id}`)
    return id;
  }
)

