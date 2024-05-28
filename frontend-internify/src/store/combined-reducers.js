import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user/user-slice';

export const combinedReducer = combineReducers({
  user: userSlice.reducer,
});