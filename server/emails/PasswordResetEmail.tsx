import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, mutedStyle } from "./BaseLayout";

interface PasswordResetEmailProps {
  name: string;
  reset_url: string;
}

export function PasswordResetEmail({ name, reset_url }: PasswordResetEmailProps) {
  return (
    <BaseLayout
      preview="Reset your Pacific Engineering password"
      heading="Reset Your Password"
    >
      <Text style={greetingStyle}>Hi {name},</Text>
      <Text style={paragraphStyle}>
        We received a request to reset your password. Click the button below to
        choose a new password.
      </Text>
      <CtaButton href={reset_url}>Reset Password</CtaButton>
      <Text style={mutedStyle}>
        This link expires in 1 hour. If you didn't request a password reset, you
        can safely ignore this email.
      </Text>
    </BaseLayout>
  );
}
