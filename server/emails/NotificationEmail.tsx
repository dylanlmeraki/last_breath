import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle } from "./BaseLayout";

interface NotificationEmailProps {
  name?: string;
  heading: string;
  body: string;
  cta_text?: string;
  cta_url?: string;
}

export function NotificationEmail({
  name,
  heading,
  body,
  cta_text,
  cta_url,
}: NotificationEmailProps) {
  return (
    <BaseLayout preview={heading} heading={heading}>
      {name && <Text style={greetingStyle}>Hi {name},</Text>}
      <Text style={paragraphStyle}>{body}</Text>
      {cta_text && cta_url && (
        <CtaButton href={cta_url}>{cta_text}</CtaButton>
      )}
    </BaseLayout>
  );
}
