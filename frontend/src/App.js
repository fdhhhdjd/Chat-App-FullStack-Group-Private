import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import {
  ChatPage,
  HomePage,
  PrivateRoute,
  PrivateRouteAuth,
} from "./Imports/index";

function App() {
  return (
    <React.Fragment>
      <ToastContainer position="top-center" />
      <div className="App">
        <Routes>
          <Route element={<PrivateRouteAuth />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/chats" element={<ChatPage />} />
          </Route>
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
