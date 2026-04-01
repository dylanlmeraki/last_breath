import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, mutedStyle } from "./BaseLayout";

interface InviteEmailProps {
  invitee_name: string;
  inviter_name: string;
  company_name?: string;
  invite_url: string;
  invite_type: "internal" | "client" | "team";
}

const typeLabels: Record<string, string> = {
  internal: "Internal Portal",
  client: "Client Portal",
  team: "Team",
};

export function InviteEmail({
  invitee_name,
  inviter_name,
  company_name,
  invite_url,
  invite_type,
}: InviteEmailProps) {
  const label = typeLabels[invite_type] || "Portal";

  return (
    <BaseLayout
      preview={`${inviter_name} has invited you to Pacific Engineering ${label}`}
      heading={`You're Invited to Pacific Engineering ${label}`}
    >
      <Text style={greetingStyle}>Hi {invitee_name || "there"},</Text>
      <Text style={paragraphStyle}>
        {inviter_name} has invited you to join the Pacific Engineering {label}
        {company_name ? ` for ${company_name}` : ""}.
      </Text>
      <Text style={paragraphStyle}>
        Click the button below to create your account and get started.
      </Text>
      <CtaButton href={invite_url}>Accept Invitation</CtaButton>
      <Text style={mutedStyle}>This invitation expires in 7 days.</Text>
    </BaseLayout>
  );
}
