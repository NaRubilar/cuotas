import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('No se encontró el elemento #root en index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
