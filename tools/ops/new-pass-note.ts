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

function slugify(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

function getArgString(args: Dict, key: string, fallback = "") {
    const v = args[key];
    return typeof v === "string" ? v : fallback;
}

function yamlEscape(value: string) {
    return `"${value.replace(/"/g, '\\"')}"`;
}

async function main() {
    const { values } = parseArgs({
        options: {
            pass: { type: "string", short: "p" },
            phase: { type: "string" },
            title: { type: "string", short: "t" },
            owner: { type: "string" },
            reviewer: { type: "string" },
            acceptor: { type: "string" },
            repo: { type: "string" },
            branch: { type: "string" },
            status: { type: "string" },
            vault: { type: "string" },
            force: { type: "boolean", default: false }
        },
        allowPositionals: false
    });

    const passId = getArgString(values, "pass");
    if (!passId) {
        console.error("Missing required --pass");
        process.exit(1);
    }

    const title = getArgString(values, "title", passId);
    const phase = getArgString(values, "phase", "");
    const owner = getArgString(values, "owner", "Claude Sonnet 4.x");
    const reviewer = getArgString(values, "reviewer", "Gemini 2.5 Pro");
    const acceptor = getArgString(values, "acceptor", "GPT-5.4");
    const repo = getArgString(values, "repo", "last_breath");
    const branch = getArgString(values, "branch", "chillin_v2");
    const status = getArgString(values, "status", "active");

    const repoRoot = await findRepoRoot();
    const vault =
        getArgString(values, "vault") ||
        process.env.OBSIDIAN_VAULT ||
        path.resolve(repoRoot, "..", "PE-AI-Ops");

    const outDir = path.join(vault, "07-Model-Outputs");
    await ensureDir(outDir);

    const fileName = `${passId}-${slugify(title)}.md`;
    const outPath = path.join(outDir, fileName);

    if ((await exists(outPath)) && !values.force) {
        console.error(`Pass note already exists: ${outPath}`);
        console.error("Use --force to overwrite.");
        process.exit(1);
    }

    const content = `---
type: task-packet
pass_id: ${yamlEscape(passId)}
phase: ${yamlEscape(phase)}
owner_model: ${yamlEscape(owner)}
reviewer_model: ${yamlEscape(reviewer)}
accepting_authority: ${yamlEscape(acceptor)}
status: ${yamlEscape(status)}
repo: ${yamlEscape(repo)}
branch: ${yamlEscape(branch)}
created: ${yamlEscape(today())}
---

# Objective

# Why this pass exists

# In scope
- 

# Out of scope
- 

# Constraints
- no public API changes unless explicitly authorized
- no auth/seam drift
- no synthetic project proof
- keep changes narrow and reversible where possible

# Inputs
- repo paths:
- figma nodes:
- screenshots:
- prior notes:
- artifacts:

# Acceptance criteria
- 
- 
- 

# Deliverables
- changed files
- route summary
- validation summary
- acceptance recommendation

# Stop conditions
- stop if contract change appears necessary
- stop if work expands beyond the in-scope routes/files
- stop if source imagery is too weak and a pattern change is preferable

# Notes
`;

    await fs.writeFile(outPath, content, "utf8");
    console.log(`Created: ${outPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});