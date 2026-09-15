import { createSlice } from "@reduxjs/toolkit";
import { customerList } from "../thunks/customerThunk";
import { toggleBlockuser } from "../thunks/blockuserThunk";
import { deleteUser } from "../thunks/deleteUserThunk";

const userManagementSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Customers
      .addCase(customerList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      //Block Usere
      .addCase(toggleBlockuser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((item) =>
          String(item.id) === String(action.payload.id) ? action.payload : item,
        );
      })

      //Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload)
        )
      })
      // handles pending and rejected actions
      .addMatcher(
        (action) =>
          action.type.startsWith("users/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("users/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      );
  },
});

export default userManagementSlice.reducer;
