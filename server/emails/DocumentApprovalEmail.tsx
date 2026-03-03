import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, detailRowStyle, strongStyle, mutedStyle } from "./BaseLayout";

interface DocumentApprovalEmailProps {
  reviewer_name: string;
  document_name: string;
  project_name: string;
  uploaded_by: string;
  description?: string;
  review_url: string;
}

export function DocumentApprovalEmail({
  reviewer_name,
  document_name,
  project_name,
  uploaded_by,
  description,
  review_url,
}: DocumentApprovalEmailProps) {
  return (
    <BaseLayout
      preview={`Document review requested: ${document_name}`}
      heading="Document Review Request"
    >
      <Text style={greetingStyle}>Hi {reviewer_name},</Text>
      <Text style={paragraphStyle}>
        A document has been submitted for your review and approval.
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Document:</span> {document_name}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Project:</span> {project_name}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Submitted By:</span> {uploaded_by}
      </Text>
      {description && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Description:</span> {description}
        </Text>
      )}
      <CtaButton href={review_url}>Review Document</CtaButton>
      <Text style={mutedStyle}>
        Please review the document at your earliest convenience.
      </Text>
    </BaseLayout>
  );
}
