import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import AuthSlice from "./AuthSlice";
import MessageSlice from "./MessageSlice";
import GroupSlice from "./GroupSlice";

const rootReducer = (state, action) => {
  if (action.type === "counter/clear") {
    state = undefined;
  }
  return AuthSlice(state, action);
};
const store = configureStore({
  reducer: {
    auth: AuthSlice,
    message: MessageSlice,
    group: GroupSlice,

    reducer: rootReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
