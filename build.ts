import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { build as esbuild } from "esbuild";

const CLIENT_BUILD_HEAP_MB = 4096;

async function cleanDist() {
  const distDir = path.resolve(import.meta.dirname, "dist");
  await rm(distDir, { recursive: true, force: true });
}

async function buildClient() {
  const viteCliPath = path.resolve(
    import.meta.dirname,
    "node_modules",
    "vite",
    "bin",
    "vite.js",
  );
  const viteConfigPath = path.resolve(import.meta.dirname, "vite.config.ts");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        `--max-old-space-size=${CLIENT_BUILD_HEAP_MB}`,
        viteCliPath,
        "build",
        "--config",
        viteConfigPath,
        "--mode",
        "production",
      ],
      {
        cwd: import.meta.dirname,
        env: {
          ...process.env,
          NODE_ENV: "production",
        },
        stdio: "inherit",
        windowsHide: true,
      },
    );

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      if (signal) {
        reject(new Error(`Client build terminated by signal ${signal}`));
        return;
      }

      reject(new Error(`Client build exited with code ${code ?? "unknown"}`));
    });
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
