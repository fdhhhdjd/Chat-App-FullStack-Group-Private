import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const GetMessageInitial = createAsyncThunk(
  "Auth/GetMessage",
  async ({ GetMessageRoute, from, to }) => {
    const response = await axios.post(GetMessageRoute, {
      from,
      to,
    });
    return response.data;
  }
);
export const SendMessageInitial = createAsyncThunk(
  "Auth/SendMessage",
  async ({ SendMessageRoute, from, to, message }) => {
    const response = await axios.post(SendMessageRoute, {
      from,
      to,
      message,
    });
    return response.data;
  }
);
const initialState = {
  loading: false,
  error: null,
  message: [],
  sendMessage: [],
};
const AuthenticationSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetNotify: (state, { payload }) => {
      console.log(state, "-----", payload);
      delete state.newMessage[payload];
    },
    AddNotify: (state, { payload }) => {
      if (state.newMessage[payload]) {
        state.newMessage[payload] = state.newMessage[payload] + 1;
      } else {
        state.newMessage[payload] = 1;
      }
    },
  },
  extraReducers: {
    //? Get Message
    [GetMessageInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [GetMessageInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    [GetMessageInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //?  Send Message
    [SendMessageInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [SendMessageInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.sendMessage = action.payload;
    },
    [SendMessageInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Authentication = AuthenticationSlice.reducer;
export const { reset } = AuthenticationSlice.actions;
export default Authentication;
