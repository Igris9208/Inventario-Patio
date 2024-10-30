import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { InvProvider } from "./context/inv";

createRoot(document.getElementById("root")).render(
  <InvProvider>
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>
  </InvProvider>
);
