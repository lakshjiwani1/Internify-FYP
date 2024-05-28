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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => (state = action.payload),
    logout: () => initialState,
  },
});

export const selectUserState = (state) => state.user;
export const userActions = userSlice.actions;
export default userSlice;