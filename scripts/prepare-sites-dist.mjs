import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildSync } from "esbuild";

mkdirSync("dist/server/vendor", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

buildSync({
  entryPoints: ["node_modules/react/index.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react.js",
});

buildSync({
  entryPoints: ["node_modules/react/jsx-runtime.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react-jsx-runtime.js",
});

buildSync({
  entryPoints: ["node_modules/react-dom/server.edge.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react-dom-server-edge.js",
});

const entry = readFileSync("dist/server/entry.js", "utf8")
  .replaceAll('from"react"', 'from"./vendor/react.js"')
  .replaceAll('from"react/jsx-runtime"', 'from"./vendor/react-jsx-runtime.js"')
  .replaceAll('from"react-dom/server.edge"', 'from"./vendor/react-dom-server-edge.js"')
  .replaceAll('from"../vinext-client-assets.js"', 'from"./vinext-client-assets.js"');

copyFileSync("dist/vinext-client-assets.js", "dist/server/vinext-client-assets.js");
writeFileSync("dist/server/index.js", entry);
writeFileSync("dist/.openai/hosting.json", readFileSync(".openai/hosting.json", "utf8"));
