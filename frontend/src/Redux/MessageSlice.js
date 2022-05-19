import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const FetchChatInitial = createAsyncThunk(
  "Message/FetchChat",
  async ({ FetchChatRoute, token }) => {
    const response = await axios.get(`${FetchChatRoute}`, {
      headers: { Authorization: token },
    });
    return response.data;
  }
);
const initialState = {
  loading: false,
  error: null,
  Message: [],
};
const MessageSlice = createSlice({
  name: "Message",
  initialState,
  reducers: {},
  extraReducers: {
    //?  Fetch Message
    [FetchChatInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [FetchChatInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.Message = action.payload;
    },
    [FetchChatInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Message = MessageSlice.reducer;
export const { reset } = MessageSlice.actions;
export default Message;
