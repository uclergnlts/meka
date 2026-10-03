// Startup file for the hosting panel's Node.js application (CloudLinux Node.js Selector).
// The panel loads this file with require(), while the application itself is made of ES
// modules, so the real entry point is imported from here.

// The hosting panel's web server always proxies to the app, so visitor addresses arrive in
// X-Forwarded-For. Without this every visitor would share one address and five wrong
// passwords from anyone would lock the admin out.
process.env.TRUST_PROXY ??= "1";
process.env.NODE_ENV ??= "production";

require("./prepare-client.cjs");

import("./src/server.js").catch((error) => {
  console.error(error);
  process.exit(1);
});
