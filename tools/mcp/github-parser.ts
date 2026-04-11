export interface ParsedIssue {
  issue_id: number;
  title: string;
  description: string;
  labels: string[];
  acceptance_criteria: string[];
  components: string[];
}

export class GitHubParser {
  parse(issue: any): ParsedIssue {
    const body = String(issue?.body ?? "");

    return {
      issue_id: Number(issue?.number ?? 0),
      title: String(issue?.title ?? ""),
      description: body,
      labels: Array.isArray(issue?.labels)
        ? issue.labels.map((label: any) => String(label?.name ?? ""))
        : [],
      acceptance_criteria: this.extractCriteria(body),
      components: this.inferComponents(body, String(issue?.title ?? "")),
    };
  }

  private extractCriteria(body: string): string[] {
    const match = body.match(/##\s*Acceptance Criteria[\s\S]*?(?=\n##|\s*$)/i);
    if (!match) return [];

    return match[0]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-") || line.startsWith("[ ]") || line.startsWith("- [ ]"))
      .map((line) => line.replace(/^-\s*\[\s\]\s*|^\[\s\]\s*|^-\s*/, "").trim())
      .filter(Boolean);
  }

  private inferComponents(body: string, title: string): string[] {
    const source = `${title}\n${body}`.toLowerCase();
    const components = new Set<string>();

    if (source.includes("hero")) components.add("HeroSection");
    if (source.includes("cta") || source.includes("call to action")) components.add("CTAButton");
    if (source.includes("nav")) components.add("NavigationBar");
    if (source.includes("feature")) components.add("FeatureGrid");
    if (source.includes("footer")) components.add("Footer");

    return [...components];
  }
}
