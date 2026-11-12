import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = {
        name: action.payload.user.name,
        email: action.payload.user.email,
      };

      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  sessionStorage.clear();
  sessionStorage.removeItem("persist:root");
},
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;