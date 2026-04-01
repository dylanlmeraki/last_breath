import type { MCPClient } from "./mcp-client";

export interface ReportPayload {
  status: string;
  summary: string;
  figma_link: string | null;
  artifacts: {
    screenshots: string[];
    traces: string[];
    lighthouse: { score: number };
  };
}

export class GitHubReporter {
  constructor(private readonly gitHubClient: MCPClient) {}

  async commentOnIssue(issueNumber: number, results: ReportPayload) {
    const body = this.formatComment(results);
    await this.gitHubClient.call("create_issue_comment", {
      issue_number: issueNumber,
      body,
    });
    return body;
  }

  private formatComment(results: ReportPayload): string {
    return [
      "## MCP Orchestration Results",
      "",
      `Status: ${results.status}`,
      "",
      `Summary: ${results.summary}`,
      `Accessibility/Performance: Lighthouse ${results.artifacts.lighthouse.score}`,
      `Figma: ${results.figma_link ?? "not linked"}`,
      `Screenshots: ${results.artifacts.screenshots.length}`,
      `Traces: ${results.artifacts.traces.length}`,
    ].join("\n");
  }
}
