import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchOrders,
  fetchUserAddress,
  updateUserAddress,
} from "./thunks/orderThunk";

const initialState = {
  orders: [],
  currentOrder: null,
  savedAddress: null,
  loading: false,
  error: null,
  orderSuccess: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderStatus: (state) => {
      state.orderSuccess = false;
      state.error = null;
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.savedAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        state.orderSuccess = true;
        state.error = null;
        if (action.payload.shippingAddress) {
          state.savedAddress = action.payload.shippingAddress;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to place order";
        state.orderSuccess = false;
      })

      // FETCH ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USER ADDRESS
      .addCase(fetchUserAddress.fulfilled, (state, action) => {
        state.savedAddress = action.payload;
      })

      // UPDATE USER ADDRESS
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.savedAddress = action.payload;
      });
  },
});

export const { resetOrderStatus, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
