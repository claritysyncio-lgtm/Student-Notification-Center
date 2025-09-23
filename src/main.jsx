
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 * 
 * This is a critical component for production applications to ensure
 * graceful error handling and better user experience.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Application error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({ errorInfo });
    
    // In production, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    // Reset error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2 className="error-title">
              Oops! Something went wrong
            </h2>
            <p className="error-message">
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="retry-button"
                type="button"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="reload-button"
                type="button"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Application Routes Configuration
 * 
 * Defines the routing structure for the application.
 * Keep this simple and focused on the core user flows.
 */
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/embed.html" element={<App />} />
    <Route path="/preview.html" element={<App />} />
    {/* Add more routes here as the application grows */}
  </Routes>
);

/**
 * Initialize the React application
 * 
 * Sets up the root component with proper error boundaries,
 * routing, and development tools.
 */
function initializeApp() {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error(
      'Root element not found. Make sure index.html has a div with id="root"'
    );
    return;
  }

  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Initialize the application when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
