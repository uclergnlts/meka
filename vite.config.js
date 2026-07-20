import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  plugins: [vinext()],
  ssr: {
    noExternal: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-dom/server.edge",
      "lucide-react",
    ],
  },
});
