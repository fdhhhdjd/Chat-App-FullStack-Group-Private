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
export const FetchChatIdUserInitial = createAsyncThunk(
  "Message/FetchChatUserId",
  async ({ MessageGetAll, chatId, token }) => {
    const response = await axios.get(`${MessageGetAll}/${chatId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  }
);
export const SendMessageInitial = createAsyncThunk(
  "Message/SendMessage",
  async ({ SendMessage, content, chatId, time, todayDate, token }) => {
    const response = await axios.post(
      `${SendMessage}`,
      {
        content,
        chatId,
        time,
        date: todayDate,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);
export const IconMessageInitial = createAsyncThunk(
  "Message/IconMessage",
  async ({ IconMessage, id, icon, token }) => {
    const response = await axios.post(
      `${IconMessage}/${id}`,
      {
        icon,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);

const initialState = {
  loading: false,
  loadings: false,
  error: null,
  Message: [],
  MessageId: [],
  sendMessage: [],
  icon: [],
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
    //?  Fetch Message Id User
    [FetchChatIdUserInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [FetchChatIdUserInitial.fulfilled]: (state, action) => {
      state.loadings = false;
      state.MessageId = action.payload;
    },
    [FetchChatIdUserInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },
    //? Send Message
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
    //? Icon
    [IconMessageInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [IconMessageInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.icon = action.payload;
    },
    [IconMessageInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Message = MessageSlice.reducer;
export const { reset } = MessageSlice.actions;
export default Message;
