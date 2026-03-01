import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import App from "./App.jsx";
import { store } from "./store/index.js";
import { AppProvider } from "./contexts/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Provider store={store}>
        <AppProvider>
          <App />
        </AppProvider>
      </Provider>
    </BrowserRouter>
    <ToastContainer hideProgressBar position="top-center" autoClose={2000} />
  </React.StrictMode>,
);
