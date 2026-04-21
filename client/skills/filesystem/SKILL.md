---
name: filesystem-operations
description: Read, write, and manage files in the project. Use when editing source files, reading configs, creating templates, or managing project structure.
allowed-tools: MCPClient(filesystem:*) Bash(*)
---

# Filesystem Operations

Work with project files, directories, and configurations efficiently.

## Quick Start

### Read Files

```typescript
const client = new MCPClient("filesystem");

// Read a single file
const content = await client.call("read_file", {
  path: "d:/last_breath/package.json"
});

// Read a directory
const files = await client.call("read_directory", {
  path: "d:/last_breath/src",
  recursive: true
});
```

### Write Files

```typescript
// Create or overwrite
await client.call("write_file", {
  path: "d:/last_breath/src/newfile.ts",
  content: "export const hello = 'world';"
});

// Append content
await client.call("append_file", {
  path: "d:/last_breath/README.md",
  content: "\n\n## New Section"
});
```

### File Metadata

```typescript
// Get file info
const info = await client.call("get_file_info", {
  path: "d:/last_breath/package.json"
});
// Returns: size, created, modified, isDirectory, permissions, etc.

// Create directories
await client.call("create_directory", {
  path: "d:/last_breath/src/new/nested/dir"
});

// Delete files
await client.call("delete_file", {
  path: "d:/last_breath/old-file.ts"
});
```

## Common Tasks

### Update Configuration Files

1. Read the config file
2. Parse/modify as needed
3. Write back with changes

### Generate Project Structure

```typescript
// Create new directory structure for a feature
const dirs = [
  "src/features/newfeature/components",
  "src/features/newfeature/hooks",
  "src/features/newfeature/lib",
];

for (const dir of dirs) {
  await client.call("create_directory", { path: dir });
}
```

### Batch File Operations

1. List directory with `read_directory`
2. Filter results by pattern
3. Read/modify files in loop

## Security

Files are restricted to:
- Current working directory
- `client/`, `server/`, `shared/` subdirectories
- Max file size: 10MB
- All extensions allowed

## Tips

- Use `recursive: true` for deep directory exploration
- Read large files in multiple smaller chunks if needed
- Always create parent directories before writing files
- Check `get_file_info` before modifying important files
