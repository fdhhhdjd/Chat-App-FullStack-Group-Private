import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import AuthSlice from "./AuthSlice";

const rootReducer = (state, action) => {
  if (action.type === "counter/clear") {
    state = undefined;
  }
  return AuthSlice(state, action);
};
const store = configureStore({
  reducer: {
    auth: AuthSlice,

    reducer: rootReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
