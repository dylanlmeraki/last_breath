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

function stamp() {
    return new Date().toISOString().replace(/[:]/g, "-");
}

function getArgString(args: Dict, key: string, fallback = "") {
    const v = args[key];
    return typeof v === "string" ? v : fallback;
}

async function readStdin(): Promise<string> {
    if (process.stdin.isTTY) return "";
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8").trim();
}

async function findPassNote(outputsDir: string, passId: string): Promise<string | null> {
    const entries = await fs.readdir(outputsDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isFile() && entry.name.startsWith(`${passId}-`) && entry.name.endsWith(".md")) {
            return path.join(outputsDir, entry.name);
        }
    }
    return null;
}

function yamlEscape(value: string) {
    return `"${value.replace(/"/g, '\\"')}"`;
}

async function main() {
    const { values } = parseArgs({
        options: {
            pass: { type: "string", short: "p" },
            model: { type: "string", short: "m" },
            status: { type: "string" },
            summary: { type: "string", short: "s" },
            text: { type: "string" },
            file: { type: "string", short: "f" },
            vault: { type: "string" }
        }
    });

    const passId = getArgString(values, "pass");
    const model = getArgString(values, "model");
    if (!passId || !model) {
        console.error("Missing required --pass and/or --model");
        process.exit(1);
    }

    const repoRoot = await findRepoRoot();
    const vault =
        getArgString(values, "vault") ||
        process.env.OBSIDIAN_VAULT ||
        path.resolve(repoRoot, "..", "PE-AI-Ops");

    const outputsDir = path.join(vault, "07-Model-Outputs");
    await ensureDir(outputsDir);

    const passNote = await findPassNote(outputsDir, passId);
    if (!passNote) {
        console.error(`Could not find pass note for ${passId} in ${outputsDir}`);
        process.exit(1);
    }

    let body = "";
    const fileArg = getArgString(values, "file");
    if (fileArg) {
        body = (await fs.readFile(path.resolve(fileArg), "utf8")).trim();
    } else {
        body =
            getArgString(values, "text") ||
            (await readStdin()) ||
            getArgString(values, "summary");
    }

    if (!body) {
        console.error("No model output content found. Use --text, --file, --summary, or pipe stdin.");
        process.exit(1);
    }

    const summary = getArgString(values, "summary", "");
    const status = getArgString(values, "status", "received");
    const passFolder = path.join(outputsDir, passId);
    await ensureDir(passFolder);

    const noteName = `${stamp()}-${slugify(model)}.md`;
    const notePath = path.join(passFolder, noteName);

    const content = `---
type: model-output
model: ${yamlEscape(model)}
pass_id: ${yamlEscape(passId)}
date: ${yamlEscape(new Date().toISOString())}
status: ${yamlEscape(status)}
---

# Summary
${summary || "(none provided)"}

# Output
${body}
`;

    await fs.writeFile(notePath, content, "utf8");

    const relPath = path.relative(path.dirname(passNote), notePath).replace(/\\/g, "/");
    const appendBlock = `

## Model output — ${model}
- Date: ${new Date().toISOString()}
- Status: ${status}
- Summary: ${summary || "(none provided)"}
- Note: [${noteName}](${relPath})
`;

    await fs.appendFile(passNote, appendBlock, "utf8");
    console.log(`Created model output note: ${notePath}`);
    console.log(`Updated pass note: ${passNote}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});