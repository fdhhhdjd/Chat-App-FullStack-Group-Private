import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HomePage, ChatPage } from "./Imports/index";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <ToastContainer position="top-center" />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
