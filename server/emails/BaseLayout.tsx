import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

interface BaseLayoutProps {
  preview?: string;
  heading: string;
  children: React.ReactNode;
}

export function BaseLayout({ preview, heading, children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Pacific Engineering</Text>
            <Text style={headingStyle}>{heading}</Text>
          </Section>
          <Section style={contentStyle}>
            {children}
          </Section>
          <Section style={footerStyle}>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>
              Pacific Engineering &mdash; San Francisco, CA
            </Text>
            <Link href="https://pacificengineeringsf.com" style={footerLinkStyle}>
              pacificengineeringsf.com
            </Link>
            <Text style={footerSmallStyle}>
              &copy; {new Date().getFullYear()} Pacific Engineering. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Section style={{ textAlign: "center" as const, margin: "30px 0" }}>
      <Link href={href} style={ctaStyle}>
        {children}
      </Link>
    </Section>
  );
}

const bodyStyle = {
  margin: "0",
  padding: "0",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  backgroundColor: "#f4f4f5",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const headerStyle = {
  background: "linear-gradient(135deg, #0B67A6 0%, #0EA5A4 100%)",
  padding: "30px",
  borderRadius: "12px 12px 0 0",
  textAlign: "center" as const,
};

const logoTextStyle = {
  margin: "0 0 8px 0",
  color: "rgba(255,255,255,0.85)",
  fontSize: "14px",
  fontWeight: "500" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
};

const headingStyle = {
  margin: "0",
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700" as const,
  lineHeight: "1.3",
};

const contentStyle = {
  backgroundColor: "#ffffff",
  padding: "32px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
};

const footerStyle = {
  padding: "20px",
  textAlign: "center" as const,
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "0 0 20px 0",
};

const footerTextStyle = {
  margin: "0",
  color: "#9ca3af",
  fontSize: "12px",
};

const footerLinkStyle = {
  color: "#0B67A6",
  textDecoration: "none",
  fontSize: "12px",
};

const footerSmallStyle = {
  margin: "8px 0 0 0",
  color: "#d1d5db",
  fontSize: "11px",
};

const ctaStyle = {
  display: "inline-block",
  background: "linear-gradient(135deg, #0B67A6 0%, #0EA5A4 100%)",
  color: "#ffffff",
  padding: "14px 32px",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "600" as const,
  fontSize: "16px",
};

export const paragraphStyle = {
  fontSize: "15px",
  color: "#4b5563",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

export const greetingStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0 0 16px 0",
};

export const mutedStyle = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "20px 0 0 0",
};

export const strongStyle = {
  fontWeight: "600" as const,
  color: "#111827",
};

export const listItemStyle = {
  fontSize: "15px",
  color: "#4b5563",
  lineHeight: "1.8",
  margin: "0",
};

export const detailRowStyle = {
  fontSize: "15px",
  color: "#4b5563",
  lineHeight: "1.8",
  margin: "0 0 4px 0",
};
