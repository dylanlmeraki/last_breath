import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, detailRowStyle, strongStyle, mutedStyle } from "./BaseLayout";

interface ProposalEmailProps {
  client_name: string;
  project_name: string;
  proposal_number?: string;
  amount?: number;
  expiration_date?: string;
  proposal_url: string;
}

export function ProposalEmail({
  client_name,
  project_name,
  proposal_number,
  amount,
  expiration_date,
  proposal_url,
}: ProposalEmailProps) {
  return (
    <BaseLayout
      preview={`New proposal for ${project_name}`}
      heading="Your Proposal is Ready"
    >
      <Text style={greetingStyle}>Hi {client_name},</Text>
      <Text style={paragraphStyle}>
        We've prepared a proposal for your review. Please find the details below.
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Project:</span> {project_name}
      </Text>
      {proposal_number && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Proposal #:</span> {proposal_number}
        </Text>
      )}
      {amount != null && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Amount:</span> ${amount.toLocaleString()}
        </Text>
      )}
      {expiration_date && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Valid Until:</span> {expiration_date}
        </Text>
      )}
      <CtaButton href={proposal_url}>View Proposal</CtaButton>
      <Text style={mutedStyle}>
        If you have any questions, reply directly to this email.
      </Text>
    </BaseLayout>
  );
}
