import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
