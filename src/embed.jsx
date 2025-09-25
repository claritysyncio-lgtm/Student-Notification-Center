import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmbedApp from './components/EmbedApp';
import './styles/global.css';

/**
 * Embed Entry Point
 * 
 * This is the dedicated entry point for the Notion embed.
 * It loads only the EmbedApp component without the main app routing.
 */

/**
 * Error Boundary Component for Embed
 */
class EmbedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Embed error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: '#fed7d7',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          margin: '20px',
          color: '#742a2a'
        }}>
          <h3>Embed Error</h3>
          <p>Something went wrong loading the notification center.</p>
          <button 
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              background: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          <div style={{ marginTop: '10px' }}>
            <a 
              href="/" 
              target="_top"
              style={{ color: '#2f855a', textDecoration: 'underline' }}
            >
              Open main app →
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Initialize the embed application
 */
function initializeEmbed() {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found in embed');
    return;
  }

  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <EmbedErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EmbedApp />} />
          </Routes>
        </BrowserRouter>
      </EmbedErrorBoundary>
    </React.StrictMode>
  );
}

// Initialize the embed when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEmbed);
} else {
  initializeEmbed();
}
