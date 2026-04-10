---
name: project-scaffold
description: Generate new project files and directory structures. Use when creating new components, pages, services, or features with boilerplate templates.
allowed-tools: MCPClient(filesystem:*)
---

# Project Scaffolding

Quickly generate new project structures with templates.

## Component Scaffold

Generate a new component with hook, styles, and tests:

```typescript
import { MCPClient } from "../mcp-client";

async function scaffoldComponent(name: string) {
  const client = new MCPClient("filesystem");
  const basePath = `d:/last_breath/client/src/components/${name}`;
  
  // Create directory
  await client.call("create_directory", { path: basePath });
  
  // Component file
  await client.call("write_file", {
    path: `${basePath}/${name}.tsx`,
    content: `import React from 'react';
import './${name}.css';

interface ${name}Props {
  // Define props here
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return <div className="${name}">Component</div>;
};
`,
  });

  // Styles
  await client.call("write_file", {
    path: `${basePath}/${name}.css`,
    content: `.${name} {
  /* Styles here */
}
`,
  });

  // Index
  await client.call("write_file", {
    path: `${basePath}/index.ts`,
    content: `export { ${name} } from './${name}';
export type { ${name}Props } from './${name}';
`,
  });
}
```

## Page Scaffold

Create a new page with layout and data loading:

```typescript
async function scaffoldPage(name: string) {
  const client = new MCPClient("filesystem");
  const pagePath = `d:/last_breath/client/src/pages/${name}`;

  await client.call("create_directory", { path: pagePath });

  await client.call("write_file", {
    path: `${pagePath}/${name}.tsx`,
    content: `import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const ${name} = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load data here
    setLoading(false);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <PageHeader title="${name}" />
      {/* Page content */}
    </div>
  );
};
`,
  });
}
```

## API Service Scaffold

Generate a new API client service:

```typescript
async function scaffoldService(name: string) {
  const client = new MCPClient("filesystem");
  const servicePath = `d:/last_breath/client/src/lib/${name}Service.ts`;

  await client.call("write_file", {
    path: servicePath,
    content: `import { apiClient } from './apiClient';

export const ${name}Service = {
  // Add methods here
  getAll: async () => {
    return apiClient.get('/${name.toLowerCase()}');
  },

  getById: async (id: string) => {
    return apiClient.get(\`/${name.toLowerCase()}/\${id}\`);
  },

  create: async (data: any) => {
    return apiClient.post('/${name.toLowerCase()}', data);
  },

  update: async (id: string, data: any) => {
    return apiClient.put(\`/${name.toLowerCase()}/\${id}\`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(\`/${name.toLowerCase()}/\${id}\`);
  },
};
`,
  });
}
```

## Feature Scaffold

Generate complete feature with multiple files:

```typescript
async function scaffoldFeature(featureName: string) {
  const client = new MCPClient("filesystem");
  const featurePath = `d:/last_breath/client/src/features/${featureName}`;

  // Create directory structure
  const dirs = [
    featurePath,
    `${featurePath}/components`,
    `${featurePath}/hooks`,
    `${featurePath}/lib`,
    `${featurePath}/pages`,
  ];

  for (const dir of dirs) {
    await client.call("create_directory", { path: dir });
  }

  // Create index files
  for (const subdir of ["components", "hooks", "lib", "pages"]) {
    await client.call("write_file", {
      path: `${featurePath}/${subdir}/index.ts`,
      content: `// Exports for ${subdir}\n`,
    });
  }

  // Create main feature index
  await client.call("write_file", {
    path: `${featurePath}/index.ts`,
    content: `export * from './components';
export * from './hooks';
export * from './lib';
export * from './pages';
`,
  });
}
```

## Templates

Pre-built templates for common files:

- **React Component** - TSX + CSS + Index
- **React Hook** - Custom hook with types
- **Service** - API client with CRUD methods
- **Page** - Full page with layout
- **Feature** - Complete feature structure
- **Test** - Jest test template
- **Stylesheet** - CSS with BEM naming
- **Type Definitions** - TypeScript interfaces

Use scaffolding to maintain consistency across your project.
