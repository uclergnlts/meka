// Builds the folder that is uploaded to shared hosting: the backend, the built site, the
// generated database client and a package.json of its own. Run through `npm run build:hosting`,
// which builds the frontend and generates the database client first.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist-hosting");
const bundle = path.join(output, "meka");
const from = (...parts) => path.join(root, ...parts);

const generatedClient = [from("node_modules/.prisma/client"), from("backend/node_modules/.prisma/client")].find((directory) => existsSync(path.join(directory, "index.js")));
if (!generatedClient) throw new Error("Generated database client not found; run `npm run db:generate` first.");
if (!existsSync(from("frontend/dist/index.html"))) throw new Error("Built frontend not found; run `npm run build:frontend` first.");

rmSync(output, { recursive: true, force: true });
mkdirSync(bundle, { recursive: true });

cpSync(from("backend/src"), path.join(bundle, "src"), { recursive: true });
cpSync(from("backend/scripts"), path.join(bundle, "scripts"), { recursive: true });
cpSync(from("frontend/dist"), path.join(bundle, "public"), { recursive: true });
cpSync(generatedClient, path.join(bundle, "prisma-client"), { recursive: true });
cpSync(from("hosting/app.cjs"), path.join(bundle, "app.cjs"));
cpSync(from("hosting/prepare-client.cjs"), path.join(bundle, "prepare-client.cjs"));
cpSync(from("hosting/KURULUM.md"), path.join(bundle, "KURULUM.md"));
cpSync(from("hosting/env.example"), path.join(bundle, ".env.example"));

// Only what the server needs at run time; the tooling stays on the development machine.
// Versions are pinned to the ones installed here: the shipped database client only works
// with the exact @prisma/client release that generated it.
const backend = JSON.parse(readFileSync(from("backend/package.json"), "utf8"));
const installedVersion = (name) => {
  const manifest = [from("backend/node_modules", name, "package.json"), from("node_modules", name, "package.json")].find(existsSync);
  if (!manifest) throw new Error(`${name} is not installed; run \`npm install\` first.`);
  return JSON.parse(readFileSync(manifest, "utf8")).version;
};
const dependencies = Object.fromEntries(Object.keys(backend.dependencies).map((name) => [name, installedVersion(name)]));
writeFileSync(path.join(bundle, "package.json"), `${JSON.stringify({
  name: "meka",
  private: true,
  version: backend.version,
  type: "module",
  main: "app.cjs",
  scripts: { start: "node app.cjs", "admin:reset-password": "node prepare-client.cjs && node scripts/reset-admin-password.js", "admin:create": "node prepare-client.cjs && node scripts/create-admin.js" },
  engines: { node: "^20.19 || ^22.12 || >=24" },
  dependencies,
}, null, 2)}\n`);

// A lock file makes the panel's NPM install fetch exactly the versions that were tested.
const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed`);
};
run("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"], bundle);
run("zip", ["-qr", "meka-hosting.zip", "meka", "-x", "*.DS_Store"], output);

console.log(`Hosting bundle ready: ${path.join(output, "meka-hosting.zip")}`);
