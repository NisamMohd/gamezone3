import { createSlice } from "@reduxjs/toolkit";
import { register, login } from "./thunks/authThunk";

const loadUser = () => {
  try {
    const stored = localStorage.getItem("gamezone_user") || localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveUserToStorage = (user) => {
  if (user) {
    localStorage.setItem("gamezone_user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("gamezone_user");
    localStorage.removeItem("user");
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
      saveUserToStorage(null);
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      saveUserToStorage(action.payload);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        saveUserToStorage(action.payload);
      })

      // LOGIN
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        saveUserToStorage(action.payload);
      })

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

export const { logout, updateUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;