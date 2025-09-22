
import React, { useState, useEffect } from "react";

// Simple test component first
function TestApp() {
  return (
    <div style={{ backgroundColor: 'green', padding: '20px', color: 'white' }}>
      <h1>TEST APP IS WORKING!</h1>
      <p>If you see this, React is working</p>
    </div>
  );
}

// All imports working, restore full functionality
import { getUserConfig } from "./config/userConfig";
import NotificationCenter from "./components/NotificationCenter";
import PersonalizedSetup from "./components/PersonalizedSetup";
import EmbeddablePreview from "./components/EmbeddablePreview";

export default function App() {
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for user-specific configuration
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    const isEmbedMode = window.location.pathname.includes('embed');
    const isPreviewMode = urlParams.get('embed') === 'preview';
    
    if (isPreviewMode) {
      console.log('Preview mode detected, setting config');
      setShowSetup(false);
      setConfig({ isPreview: true });
    } else if (isEmbedMode) {
      // In embed mode, load user-specific config
      if (userId) {
        // Load specific user's configuration
        const userConfig = getUserConfig({ userId });
        setConfig(userConfig);
      } else {
        // Fallback to default config
        const defaultConfig = getUserConfig();
        setConfig(defaultConfig);
      }
      setShowSetup(false);
    } else {
      // In setup mode - show personalized setup
      setShowSetup(true);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (showSetup) {
    return <PersonalizedSetup />;
  }

  if (config && config.isPreview) {
    console.log('Rendering EmbeddablePreview');
    return <EmbeddablePreview />;
  }

  if (!config) {
    return (
      <div className="error-container">
        <h2>Configuration Error</h2>
        <p>Unable to load your configuration. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationCenter config={config} />
    </div>
  );
}
