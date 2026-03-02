import { apiRequest } from "./queryClient";

export async function invokeLLM(params: {
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_type?: string;
}): Promise<any> {
  const res = await apiRequest("POST", "/api/integrations/llm", params);
  return res.json();
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  body: string;
  from_name?: string;
  reply_to?: string;
  cc?: string[];
  bcc?: string[];
}): Promise<any> {
  const res = await apiRequest("POST", "/api/integrations/email", params);
  return res.json();
}

export async function uploadFile(file: File): Promise<{ url: string; name: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/integrations/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed");
  }
  return res.json();
}

export async function generateImage(params: {
  prompt: string;
  size?: string;
  style?: string;
}): Promise<any> {
  const res = await apiRequest("POST", "/api/integrations/image", params);
  return res.json();
}
