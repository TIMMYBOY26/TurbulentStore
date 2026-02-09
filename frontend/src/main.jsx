import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
// --- ADD THIS IMPORT ---
import { registerSW } from "virtual:pwa-register";

// Automatically updates the app when you push new changes to Vercel
registerSW({ immediate: true });

// --- START LONG PORTRAIT EASTER EGG ---
const longArt = `
  >> SYSTEM: TURBULENT_MONOLOGUE_2026
  >> INITIALIZING LONG_FORMAT_PROTOCOL...
  
  [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%

  >> STATUS: FULLY_EXTENDED
  >> ACCESS: ROOT_LEVEL
`;

console.log(
  `%c${longArt}`,
  "font-family: monospace; color: #00FF00; background: #000; font-weight: bold; font-size: 12px; line-height: 1.0; padding: 25px; border-left: 5px solid #00FF00;",
);
// --- END ---

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
);
