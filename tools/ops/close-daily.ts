#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

type Dict = Record<string, string | boolean | undefined>;

async function exists(p: string) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

async function findRepoRoot(start = process.cwd()): Promise<string> {
    let current = path.resolve(start);
    while (true) {
        const pkg = path.join(current, "package.json");
        const git = path.join(current, ".git");
        if (await exists(pkg) || await exists(git)) return current;
        const parent = path.dirname(current);
        if (parent === current) return path.resolve(start);
        current = parent;
    }
}

function getArgString(args: Dict, key: string, fallback = "") {
    const v = args[key];
    return typeof v === "string" ? v : fallback;
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

async function main() {
    const { values } = parseArgs({
        options: {
            date: { type: "string" },
            summary: { type: "string", short: "s" },
            done: { type: "string" },
            blocked: { type: "string" },
            next: { type: "string" },
            decisions: { type: "string" },
            vault: { type: "string" }
        }
    });

    const repoRoot = await findRepoRoot();
    const vault =
        getArgString(values, "vault") ||
        process.env.OBSIDIAN_VAULT ||
        path.resolve(repoRoot, "..", "PE-AI-Ops");

    const date = getArgString(values, "date", today());
    const dailyDir = path.join(vault, "11-Daily");
    await ensureDir(dailyDir);

    const dailyPath = path.join(dailyDir, `${date}.md`);
    if (!(await exists(dailyPath))) {
        const starter = `---
type: daily
date: ${date}
---

# Today’s top passes
1.
2.
3.

# Doing
- 

# Blocked
- 

# Needs review
- 

# Decisions made
- 

# Next packet seeds
- 

# End-of-day note
`;
        await fs.writeFile(dailyPath, starter, "utf8");
    }

    const summary = getArgString(values, "summary", "(no summary provided)");
    const done = getArgString(values, "done", "");
    const blocked = getArgString(values, "blocked", "");
    const next = getArgString(values, "next", "");
    const decisions = getArgString(values, "decisions", "");

    const block = `

## Closure — ${new Date().toISOString()}
### Summary
${summary}

### Done
${done ? done.split("|").map((x) => `- ${x.trim()}`).join("\n") : "- "}

### Blocked
${blocked ? blocked.split("|").map((x) => `- ${x.trim()}`).join("\n") : "- "}

### Decisions
${decisions ? decisions.split("|").map((x) => `- ${x.trim()}`).join("\n") : "- "}

### Next
${next ? next.split("|").map((x) => `- ${x.trim()}`).join("\n") : "- "}
`;

    await fs.appendFile(dailyPath, block, "utf8");
    console.log(`Updated daily note: ${dailyPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});