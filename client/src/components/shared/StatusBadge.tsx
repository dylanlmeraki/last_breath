import { cn, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string | null | undefined;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, variant = "default", size = "sm", className }: StatusBadgeProps) {
  const label = status || "Unknown";
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        sizeClasses[size],
        variant === "outline" ? "border" : "",
        getStatusColor(status),
        className
      )}
      data-testid={`status-badge-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </span>
  );
}
