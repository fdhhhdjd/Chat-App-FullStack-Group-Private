import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const CreateGroupChatInitial = createAsyncThunk(
  "Auth/CreateGroupChat",
  async ({ CreateGroupChatRoute, name, users, token }) => {
    const response = await axios.post(
      `${CreateGroupChatRoute}`,
      {
        name,
        users,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);
export const AddUserToGroupInitial = createAsyncThunk(
  "Auth/AddUserToGroup",
  async ({ AddUserToGroup, chatId, userId, token }) => {
    const response = await axios.put(
      `${AddUserToGroup}`,
      {
        chatId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);
export const RenameGroupInitial = createAsyncThunk(
  "Auth/RenameGroup",
  async ({ RenameGroupChatRoute, chatId, chatName, token }) => {
    const response = await axios.put(
      `${RenameGroupChatRoute}`,
      {
        chatId,
        chatName,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);
export const RemoveGroupInitial = createAsyncThunk(
  "Auth/RemoveGroup",
  async ({ RemoveFromGroup, chatId, userId, token }) => {
    const response = await axios.put(
      `${RemoveFromGroup}`,
      {
        chatId,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
);
export const AccessUserToGroupInitial = createAsyncThunk(
  "Auth/AccessUser",
  async ({ AccessUserToGroupRoute, userId, token }) => {
    const response = await axios.post(
      `${AccessUserToGroupRoute}`,
      {
        userId,
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
  error: null,
  CreateGroup: [],
  RenameGroup: [],
  RemoveUser: [],
  addUser: [],
};
const GroupSlice = createSlice({
  name: "Group",
  initialState,
  reducers: {
    reset: (state) => {
      state.CreateGroup = [];
      state.RenameGroup = [];
    },
  },
  extraReducers: {
    //?  Create Group
    [CreateGroupChatInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [CreateGroupChatInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.CreateGroup = action.payload;
    },
    [CreateGroupChatInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //?  Rename Group
    [RenameGroupInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [RenameGroupInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.RenameGroup = action.payload;
    },
    [RenameGroupInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //?  Add User Group
    [AddUserToGroupInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [AddUserToGroupInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.addUser = action.payload;
    },
    [AddUserToGroupInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //?  Remove User
    [RemoveGroupInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [RemoveGroupInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.RemoveUser = action.payload;
    },
    [RemoveGroupInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //?  Chat private User
    [AccessUserToGroupInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [AccessUserToGroupInitial.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [AccessUserToGroupInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Group = GroupSlice.reducer;
export const { reset } = GroupSlice.actions;
export default Group;
