import { logError } from '@smartinvoicexyz/utils';
import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (error) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 w-full min-h-screen bg-background text-foreground">
          <p className="text-xl font-semibold">Something went wrong</p>
          <p className="text-muted-foreground">
            Try refreshing the page. If the problem persists, please contact
            support.
          </p>
          <button
            type="button"
            onClick={() => (window.location.href = '/')}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      );
    }

    return children;
  }
}
