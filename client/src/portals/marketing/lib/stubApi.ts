import type {
  MarketingChatbotRequest,
  MarketingChatbotResponse,
  MarketingIntakeEnvelope,
  MarketingIntakeResponse,
} from "@shared/marketing-content";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || response.statusText;
  } catch {
    const text = await response.text();
    return text || response.statusText;
  }
}

export async function fetchMarketingJson<T>(
  url: string,
): Promise<T | undefined> {
  const response = await fetch(url, { credentials: "include" });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

export async function submitMarketingIntake(
  payload: MarketingIntakeEnvelope,
): Promise<MarketingIntakeResponse> {
  const response = await fetch("/api/form-submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as MarketingIntakeResponse;
}

export async function sendMarketingChatbotMessage(
  payload: MarketingChatbotRequest,
): Promise<MarketingChatbotResponse> {
  const response = await fetch("/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as MarketingChatbotResponse;
}
