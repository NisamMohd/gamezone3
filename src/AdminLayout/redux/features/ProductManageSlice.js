import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../thunks/adminProductsThunk";
import { toggleDisable } from "../thunks/toggleIsDisabledThunk";
import { addProduct } from "../thunks/addProductThunk";
import { editProduct } from "../thunks/editProductThunk";
import { deleteProduct } from "../thunks/deleteProductThunk";

const ProductManageSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      // TOGGLE DISABLE
      .addCase(toggleDisable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((product) =>
          String(product.id) === String(action.payload.id)
            ? action.payload
            : product,
        );
      })

      // ADD PRODUCT TO DB
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [...state.items, action.payload]
      })

      // EDIT PRODUCT IN DB
      .addCase(editProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((product) =>
          String(product.id) === String(action.payload.id)
            ? action.payload
            : product,
        );
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled,(state, action) => {
        state.status = "succeded"
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload)
        )
      })

      // HANDLE PENDING STATE
      .addMatcher(
        (action) =>
          action.type.startsWith("adminProducts/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        },
      )

      // HANDLE REJECTED STATE
      .addMatcher(
        (action) =>
          action.type.startsWith("adminProducts/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      );
  },
});

export default ProductManageSlice.reducer;
