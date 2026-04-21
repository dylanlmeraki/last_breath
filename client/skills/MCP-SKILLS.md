---
name: workspace-mcp-skills
description: Reference for filesystem MCP server and available skills. Read when setting up MCP servers or using filesystem operations.
applyTo: "**/*.ts"
---

# Workspace MCP & Skills Reference

Quick reference for filesystem MCP and skills available in this workspace.

## Filesystem MCP Server

**Status**: ✅ Implemented  
**Location**: `mcp-filesystem.ts`  
**Port**: 3846 (local development)  
**Start**: `npm run mcp:filesystem`

### Tools Available

| Tool | Purpose | Example |
|------|---------|---------|
| `read_file` | Read file contents | `{path: "src/App.tsx"}` |
| `read_directory` | List directory | `{path: "src", recursive: true}` |
| `write_file` | Create/overwrite file | `{path: "src/new.ts", content: "..."}` |
| `append_file` | Append to file | `{path: "README.md", content: "\n\n##"}` |
| `delete_file` | Delete file | `{path: "old.ts"}` |
| `create_directory` | Create dirs recursively | `{path: "src/new/nested"}` |
| `get_file_info` | Get file metadata | `{path: "package.json"}` |

### Usage Pattern

```typescript
import { MCPClient } from "./mcp-client";

const fs = new MCPClient("filesystem");
const result = await fs.call("read_file", { path: "..." });
```

## Available Skills

Type `/` in Copilot chat to access these skills:

### 1. `/filesystem-operations`
General file read/write operations. Use for editing files, reading configs, basic file management.

**Examples**:
- Read and modify source files
- Manage project configurations
- Create utility files

### 2. `/project-scaffold`
Generate new project structures with templates. Use for creating new components, pages, services, features.

**Examples**:
- Create new React component with styles
- Generate API service client
- Scaffold new feature directory
- Create page templates

### 3. `/config-management`
Safe configuration file updates. Use for environment variables, build settings.

**Examples**:
- Update .env files
- Modify package.json
- Change TypeScript config
- Update Docker Compose

## Security Model

**Allowed Directories** (configurable):
- Current working directory  
- `./client/`
- `./server/`
- `./shared/`

**File Size Limit**: 10MB  
**Extension Filter**: None (all allowed, customizable)

## Integration Examples

<details>
<summary><b>Example: Create Component</b></summary>

```typescript
const fs = new MCPClient("filesystem");

// Create directory
await fs.call("create_directory", {
  path: "d:/last_breath/client/src/components/Button"
});

// Create component
await fs.call("write_file", {
  path: "d:/last_breath/client/src/components/Button/Button.tsx",
  content: `export const Button = () => <button>Click</button>;`
});

// Create index
await fs.call("write_file", {
  path: "d:/last_breath/client/src/components/Button/index.ts",
  content: `export { Button } from './Button';`
});
```
</details>

<details>
<summary><b>Example: Update Env</b></summary>

```typescript
const fs = new MCPClient("filesystem");

await fs.call("write_file", {
  path: "d:/last_breath/.env.local",
  content: `DATABASE_URL=postgres://...
API_KEY=secret
DEBUG=*
`
});
```
</details>

<details>
<summary><b>Example: Batch Files</b></summary>

```typescript
const fs = new MCPClient("filesystem");

const files = [
  { path: "src/utils/helpers.ts", content: "export const help = () => {};" },
  { path: "src/utils/types.ts", content: "export type Helper = {};" },
];

for (const file of files) {
  await fs.call("write_file", file);
}
```
</details>

## Troubleshooting

**"Access denied"**: Path not in allowed directories. Check config.

**"File not found"**: Parent directory doesn't exist. Use `create_directory` first or `write_file` auto-creates parents.

**"File too large"**: Increase `maxFileSize` in `mcp-filesystem.ts`.

See `MCP-FILESYSTEM-SETUP.md` for detailed setup guide.
