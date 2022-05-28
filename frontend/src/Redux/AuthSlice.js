import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const RegisterInitial = createAsyncThunk(
  "Auth/RegisterAuth",
  async ({ RegisterRoute, name, email, password, pic }) => {
    const response = await axios.post(RegisterRoute, {
      name,
      email,
      password,
      pic,
    });
    return response.data;
  }
);
export const LoginInitial = createAsyncThunk(
  "Auth/LoginAuth",
  async ({ LoginRoute, email, password }) => {
    const response = await axios.post(LoginRoute, { email, password });
    return response.data;
  }
);
export const LogoutInitial = createAsyncThunk(
  "Auth/Logout",
  async ({ LogoutRoute, user }) => {
    const response = await axios.post(`${LogoutRoute}`, {
      user,
    });
    return response.data;
  }
);
export const SearchInitial = createAsyncThunk(
  "Auth/Search",
  async ({ SearchRoute, search, token }) => {
    const response = await axios.get(`${SearchRoute}${search}`, {
      headers: { Authorization: token },
    });
    return response.data;
  }
);
const initialState = {
  loadings: false,
  error: null,
  Auth: [],
  searchUser: [],
};
const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetNotifications: (state, { payload }) => {
      console.log(state.message[payload], "aloooooooooooooooo");
      if (state.newMessage[payload]) {
        state.newMessage[payload] = state.newMessage[payload] + 1;
      } else {
        state.newMessage[payload] = 1;
      }
    },
    AddNotifications: (state, { payload }) => {
      delete state.newMessage[payload];
    },
  },
  extraReducers: {
    //Register
    [RegisterInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [RegisterInitial.fulfilled]: (state, action) => {
      state.loadings = false;
      state.Auth = action.payload;
    },
    [RegisterInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },
    //Login
    [LoginInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [LoginInitial.fulfilled]: (state, action) => {
      state.loadings = false;
      state.Auth = action.payload;
    },
    [LoginInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },
    //Login
    [LogoutInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [LogoutInitial.fulfilled]: (state, action) => {
      state.loadings = false;
    },
    [LogoutInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },

    //?Search
    [SearchInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [SearchInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.searchUser = action.payload;
    },
    [SearchInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Auth = AuthSlice.reducer;
export const { resetNotifications, AddNotifications } = AuthSlice.actions;
export default Auth;
