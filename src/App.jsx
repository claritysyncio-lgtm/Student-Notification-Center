
import React, { useState, useEffect } from "react";
import NotificationCenter from "./components/NotificationCenter";
import PersonalizedSetup from "./components/PersonalizedSetup";
import { getUserConfig } from "./config/userConfig";

export default function App() {
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for user-specific configuration
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    const isEmbedMode = window.location.pathname.includes('embed');
    
    if (isEmbedMode) {
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
