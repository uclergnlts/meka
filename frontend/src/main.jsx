import { createRoot } from "react-dom/client";
import { App } from "./app/App.jsx";
import "./styles.css";
import { applyFavicon, getBrandAssets } from "./utils/brandAssets.js";

applyFavicon(getBrandAssets().favicon);
document.documentElement.classList.toggle("panel-dark", window.localStorage.getItem("meka-panel-theme") === "dark");

createRoot(document.getElementById("root")).render(<App />);
