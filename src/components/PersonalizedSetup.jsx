import React, { useState, useEffect } from 'react';
import { getUserConfig, updateUserConfig } from '../config/userConfig';
import NotificationCenter from './NotificationCenter';
import ConfigPanel from './ConfigPanel';
import Footer from './Footer';

export default function PersonalizedSetup() {
  const [userConfig, setUserConfig] = useState(null);
  const [setupStep, setSetupStep] = useState('setup');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Initialize user configuration
      const config = getUserConfig();
      setUserConfig(config);
    } catch (error) {
      console.error('Error initializing user config:', error);
      // Set a default config if there's an error
      setUserConfig({
        userId: 'default_user',
        personalization: {},
        notion: {},
        preferences: {}
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigUpdate = (updates) => {
    console.log('PersonalizedSetup handleConfigUpdate called with:', updates);
    try {
      if (userConfig) {
        const updatedConfig = updateUserConfig(userConfig.userId, updates);
        if (updatedConfig) {
          console.log('Updated config:', updatedConfig);
          setUserConfig(updatedConfig);
        }
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="personalized-setup">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Setting up your personalized notification center...</p>
        </div>
      </div>
    );
  }

  if (!userConfig) {
    return (
      <div className="personalized-setup">
        <div className="error-container">
          <h2>Setup Error</h2>
          <p>Unable to initialize your configuration. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="personalized-setup">
      
      {setupStep === 'setup' && (
        <SimplifiedSetupStep 
          config={userConfig}
          onUpdate={handleConfigUpdate}
          onComplete={() => setSetupStep('complete')}
        />
      )}
      
      {setupStep === 'complete' && (
        <CompleteStep 
          config={userConfig}
          onRestart={() => setSetupStep('setup')}
          onCustomize={() => setSetupStep('live')}
        />
      )}
      
      {setupStep === 'live' && (
        <LiveStep 
          config={userConfig}
          onBack={() => setSetupStep('complete')}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Simplified Setup Step Component - Everything in one form
function SimplifiedSetupStep({ config, onUpdate, onComplete }) {
  const [isConnected, setIsConnected] = useState(false);

  const handleNotionConnect = (notionData) => {
    console.log('NotionSetupStep handleNotionConnect called with:', notionData);
    setIsConnected(true);
    onUpdate({
      notion: {
        ...config.notion,
        ...notionData
      }
    });
  };

  const handleComplete = () => {
    if (!config.notion.databaseId) {
      alert('Please enter your Notion database URL before continuing.');
      return;
    }
    onComplete();
  };

  return (
    <div className="setup-step simplified-setup-step">
      <div className="step-content">
        <div className="setup-header">
          <div className="setup-icon">🎯</div>
          <h1>Set Up Your Task Center</h1>
          <p>Just 2 clicks to get your personalized notification center running!</p>
        </div>
        
        <div className="setup-info" style={{ 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '8px', 
          padding: '20px', 
          margin: '20px 0',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '16px' }}>📋 What you'll need:</h3>
          <ol style={{ margin: '0', paddingLeft: '20px' }}>
            <li><strong>Notion account</strong> - Make sure you're logged into Notion</li>
            <li><strong>Task database</strong> - A Notion database with your tasks/projects</li>
            <li><strong>Share your database</strong> - Add our integration to your database (one-time setup)</li>
          </ol>
          
          <div style={{ 
            backgroundColor: '#dbeafe', 
            border: '1px solid #93c5fd', 
            borderRadius: '6px', 
            padding: '12px', 
            margin: '15px 0'
          }}>
            <strong>💡 Don't worry!</strong> This is a one-time setup. Once connected, your tasks will sync automatically.
          </div>
        </div>
        
        {!isConnected ? (
          <div className="notion-connect">
            <div className="connect-prompt">
              <div className="connect-icon">🔗</div>
              <h3>Connect to Notion</h3>
              <p>Enter your Notion database URL to get started.</p>
              <button 
                className="connect-button"
                onClick={() => {
                  console.log('NotionSetupStep Connect button clicked!');
                  handleNotionConnect({
                    token: '',
                    databaseId: '',
                    workspaceName: 'Your Workspace'
                  });
                }}
              >
                I'll Enter My Database URL Below
              </button>
            </div>
          </div>
        ) : (
          <div className="notion-connected">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h4>Ready to Connect!</h4>
              <p>Now just paste your Notion database URL below.</p>
            </div>
            
            <div className="database-setup" style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              padding: '20px', 
              margin: '20px 0'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#166534', fontSize: '16px' }}>🗄️ Database Setup</h3>
              <p style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '14px' }}>
                Simply paste your Notion database URL below and we'll handle the rest!
              </p>
              
              <div style={{ 
                backgroundColor: '#fef3c7', 
                border: '1px solid #fcd34d', 
                borderRadius: '6px', 
                padding: '12px', 
                margin: '15px 0',
                fontSize: '13px'
              }}>
                <strong>📝 Step 1: Share your database with our integration</strong>
                <p style={{ margin: '8px 0 0 0' }}>
                  In Notion, go to your database → click "..." → "Add connections" → search for "ClaritySync Notification Center" → Add it.
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: '#fef3c7', 
                border: '1px solid #fcd34d', 
                borderRadius: '6px', 
                padding: '12px', 
                margin: '15px 0',
                fontSize: '13px'
              }}>
                <strong>📝 Step 2: Paste your database URL below</strong>
                <p style={{ margin: '8px 0 0 0' }}>
                  Copy the URL from your Notion database and paste it below. We'll automatically extract the Database ID for you!
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: '#f0fdf4', 
                border: '1px solid #22c55e', 
                borderRadius: '6px', 
                padding: '12px', 
                margin: '15px 0',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>🚀 Fully Automated!</div>
                <p style={{ margin: '0', color: '#15803d' }}>
                  We handle all the technical setup automatically. Just paste your database URL and you're ready to go!
                </p>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: '600', color: '#374151', gap: '8px' }}>
                  Notion Database URL:
                  <div className="info-icon-container">
                    <div className="info-icon">
                      i
                    </div>
                    <div className="info-tooltip">
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>How to find your Notion database URL:</div>
                      <ol style={{ margin: '0', paddingLeft: '16px', lineHeight: '1.5' }}>
                        <li>Open your Notion database in a web browser</li>
                        <li>Look for the database name at the top</li>
                        <li>Hover over the database name and click the <strong>3 dots "..."</strong> menu</li>
                        <li>Click <strong>"Copy link to view"</strong></li>
                        <li>Paste the copied link in the field above</li>
                      </ol>
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                        The link should look like: <code style={{ backgroundColor: '#374151', padding: '2px 4px', borderRadius: '3px' }}>notion.so/workspace/32-char-id</code> or <code style={{ backgroundColor: '#374151', padding: '2px 4px', borderRadius: '3px' }}>notion.site/workspace/32-char-id</code>
                      </div>
                      <div style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        width: '0', 
                        height: '0', 
                        borderLeft: '6px solid transparent', 
                        borderRight: '6px solid transparent', 
                        borderTop: '6px solid #1f2937' 
                      }}></div>
                    </div>
                  </div>
                </label>
                <input
                  type="url"
                  placeholder="https://notion.so/your-workspace/32-character-id or https://notion.site/your-workspace/32-character-id"
                  onChange={(e) => {
                    const url = e.target.value;
                    console.log('URL input:', url);
                    // Extract database ID from Notion URL - handle different formats
                    let match = url.match(/(?:notion\.so|notion\.site|www\.notion\.so)\/(?:[^\/]+\/)?([a-f0-9]{32})(?:\?|$)/);
                    
                    // If no match, try to extract from query parameter
                    if (!match) {
                      const queryMatch = url.match(/[?&]v=([a-f0-9]{32})/);
                      if (queryMatch) {
                        match = queryMatch;
                      }
                    }
                    console.log('Regex match:', match);
                    if (match) {
                      const databaseId = match[1];
                      console.log('Extracted database ID:', databaseId);
                      onUpdate({
                        notion: { ...config.notion, databaseId: databaseId }
                      });
                    } else {
                      console.log('No database ID found in URL');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Database ID (auto-detected):
                </label>
                <input
                  type="text"
                  value={config.notion.databaseId || ''}
                  onChange={(e) => onUpdate({
                    notion: { ...config.notion, databaseId: e.target.value }
                  })}
                  placeholder="Will be filled automatically when you paste the URL above"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: config.notion.databaseId ? '#f0fdf4' : '#f9fafb'
                  }}
                />
                {config.notion.databaseId && (
                  <div style={{ 
                    color: '#059669', 
                    fontSize: '12px', 
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ✅ Database ID detected successfully!
                  </div>
                )}
              </div>
            </div>
            
            <div className="setup-actions" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '15px', 
              marginTop: '30px' 
            }}>
              <button 
                className="complete-button" 
                onClick={handleComplete}
                disabled={!config.notion.databaseId}
                style={{
                  backgroundColor: config.notion.databaseId ? '#1dcaf2' : '#9ca3af',
                  cursor: config.notion.databaseId ? 'pointer' : 'not-allowed',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🎉 Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Complete Step Component
function CompleteStep({ config, onRestart, onCustomize }) {
  const embedUrl = `${window.location.origin}/embed.html?user=${config.userId}`;
  
  return (
    <div className="setup-step complete-step">
      <div className="step-content">
        <div className="complete-header">
          <div className="success-icon">🎉</div>
          <h2>Your Personal Task Center is Ready!</h2>
          <p>You now have your own personalized notification center.</p>
        </div>
        
        <div className="embed-instructions">
          <h3>How to Use:</h3>
          <ol>
            <li>Copy this embed URL: <code>{embedUrl}</code></li>
            <li>In Notion, type <code>/embed</code> and select "Embed"</li>
            <li>Paste the URL and click "Embed"</li>
            <li>Resize the embed block to fit your needs</li>
          </ol>
        </div>
        
        <div className="final-actions">
          <button className="restart-button" onClick={onRestart}>
            Start Over
          </button>
          <button 
            className="customize-button" 
            onClick={onCustomize}
          >
            🎨 Make It Yours!
          </button>
        </div>
      </div>
    </div>
  );
}

// Live Step Component - Shows the actual working notification center
function LiveStep({ config, onBack }) {
  const [debugInfo, setDebugInfo] = useState(null);
  
  useEffect(() => {
    // Get debug info from localStorage
    const userId = localStorage.getItem('notificationCenter_userId');
    const userConfig = JSON.parse(localStorage.getItem(`notificationCenter_${userId}`) || '{}');
    setDebugInfo({
      userId,
      notionConfig: userConfig.notion || {},
      hasDatabaseId: !!userConfig.notion?.databaseId,
      hasToken: !!userConfig.notion?.token,
      hasCourseDatabaseId: !!userConfig.notion?.courseDatabaseId
    });
  }, []);
  
  return (
    <div className="setup-step live-step">
      <div className="step-content">
        <div className="live-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Setup
          </button>
        </div>
        
        {debugInfo && (
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            padding: '15px', 
            margin: '15px 0', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>🔍 Debug Information</h4>
            <p><strong>User ID:</strong> {debugInfo.userId}</p>
            <p><strong>Database ID:</strong> {debugInfo.notionConfig.databaseId || 'NOT SET'}</p>
            <p><strong>Course Database ID:</strong> {debugInfo.notionConfig.courseDatabaseId || 'NOT SET'}</p>
            <p><strong>Configuration Valid:</strong> {debugInfo.hasDatabaseId ? '✅ YES' : '❌ NO'}</p>
            <p><strong>Will use real data:</strong> {debugInfo.hasDatabaseId ? '✅ YES' : '❌ NO (will show mock data)'}</p>
          </div>
        )}
        
        <NotificationCenter config={{
          ...config,
          theme: config.theme || {
            primaryColor: '#374151',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            accentColor: '#1dcaf2'
          }
        }} />
      </div>
    </div>
  );
}