import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}
