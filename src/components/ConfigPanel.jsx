import React, { useState, useEffect } from 'react';
import { defaultConfig, validateConfig, mergeConfig } from '../config/widgetConfig';
import NotionOAuth from './NotionOAuth';

export default function ConfigPanel({ onConfigChange, initialConfig = {} }) {
  const [config, setConfig] = useState(mergeConfig(initialConfig));
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('notion');

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config };
    
    // Handle nested object updates
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      newConfig[key] = value;
    }
    
    setConfig(newConfig);
    
    // Validate and notify parent
    const validation = validateConfig(newConfig);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      onConfigChange(newConfig);
    }
  };

  const handleSectionToggle = (sectionKey, enabled) => {
    handleConfigChange(`sections.${sectionKey}.enabled`, enabled);
  };

  const handleThemeChange = (colorKey, value) => {
    handleConfigChange(`theme.${colorKey}`, value);
  };

  return (
    <div className="config-panel">
      <div className="config-header">
        <h3>Widget Configuration</h3>
        <div className="config-tabs">
          <button 
            className={activeTab === 'notion' ? 'active' : ''}
            onClick={() => setActiveTab('notion')}
          >
            Notion Setup
          </button>
          <button 
            className={activeTab === 'display' ? 'active' : ''}
            onClick={() => setActiveTab('display')}
          >
            Display
          </button>
          <button 
            className={activeTab === 'theme' ? 'active' : ''}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="config-errors">
          <h4>Configuration Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="config-content">
        {activeTab === 'notion' && (
          <div className="config-section">
            <h4>Notion Integration</h4>
            
            {!config.notion.token ? (
              <NotionOAuth 
                onSuccess={(token, workspace) => {
                  handleConfigChange('notion.token', token);
                  // You can also store workspace info if needed
                }}
                onError={(error) => {
                  console.error('OAuth error:', error);
                }}
              />
            ) : (
              <div className="oauth-success">
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h4>Connected to Notion</h4>
                  <p>Your Notion workspace is connected and ready to use.</p>
                </div>
                
                <div className="config-field">
                  <label>Database ID *</label>
                  <input
                    type="text"
                    value={config.notion.databaseId}
                    onChange={(e) => handleConfigChange('notion.databaseId', e.target.value)}
                    placeholder="Enter your Notion database ID"
                  />
                  <small>Find this in your Notion database URL</small>
                </div>

                <div className="config-field">
                  <label>Course Database ID (Optional)</label>
                  <input
                    type="text"
                    value={config.notion.courseDatabaseId}
                    onChange={(e) => handleConfigChange('notion.courseDatabaseId', e.target.value)}
                    placeholder="Enter course database ID for course names"
                  />
                </div>

                <button 
                  className="disconnect-button"
                  onClick={() => {
                    handleConfigChange('notion.token', '');
                    handleConfigChange('notion.databaseId', '');
                  }}
                >
                  Disconnect from Notion
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'display' && (
          <div className="config-section">
            <h4>Display Settings</h4>
            
            <div className="config-field">
              <label>Widget Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
              />
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showTitle}
                  onChange={(e) => handleConfigChange('showTitle', e.target.checked)}
                />
                Show Title
              </label>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showRefreshButton}
                  onChange={(e) => handleConfigChange('showRefreshButton', e.target.checked)}
                />
                Show Refresh Button
              </label>
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  checked={config.showFilters}
                  onChange={(e) => handleConfigChange('showFilters', e.target.checked)}
                />
                Show Filter Dropdowns
              </label>
            </div>

            <h5>Sections</h5>
            {Object.entries(config.sections).map(([key, section]) => (
              <div key={key} className="config-field">
                <label>
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => handleSectionToggle(key, e.target.checked)}
                  />
                  {section.title}
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="config-section">
            <h4>Theme Colors</h4>
            
            <div className="config-field">
              <label>Primary Color</label>
              <input
                type="color"
                value={config.theme.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
              />
            </div>

            <div className="config-field">
              <label>Background Color</label>
              <input
                type="color"
                value={config.theme.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
              />
            </div>

            <div className="config-field">
              <label>Border Color</label>
              <input
                type="color"
                value={config.theme.borderColor}
                onChange={(e) => handleThemeChange('borderColor', e.target.value)}
              />
            </div>

            <div className="config-field">
              <label>Text Color</label>
              <input
                type="color"
                value={config.theme.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
              />
            </div>

            <div className="config-field">
              <label>Muted Text Color</label>
              <input
                type="color"
                value={config.theme.mutedColor}
                onChange={(e) => handleThemeChange('mutedColor', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="config-footer">
        <button 
          className="reset-button"
          onClick={() => {
            setConfig(mergeConfig({}));
            onConfigChange(mergeConfig({}));
          }}
        >
          Reset to Defaults
        </button>
        <button 
          className="export-button"
          onClick={() => {
            const configJson = JSON.stringify(config, null, 2);
            navigator.clipboard.writeText(configJson);
            alert('Configuration copied to clipboard!');
          }}
        >
          Copy Config
        </button>
      </div>
    </div>
  );
}
