import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";
import "react-h5-audio-player/lib/styles.css";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import store from "./Redux/Store";
import * as serviceWorker from "./serviceWorker";
import { DataProvider } from "./useContext/GlobalState";
ReactDOM.render(
  // <React.StrictMode>

  <Provider store={store}>
    <ChakraProvider>
      <DataProvider>
        <Router>
          <App />
        </Router>
      </DataProvider>
    </ChakraProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
