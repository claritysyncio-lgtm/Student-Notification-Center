import React, { useState, useEffect } from 'react';
import NotificationCenter from './components/NotificationCenter';
import ConfigPanel from './components/ConfigPanel';
import { defaultConfig, mergeConfig } from './config/widgetConfig';

export default function SetupPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [showPreview, setShowPreview] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('notificationCenterConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(mergeConfig(parsedConfig));
        setSetupComplete(true);
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('notificationCenterConfig', JSON.stringify(newConfig));
  };

  const handleStartPreview = () => {
    setShowPreview(true);
  };

  const handleBackToSetup = () => {
    setShowPreview(false);
  };

  const handleCompleteSetup = () => {
    setSetupComplete(true);
    setShowPreview(false);
  };

  if (setupComplete && !showPreview) {
    return (
      <div className="setup-complete">
        <div className="setup-complete-content">
          <h1>🎉 Setup Complete!</h1>
          <p>Your Notification Center is ready to use.</p>
          <div className="setup-actions">
            <button onClick={() => setShowPreview(true)} className="preview-button">
              Preview Widget
            </button>
            <button onClick={() => setSetupComplete(false)} className="edit-config-button">
              Edit Configuration
            </button>
          </div>
          <div className="embed-instructions">
            <h3>How to Embed in Notion:</h3>
            <ol>
              <li>Copy the embed URL: <code>{window.location.origin}/embed.html</code></li>
              <li>In Notion, type <code>/embed</code> and select "Embed"</li>
              <li>Paste the URL and click "Embed"</li>
              <li>Resize the embed block to fit your needs</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="preview-mode">
        <div className="preview-header">
          <h2>Widget Preview</h2>
          <div className="preview-actions">
            <button onClick={handleBackToSetup} className="back-button">
              Back to Setup
            </button>
            <button onClick={handleCompleteSetup} className="complete-button">
              Complete Setup
            </button>
          </div>
        </div>
        <div className="preview-container">
          <NotificationCenter config={config} />
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="setup-header">
        <h1>🔔 Notification Center Setup</h1>
        <p>Configure your Notion-powered task notification widget</p>
      </div>
      
      <div className="setup-content">
        <div className="setup-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Configure Settings</h3>
              <p>Set up your Notion integration and customize the widget appearance</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Preview Widget</h3>
              <p>Test your configuration and see how the widget will look</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Embed in Notion</h3>
              <p>Copy the embed URL and add it to your Notion pages</p>
            </div>
          </div>
        </div>

        <ConfigPanel 
          onConfigChange={handleConfigChange}
          initialConfig={config}
        />

        <div className="setup-actions">
          <button 
            onClick={handleStartPreview}
            className="preview-button"
            disabled={!config.notion.databaseId || !config.notion.token}
          >
            Preview Widget
          </button>
        </div>
      </div>
    </div>
  );
}
