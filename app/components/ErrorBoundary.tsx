/**
 * Error Boundary component for React error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import logger from "~/lib/logger";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logger.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    private handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    public render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <main className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-badge-red rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-error-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
                            <p className="text-gray-600 text-center">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            {import.meta.env.DEV && this.state.errorInfo && (
                                <details className="w-full mt-4">
                                    <summary className="cursor-pointer text-sm text-gray-500">
                                        Error details (dev only)
                                    </summary>
                                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                                        {this.state.error?.stack}
                                        {'\n\n'}
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                            <button
                                onClick={this.handleReset}
                                className="mt-4 px-4 py-2 primary-gradient text-white rounded-lg hover:primary-gradient-hover transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
