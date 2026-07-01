import { Badge, BadgeProps } from "../ui/badge";
import { SystemStatus } from "../../types/status";

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: SystemStatus;
}

const statusConfig: Record<SystemStatus, { label: string; variant: BadgeProps["variant"] }> = {
  available: { label: "Available", variant: "default" },
  coming_soon: { label: "Coming Soon", variant: "secondary" },
  beta: { label: "Beta", variant: "outline" },
  experimental: { label: "Experimental", variant: "destructive" },
  operational: { label: "Operational", variant: "default" },
  maintenance: { label: "Maintenance", variant: "secondary" },
  degraded: { label: "Degraded", variant: "destructive" },
  offline: { label: "Offline", variant: "destructive" },
  connecting: { label: "Connecting...", variant: "secondary" },
  loading: { label: "Loading...", variant: "outline" },
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "outline" };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
}
