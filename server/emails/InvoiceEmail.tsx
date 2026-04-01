import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, detailRowStyle, strongStyle, mutedStyle } from "./BaseLayout";

interface InvoiceEmailProps {
  client_name: string;
  project_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  invoice_url: string;
}

export function InvoiceEmail({
  client_name,
  project_name,
  invoice_number,
  amount,
  due_date,
  invoice_url,
}: InvoiceEmailProps) {
  return (
    <BaseLayout
      preview={`Invoice ${invoice_number} - $${amount.toLocaleString()} due ${due_date}`}
      heading="Invoice Notification"
    >
      <Text style={greetingStyle}>Hi {client_name},</Text>
      <Text style={paragraphStyle}>
        A new invoice has been generated for your project. Please review the
        details below.
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Invoice #:</span> {invoice_number}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Project:</span> {project_name}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Amount Due:</span> ${amount.toLocaleString()}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Due Date:</span> {due_date}
      </Text>
      <CtaButton href={invoice_url}>View Invoice</CtaButton>
      <Text style={mutedStyle}>
        If you have any questions about this invoice, please reply to this email.
      </Text>
    </BaseLayout>
  );
}
