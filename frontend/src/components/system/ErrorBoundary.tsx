import React, { Component, ErrorInfo } from "react";
import { AlertCircle } from "../../config/icons";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
          <div className="max-w-md space-y-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Application Error
            </h1>
            <p className="text-sm text-muted-foreground">
              A critical error occurred in the application. Please refresh the page or contact support if the issue persists.
            </p>
            {this.state.error && (
              <div className="mt-4 rounded-md bg-secondary p-4 text-left overflow-auto max-h-32 text-xs text-secondary-foreground font-mono">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
