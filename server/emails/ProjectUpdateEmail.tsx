import * as React from "react";
import { Text } from "@react-email/components";
import { BaseLayout, CtaButton, paragraphStyle, greetingStyle, detailRowStyle, strongStyle } from "./BaseLayout";

interface ProjectUpdateEmailProps {
  client_name: string;
  project_name: string;
  update_type: string;
  milestone_name?: string;
  progress_percentage?: number;
  message: string;
  project_url: string;
}

export function ProjectUpdateEmail({
  client_name,
  project_name,
  update_type,
  milestone_name,
  progress_percentage,
  message,
  project_url,
}: ProjectUpdateEmailProps) {
  return (
    <BaseLayout
      preview={`${update_type} update for ${project_name}`}
      heading="Project Update"
    >
      <Text style={greetingStyle}>Hi {client_name},</Text>
      <Text style={paragraphStyle}>{message}</Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Project:</span> {project_name}
      </Text>
      <Text style={detailRowStyle}>
        <span style={strongStyle}>Update Type:</span> {update_type}
      </Text>
      {milestone_name && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Milestone:</span> {milestone_name}
        </Text>
      )}
      {progress_percentage != null && (
        <Text style={detailRowStyle}>
          <span style={strongStyle}>Progress:</span> {progress_percentage}%
        </Text>
      )}
      <CtaButton href={project_url}>View Project</CtaButton>
    </BaseLayout>
  );
}
