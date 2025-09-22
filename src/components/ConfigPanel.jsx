import React, { useState, useEffect } from 'react';
import { defaultConfig, validateConfig, mergeConfig } from '../config/widgetConfig';
import NotionOAuth from './NotionOAuth';

export default function ConfigPanel({ onConfigChange, initialConfig = {} }) {
  console.log('ConfigPanel rendered with initialConfig:', initialConfig);
  
  // Handle both flat config and user config structures
  const flatConfig = initialConfig.personalization ? {
    ...initialConfig.personalization,
    notion: initialConfig.notion || {}
  } : initialConfig;
  
  console.log('Flat config:', flatConfig);
  console.log('Notion token:', flatConfig.notion?.token);
  
  const [config, setConfig] = useState(mergeConfig(flatConfig));
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
    
    // Notify parent component
    onConfigChange(newConfig);
    
    // Validate and notify parent
    const validation = validateConfig(newConfig);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      // If we're dealing with user config structure, wrap in personalization
      if (initialConfig.personalization) {
        onConfigChange({ personalization: newConfig });
      } else {
        onConfigChange(newConfig);
      }
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
            
            {!config.notion?.token ? (
              <NotionOAuth 
                onSuccess={(data) => {
                  console.log('NotionOAuth onSuccess called with:', data);
                  handleConfigChange('notion.token', data.token);
                  handleConfigChange('notion.databaseId', data.databaseId);
                  
                  // Also notify parent about notion updates
                  if (initialConfig.personalization) {
                    onConfigChange({ 
                      personalization: config,
                      notion: {
                        ...config.notion,
                        token: data.token,
                        databaseId: data.databaseId
                      }
                    });
                  }
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
                  <label>Main Database URL:</label>
                  <input
                    type="url"
                    placeholder="https://notion.so/your-workspace/32-character-id or https://notion.site/your-workspace/32-character-id"
                    onChange={(e) => {
                      const url = e.target.value;
                      console.log('Main URL input:', url);
                      // Extract database ID from Notion URL - handle different formats
                      let match = url.match(/(?:notion\.so|notion\.site|www\.notion\.so)\/(?:[^\/]+\/)?([a-f0-9]{32})(?:\?|$)/);
                      
                      // If no match, try to extract from query parameter
                      if (!match) {
                        const queryMatch = url.match(/[?&]v=([a-f0-9]{32})/);
                        if (queryMatch) {
                          match = queryMatch;
                        }
                      }
                      console.log('Main Regex match:', match);
                      if (match) {
                        const databaseId = match[1];
                        console.log('Extracted main database ID:', databaseId);
                        handleConfigChange('notion.databaseId', databaseId);
                      } else {
                        console.log('No main database ID found in URL');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}
                  />
                </div>
                
                <div className="config-field">
                  <label>Main Database ID (auto-detected):</label>
                  <input
                    type="text"
                    value={config.notion.databaseId}
                    placeholder="Will be filled automatically when you paste the URL above"
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: config.notion.databaseId ? '#f0fdf4' : '#f9fafb',
                      color: config.notion.databaseId ? '#166534' : '#6b7280'
                    }}
                  />
                  {config.notion.databaseId && (
                    <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px' }}>
                      ✅ Main Database ID detected successfully!
                    </div>
                  )}
                  <small>Required: Find this in your Notion database URL</small>
                </div>

                <div className="config-field">
                  <label>Course Database URL:</label>
                  <input
                    type="url"
                    placeholder="https://notion.so/your-workspace/32-character-id or https://notion.site/your-workspace/32-character-id"
                    onChange={(e) => {
                      const url = e.target.value;
                      console.log('Course URL input:', url);
                      // Extract database ID from Notion URL - handle different formats
                      let match = url.match(/(?:notion\.so|notion\.site|www\.notion\.so)\/(?:[^\/]+\/)?([a-f0-9]{32})(?:\?|$)/);
                      
                      // If no match, try to extract from query parameter
                      if (!match) {
                        const queryMatch = url.match(/[?&]v=([a-f0-9]{32})/);
                        if (queryMatch) {
                          match = queryMatch;
                        }
                      }
                      console.log('Course Regex match:', match);
                      if (match) {
                        const databaseId = match[1];
                        console.log('Extracted course database ID:', databaseId);
                        handleConfigChange('notion.courseDatabaseId', databaseId);
                      } else {
                        console.log('No course database ID found in URL');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}
                  />
                </div>
                
                <div className="config-field">
                  <label>Course Database ID (auto-detected):</label>
                  <input
                    type="text"
                    value={config.notion.courseDatabaseId}
                    placeholder="Will be filled automatically when you paste the URL above"
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: config.notion.courseDatabaseId ? '#f0fdf4' : '#f9fafb',
                      color: config.notion.courseDatabaseId ? '#166534' : '#6b7280'
                    }}
                  />
                  {config.notion.courseDatabaseId && (
                    <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px' }}>
                      ✅ Course Database ID detected successfully!
                    </div>
                  )}
                  <small>Required: Find this in your Notion course database URL</small>
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
