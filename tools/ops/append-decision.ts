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

function slugify(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

function getArgString(args: Dict, key: string, fallback = "") {
    const v = args[key];
    return typeof v === "string" ? v : fallback;
}

function yamlEscape(value: string) {
    return `"${value.replace(/"/g, '\\"')}"`;
}

function makeDecisionId() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `DEC-${y}${m}${day}-${hh}${mm}${ss}`;
}

async function main() {
    const { values } = parseArgs({
        options: {
            id: { type: "string" },
            category: { type: "string" },
            summary: { type: "string", short: "s" },
            pass: { type: "string", short: "p" },
            owner: { type: "string" },
            reversible: { type: "string" },
            routes: { type: "string" },
            files: { type: "string" },
            followup: { type: "string" },
            vault: { type: "string" }
        }
    });

    const summary = getArgString(values, "summary");
    if (!summary) {
        console.error("Missing required --summary");
        process.exit(1);
    }

    const decisionId = getArgString(values, "id", makeDecisionId());
    const category = getArgString(values, "category", "general");
    const passId = getArgString(values, "pass", "");
    const owner = getArgString(values, "owner", "");
    const reversible = getArgString(values, "reversible", "unknown");
    const routes = getArgString(values, "routes", "");
    const files = getArgString(values, "files", "");
    const followup = getArgString(values, "followup", "");

    const repoRoot = await findRepoRoot();
    const vault =
        getArgString(values, "vault") ||
        process.env.OBSIDIAN_VAULT ||
        path.resolve(repoRoot, "..", "PE-AI-Ops");

    const decisionsDir = path.join(vault, "09-Decisions");
    await ensureDir(decisionsDir);

    const decisionFile = path.join(
        decisionsDir,
        `${decisionId}-${slugify(summary)}.md`
    );

    const content = `---
type: decision
decision_id: ${yamlEscape(decisionId)}
category: ${yamlEscape(category)}
date: ${yamlEscape(new Date().toISOString())}
pass_id: ${yamlEscape(passId)}
owner: ${yamlEscape(owner)}
reversible: ${yamlEscape(reversible)}
---

# Summary
${summary}

# Why
TBD

# Affected routes
${routes ? routes.split(",").map((r) => `- ${r.trim()}`).join("\n") : "- "}

# Affected files
${files ? files.split(",").map((f) => `- ${f.trim()}`).join("\n") : "- "}

# Follow-up
${followup || "- "}
`;

    await fs.writeFile(decisionFile, content, "utf8");

    const decisionLog = path.join(decisionsDir, "decision-log.md");
    if (!(await exists(decisionLog))) {
        await fs.writeFile(decisionLog, "# Decision Log\n\n", "utf8");
    }

    const appendBlock = `
## ${decisionId}
- Date: ${new Date().toISOString()}
- Category: ${category}
- Pass: ${passId || "(none)"}
- Owner: ${owner || "(none)"}
- Reversible: ${reversible}
- Summary: ${summary}
- Note: [${path.basename(decisionFile)}](${path.basename(decisionFile)})
`;

    await fs.appendFile(decisionLog, appendBlock, "utf8");
    console.log(`Created decision note: ${decisionFile}`);
    console.log(`Updated decision log: ${decisionLog}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});