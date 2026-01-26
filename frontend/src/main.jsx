import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";

// --- START EASTER EGG ---
const secretArt = `
  ______   __  __   ____    ____   _    _   _        ______   _   _   _______ 
 |__   __| |  | |  |  _ \\  |  _ \\ | |  | | | |      |  ____| | \\ | | |__   __|
    | |    |  | |  | |_) | | |_) || |  | | | |      | |__    |  \\| |    | |   
    | |    |  | |  |  _ <  |  _ < | |  | | | |      |  __|   | . \` |    | |   
    | |    |__| |  | |_) | | |_) || |__| | | |____  | |____  | |\\  |    | |   
    |_|    \\____/  |____/  |____/  \\____/  |______| |______| |_| \\_|    |_|   
                                                                              
`;

console.log(
  `%c${secretArt}`,
  "font-family: monospace; color: #00FF00; background: #000; font-weight: bold; padding: 10px;",
);
// --- END EASTER EGG ---

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
);
