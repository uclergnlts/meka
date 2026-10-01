import { existsSync, mkdirSync, openSync, closeSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const docker = existsSync("/Applications/Docker.app/Contents/Resources/bin/docker") ? "/Applications/Docker.app/Contents/Resources/bin/docker" : "docker";
const env = { ...process.env, PATH: `${path.dirname(docker)}:${process.env.PATH}` };
const command = process.argv[2];
if (command === "up") {
  const result = spawnSync(docker, ["compose", "up", "-d", "--wait", "mysql"], { cwd: root, env, stdio: "inherit" });
  process.exit(result.status ?? 1);
}
if (command !== "backup") throw new Error("Use up or backup");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const directory = path.join(root, "backend/backups", stamp);
mkdirSync(directory, { recursive: true, mode: 0o700 });
const file = path.join(directory, "meka.sql");
const fd = openSync(file, "wx", 0o600);
// Credentials come from the local container environment; they are never logged.
const result = spawnSync(docker, ["exec", "meka-mysql", "sh", "-c", 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u"$MYSQL_USER" --single-transaction --no-tablespaces "$MYSQL_DATABASE"'], { env, stdio: ["ignore", fd, "pipe"] });
closeSync(fd);
if (result.status !== 0) throw new Error("MySQL backup failed; Docker/MySQL availability must be checked.");
const tar = spawnSync("tar", ["-czf", path.join(directory, "uploads.tar.gz"), "-C", path.join(root, "backend"), "uploads"], { stdio: "pipe" });
if (tar.status !== 0) throw new Error("Image backup failed.");
writeFileSync(path.join(directory, "README.txt"), "Database and image backup. Restore SQL only to an empty database, then restore uploads to UPLOAD_DIR. Contains private records; do not publish.\n", { mode: 0o600 });
console.log(`Backup created: ${directory}`);
