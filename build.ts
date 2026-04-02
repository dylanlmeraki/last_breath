import { rm } from "node:fs/promises";
import path from "node:path";
import { build as viteBuild } from "vite";
import { build as esbuild } from "esbuild";
import viteConfig from "./vite.config";

async function cleanDist() {
  const distDir = path.resolve(import.meta.dirname, "dist");
  await rm(distDir, { recursive: true, force: true });
}

async function buildClient() {
  await viteBuild({
    ...viteConfig,
    configFile: false,
    mode: "production",
  });
}

async function buildServer() {
  await esbuild({
    entryPoints: [path.resolve(import.meta.dirname, "server", "index.ts")],
    outfile: path.resolve(import.meta.dirname, "dist", "index.cjs"),
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node20",
    sourcemap: true,
    packages: "external",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  });
}

async function main() {
  await cleanDist();
  await buildClient();
  await buildServer();
  console.log("Build complete");
}

main().catch((error) => {
  console.error("Build failed");
  console.error(error);
  process.exit(1);
});
