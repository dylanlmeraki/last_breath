import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, listItemStyle, strongStyle } from "./BaseLayout";

interface WelcomeEmailProps {
  name: string;
  account_type: "internal" | "client";
  portal_url: string;
}

export function WelcomeEmail({ name, account_type, portal_url }: WelcomeEmailProps) {
  const portalLabel = account_type === "internal" ? "Internal Portal" : "Client Portal";

  const steps = account_type === "internal"
    ? [
        "Review your dashboard for project updates",
        "Check assigned tasks and pending approvals",
        "Set up your notification preferences",
      ]
    : [
        "View your active projects and milestones",
        "Access shared documents and proposals",
        "Send messages to the project team",
      ];

  return (
    <BaseLayout
      preview={`Welcome to Pacific Engineering ${portalLabel}`}
      heading="Welcome to Pacific Engineering!"
    >
      <Text style={greetingStyle}>Hi {name},</Text>
      <Text style={paragraphStyle}>
        Your account has been successfully created. You now have access to the
        Pacific Engineering {portalLabel}.
      </Text>
      <Text style={{ ...paragraphStyle, fontWeight: "600" as const, color: "#111827" }}>
        Getting Started:
      </Text>
      {steps.map((step, i) => (
        <Text key={i} style={listItemStyle}>
          <span style={strongStyle}>{i + 1}.</span> {step}
        </Text>
      ))}
      <CtaButton href={portal_url}>Go to {portalLabel}</CtaButton>
    </BaseLayout>
  );
}
