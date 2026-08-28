import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/client", { recursive: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

cpSync("frontend/dist", "dist/client", { recursive: true });

writeFileSync(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const fallbackUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
`,
);

writeFileSync("dist/.openai/hosting.json", readFileSync(".openai/hosting.json", "utf8"));
