import { createSlice } from "@reduxjs/toolkit";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishList,
  toggleWishlist,
  clearWishlistAsync,
} from "./thunks/wishlistThunk";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH WISHLIST
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      // ADD TO WISHLIST
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const item = action.payload;
        if (!item) return;
        const exists = state.items.some(
          (i) =>
            String(i.id) === String(item.id) ||
            String(i.productId) === String(item.productId)
        );
        if (!exists) {
          state.items.push(item);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      // REMOVE FROM WISHLIST
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        state.status = "succeeded";
        const targetId = String(action.payload);
        state.items = state.items.filter(
          (i) => String(i.id) !== targetId && String(i.productId) !== targetId
        );
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      // TOGGLE WISHLIST
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { action: toggleAction, id, productId, item } = action.payload;
        if (toggleAction === "remove") {
          state.items = state.items.filter(
            (i) =>
              String(i.id) !== String(id) &&
              String(i.productId) !== String(productId)
          );
        } else if (toggleAction === "add" && item) {
          const exists = state.items.some(
            (i) =>
              String(i.id) === String(item.id) ||
              String(i.productId) === String(item.productId)
          );
          if (!exists) {
            state.items.push(item);
          }
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      // CLEAR WISHLIST ASYNC
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
        state.loading = false;
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;