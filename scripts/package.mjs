import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const extension = join(root, "extension");
const manifest = JSON.parse(readFileSync(join(extension, "manifest.json"), "utf8"));
const outputDir = join(root, "dist");
const archive = join(outputDir, `outlook-paste-focus-${manifest.version}.zip`);

// Package only extension assets and the license, never the repository itself.
for (const asset of [...Object.values(manifest.icons), ...manifest.content_scripts.flatMap((script) => script.js)]) {
  if (!existsSync(join(extension, asset))) throw new Error(`Missing extension asset: ${asset}`);
}

function filesWithin(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? filesWithin(join(directory, entry.name), relative) : [relative];
  }).sort();
}

const staging = mkdtempSync(join(tmpdir(), "outlook-paste-focus-package-"));
try {
  cpSync(extension, staging, { recursive: true });
  cpSync(join(root, "LICENSE"), join(staging, "LICENSE"));
  mkdirSync(outputDir, { recursive: true });
  rmSync(archive, { force: true });
  execFileSync("zip", ["-X", "-q", archive, ...filesWithin(staging)], { cwd: staging, stdio: "inherit" });
  console.log(archive);
} finally {
  rmSync(staging, { recursive: true, force: true });
}
