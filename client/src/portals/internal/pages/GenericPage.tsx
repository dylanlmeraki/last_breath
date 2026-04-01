import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Send, Layers, Palette, Search, UserPlus, Shield, InboxIcon,
  Settings, Building2, Calendar, Monitor, ClipboardList, User,
  AlertTriangle, type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Send, Layers, Palette, Search, UserPlus, Shield, InboxIcon,
  Settings, Building2, Calendar, Monitor, ClipboardList, User,
  AlertTriangle,
};

interface GenericPageProps {
  title: string;
  description: string;
  icon: string;
}

export default function GenericPage({ title, description, icon }: GenericPageProps) {
  const Icon = iconMap[icon] || AlertTriangle;

  return (
    <div>
      <PageHeader title={title} subtitle={description} />
      <EmptyState
        icon={Icon}
        title="Coming Soon"
        description={`The ${title} feature is being built. Check back soon.`}
      />
    </div>
  );
}
