import { createSlice } from "@reduxjs/toolkit";
import { register } from "./thunks/authThunk";

const loadUser = () => {
  try {
    const stored = localStorage.getItem("gamezone_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("gamezone_user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded"; // FIX #8: was "succeed"
        state.user = action.payload;
        localStorage.setItem("gamezone_user", JSON.stringify(action.payload));
      })

      // FIX #9: scoped matchers to auth/* actions only, so other slices'
      // thunks don't clobber this state
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;