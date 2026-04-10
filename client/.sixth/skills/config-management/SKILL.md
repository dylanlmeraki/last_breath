---
name: config-management
description: Read, update, and manage configuration files (JSON, YAML, env). Use when changing build settings, environment variables, or project configurations.
allowed-tools: MCPClient(filesystem:*) Bash(cat) Bash(grep)
---

# Configuration Management

Handle project configuration files systematically.

## Environment Configuration

```typescript
import { MCPClient } from "../mcp-client";

async function setEnvironmentVariables(env: Record<string, string>) {
  const client = new MCPClient("filesystem");
  
  let envContent = "";
  for (const [key, value] of Object.entries(env)) {
    envContent += `${key}=${value}\n`;
  }

  await client.call("write_file", {
    path: "d:/last_breath/.env.local",
    content: envContent,
  });
}

// Usage
await setEnvironmentVariables({
  NODE_ENV: "development",
  API_URL: "http://localhost:3000",
  DEBUG: "*",
});
```

## Package Configuration

```typescript
async function updatePackageConfig(updates: Record<string, any>) {
  const client = new MCPClient("filesystem");
  
  // Read current package.json
  const pkgContent = await client.call("read_file", {
    path: "d:/last_breath/package.json",
  });
  
  const pkg = JSON.parse(pkgContent);
  
  // Merge updates
  Object.assign(pkg, updates);
  
  // Write back
  await client.call("write_file", {
    path: "d:/last_breath/package.json",
    content: JSON.stringify(pkg, null, 2),
  });
}
```

## Build Configuration

Update TypeScript, ESLint, or other tool configs:

```typescript
async function updateTsConfig(compiler: Record<string, any>) {
  const client = new MCPClient("filesystem");
  
  const tsconfig = await client.call("read_file", {
    path: "d:/last_breath/tsconfig.json",
  });
  
  const config = JSON.parse(tsconfig);
  config.compilerOptions = { ...config.compilerOptions, ...compiler };
  
  await client.call("write_file", {
    path: "d:/last_breath/tsconfig.json",
    content: JSON.stringify(config, null, 2),
  });
}
```

## Docker Configuration

```typescript
async function updateDockerCompose(services: Record<string, any>) {
  const client = new MCPClient("filesystem");
  
  // For YAML, you'd parse it with js-yaml package
  let yaml = await client.call("read_file", {
    path: "d:/last_breath/compose.yaml",
  });
  
  // Update service configurations
  // (requires yaml parser)
  
  await client.call("write_file", {
    path: "d:/last_breath/compose.yaml",
    content: yaml,
  });
}
```

## Bulk Configuration Updates

```typescript
async function bulkUpdateConfigs() {
  const client = new MCPClient("filesystem");
  
  // Update multiple config files at once
  const updates = [
    {
      path: "d:/last_breath/.env.local",
      content: "UPDATED=true\n",
    },
    {
      path: "d:/last_breath/.prettierrc",
      content: JSON.stringify({ semi: true, trailingComma: "es5" }),
    },
  ];
  
  for (const update of updates) {
    await client.call("write_file", {
      path: update.path,
      content: update.content,
    });
  }
}
```

## Configuration Validation

```typescript
async function validateConfig(filePath: string) {
  const client = new MCPClient("filesystem");
  
  const content = await client.call("read_file", { path: filePath });
  
  try {
    const config = JSON.parse(content);
    return { valid: true, config };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

## Common Patterns

- **Env-specific configs**: Base + override pattern
- **Validation**: Check before writing
- **Backup**: Keep original before major updates
- **Format**: Maintain consistent formatting (spacing, keys)
- **Comments**: Preserve helpful comments where possible
