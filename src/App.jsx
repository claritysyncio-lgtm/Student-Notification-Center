
import React, { useState, useEffect } from "react";
import NotificationCenter from "./components/NotificationCenter";
import SetupPage from "./SetupPage";
import { mergeConfig } from "./config/widgetConfig";

export default function App() {
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Check if we're in embed mode (URL contains 'embed')
    const isEmbedMode = window.location.pathname.includes('embed') || 
                       window.location.search.includes('embed=true');
    
    if (isEmbedMode) {
      // In embed mode, try to load config from localStorage or use defaults
      const savedConfig = localStorage.getItem('notificationCenterConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(mergeConfig(parsedConfig));
        } catch (error) {
          console.error('Failed to load saved config:', error);
          setConfig(mergeConfig({}));
        }
      } else {
        setConfig(mergeConfig({}));
      }
      setShowSetup(false);
    } else {
      // In setup mode
      setShowSetup(true);
    }
  }, []);

  if (showSetup) {
    return <SetupPage />;
  }

  if (!config) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationCenter config={config} />
    </div>
  );
}
