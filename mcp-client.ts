type MCPServerName = "github" | "figma" | "playwright" | "context7";

export interface MCPClientOptions {
  dryRun?: boolean;
}

export class MCPClient {
  private readonly serverName: MCPServerName;
  private readonly dryRun: boolean;
  private readonly baseUrl: string;

  constructor(serverName: MCPServerName, options: MCPClientOptions = {}) {
    this.serverName = serverName;
    this.dryRun = options.dryRun ?? false;
    this.baseUrl = this.getServerUrl(serverName);
  }

  async call(tool: string, params: Record<string, unknown>) {
    if (this.dryRun || !this.baseUrl) {
      return this.mock(tool, params);
    }

    const response = await fetch(`${this.baseUrl}/tools/${tool}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`[${this.serverName}] ${tool} failed: ${response.status} ${text}`);
    }

    return response.json();
  }

  private getServerUrl(serverName: MCPServerName): string {
    const urls: Record<MCPServerName, string> = {
      github: "https://api.githubcopilot.com/mcp",
      figma: "http://127.0.0.1:3845/mcp",
      playwright: "",
      context7: "",
    };

    return urls[serverName];
  }

  private mock(tool: string, params: Record<string, unknown>) {
    switch (`${this.serverName}:${tool}`) {
      case "github:get_issue":
        return {
          number: params.issue_number ?? 0,
          title: "Mock marketing issue",
          body: [
            "## Acceptance Criteria",
            "- Hero section with strong CTA",
            "- Responsive on mobile/tablet/desktop",
            "- Accessible contrast and keyboard support",
            "- Light and dark presentation states",
          ].join("\n"),
          labels: [{ name: "marketing" }, { name: "design" }],
        };

      case "github:create_issue_comment":
        return {
          ok: true,
          mode: "dry-run",
          issue_number: params.issue_number,
        };

      case "figma:create_frame":
        return {
          node_id: `mock-node-${String(params.name ?? "component").toLowerCase()}`,
        };

      case "playwright:navigate":
      case "playwright:is_visible":
      case "playwright:screenshot":
        return tool === "is_visible" ? true : `mock-${tool}`;

      default:
        return {
          ok: true,
          server: this.serverName,
          tool,
          params,
          mode: "dry-run",
        };
    }
  }
}
