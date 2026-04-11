const { spawnSync } = require("node:child_process");

const TRACKED_ARTIFACT_ROOTS = [
  "node_modules",
  "dist",
  "artifacts",
  "attached_assets",
];
const DISALLOWED_ROOT_FILES = [
  "directory-tree.txt",
  "path-manifest.txt",
];
const DISALLOWED_ROOT_PATTERNS = [
  /^\.codex-.*\.log$/i,
  /^\.tmp-.*\.cjs$/i,
];
const MAX_REPORTED_PATHS = 30;

function runGit(args) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr.trim();
    throw new Error(stderr || `git ${args.join(" ")} failed`);
  }

  return result.stdout;
}

function listTracked(root) {
  return runGit(["ls-files", "--", root])
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function listTrackedRootFiles() {
  return runGit(["ls-files"])
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => !entry.includes("/"));
}

function isDisallowedRootFile(entry) {
  if (DISALLOWED_ROOT_FILES.includes(entry)) {
    return true;
  }

  return DISALLOWED_ROOT_PATTERNS.some((pattern) => pattern.test(entry));
}

function formatViolations(violations) {
  return violations
    .slice(0, MAX_REPORTED_PATHS)
    .map((entry) => ` - ${entry}`)
    .join("\n");
}

function main() {
  const directoryViolations = TRACKED_ARTIFACT_ROOTS.flatMap((root) => listTracked(root));
  const rootFileViolations = listTrackedRootFiles().filter(isDisallowedRootFile);
  const violations = [...new Set([...directoryViolations, ...rootFileViolations])];

  if (violations.length > 0) {
    console.error("Tracked artifact/dependency files are still in Git:");
    console.error(formatViolations(violations));

    if (violations.length > MAX_REPORTED_PATHS) {
      console.error(
        ` ...and ${violations.length - MAX_REPORTED_PATHS} more tracked artifact paths.`,
      );
    }

    process.exit(1);
  }

  console.log("Repo hygiene check passed: no tracked artifact/dependency paths remain.");
}

main();
