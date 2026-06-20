/**
 * ErrorBoundary — React class component for catching render-phase errors.
 *
 * Provides an accessible error UI with:
 *   - aria-live="assertive" to immediately announce the error to screen readers
 *   - A retry button that resets the error state
 *   - Automatic recovery from DOM manipulation errors caused by browser extensions
 *     (e.g., Google Translate modifying text nodes, causing "removeChild" failures)
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Check if an error is a DOM manipulation error typically caused by
 * browser extensions (Google Translate, Grammarly, etc.) modifying
 * the DOM outside of React's control.
 */
function isDomManipulationError(error: Error): boolean {
  const msg = error.message || '';
  return (
    msg.includes('removeChild') ||
    msg.includes('insertBefore') ||
    msg.includes('appendChild') ||
    msg.includes('not a child of this node') ||
    msg.includes('The node to be removed')
  );
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private static MAX_AUTO_RETRIES = 2;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);

    // If the error is caused by browser extensions manipulating the DOM,
    // attempt an automatic recovery instead of showing the error UI.
    if (isDomManipulationError(error) && this.retryCount < ErrorBoundary.MAX_AUTO_RETRIES) {
      this.retryCount++;
      console.warn(
        `[ErrorBoundary] DOM manipulation error detected (likely a browser extension). ` +
        `Auto-recovering... (attempt ${this.retryCount}/${ErrorBoundary.MAX_AUTO_RETRIES})`
      );
      // Schedule a recovery on the next tick to let the DOM settle
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 0);
    }
  }

  handleRetry = (): void => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="min-h-screen flex items-center justify-center p-8 bg-gray-50"
        >
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">
              <span>⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <span>Something went wrong</span>
            </h2>
            <p className="text-gray-600 mb-2">
              <span>An unexpected error occurred in the application.</span>
            </p>
            {this.state.error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-6 font-mono break-all">
                <span>{this.state.error.message}</span>
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="
                bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold
                hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
                focus:ring-offset-2 transition-colors duration-200
              "
              aria-label="Retry loading the application"
            >
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

