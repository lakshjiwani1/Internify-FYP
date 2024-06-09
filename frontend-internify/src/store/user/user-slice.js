import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  details: {
    user_id: null,
    user_type: null,
    first_name: null,
    last_name: null,
    email: null,
  },
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.details = action.payload.details;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
  },
});

export const selectUserState = (state) => state.user;
export const userActions = userSlice.actions;
export default userSlice;