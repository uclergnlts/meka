// Puts the pre-generated database client in place. The client ships in ./prisma-client,
// because the generator cannot be relied on to run on shared hosting; @prisma/client looks
// for it inside node_modules/.prisma/client, which the panel recreates on every NPM install.
// Used by app.cjs on every start and by the admin scripts in package.json.
const fs = require("node:fs");
const path = require("node:path");

const installedModules = path.join(__dirname, "node_modules");
if (!fs.existsSync(path.join(installedModules, "@prisma", "client"))) {
  throw new Error("Bağımlılıklar kurulu değil: hosting panelinde uygulamanın 'Run NPM Install' düğmesine basın.");
}

const shippedClient = path.join(__dirname, "prisma-client");
const installedClient = path.join(installedModules, ".prisma", "client");
const sameFile = (name) => fs.existsSync(path.join(installedClient, name))
  && fs.readFileSync(path.join(installedClient, name)).equals(fs.readFileSync(path.join(shippedClient, name)));
if (!sameFile("index.js") || !sameFile("schema.prisma")) {
  fs.rmSync(installedClient, { recursive: true, force: true });
  fs.cpSync(shippedClient, installedClient, { recursive: true });
}
