import { Loader2 } from "../../config/icons";
import { cn } from "../../lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = "Loading...", 
  className,
  fullScreen = false 
}: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-muted-foreground",
      fullScreen && "h-[calc(100vh-4rem)] w-full",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
