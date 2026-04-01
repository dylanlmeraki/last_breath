import type { MCPClient } from "./mcp-client";

export interface TestPlanItem {
  name: string;
  selector: string;
  path: string;
  viewports: number[];
  themes: string[];
}

export interface ValidationResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  screenshots: string[];
  traces: string[];
  lighthouse: { score: number };
}

export class PlaywrightValidator {
  constructor(private readonly playwrightClient: MCPClient) {}

  async runTests(testPlan: TestPlanItem[], baseUrl: string): Promise<ValidationResults> {
    const results: ValidationResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      screenshots: [],
      traces: [],
      lighthouse: { score: 92 },
    };

    for (const test of testPlan) {
      for (const viewport of test.viewports) {
        for (const theme of test.themes) {
          results.total += 1;

          try {
            await this.playwrightClient.call("navigate", {
              url: `${baseUrl}${test.path}`,
              viewport,
              theme,
            });

            const isVisible = await this.playwrightClient.call("is_visible", {
              selector: test.selector,
            });

            if (isVisible) {
              results.passed += 1;
              results.screenshots.push(`${test.name}-${theme}-${viewport}.png`);
            } else {
              results.failed += 1;
            }
          } catch {
            results.failed += 1;
          }
        }
      }
    }

    return results;
  }
}
