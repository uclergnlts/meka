import { createRoot } from "react-dom/client";
import { App } from "./app/App.jsx";
import "./styles.css";
import { applyFavicon, getBrandAssets } from "./utils/brandAssets.js";
import { readStorage } from "./utils/storage.js";

applyFavicon(getBrandAssets().favicon);
document.documentElement.classList.toggle("panel-dark", readStorage("meka-panel-theme") === "dark");

createRoot(document.getElementById("root")).render(<App />);
