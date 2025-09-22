import React, { useState, useEffect } from 'react';
import { getUserConfig, updateUserConfig } from '../config/userConfig';
import NotificationCenter from './NotificationCenter';
import ConfigPanel from './ConfigPanel';

export default function PersonalizedSetup() {
  const [userConfig, setUserConfig] = useState(null);
  const [setupStep, setSetupStep] = useState('welcome');
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

  const handleStepComplete = (step) => {
    switch (step) {
      case 'welcome':
        setSetupStep('notion');
        break;
      case 'notion':
        setSetupStep('customize');
        break;
      case 'customize':
        setSetupStep('preview');
        break;
      case 'preview':
        setSetupStep('complete');
        break;
      default:
        setSetupStep('complete');
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
      
      {setupStep === 'welcome' && (
        <WelcomeStep 
          onNext={() => handleStepComplete('welcome')}
          userName={userConfig.userName}
        />
      )}
      
      {setupStep === 'notion' && (
        <NotionSetupStep 
          config={userConfig}
          onUpdate={handleConfigUpdate}
          onNext={() => handleStepComplete('notion')}
        />
      )}
      
      {setupStep === 'customize' && (
        <CustomizeStep 
          config={userConfig}
          onUpdate={handleConfigUpdate}
          onNext={() => handleStepComplete('customize')}
        />
      )}
      
      {setupStep === 'preview' && (
        <PreviewStep 
          config={userConfig}
          onUpdate={handleConfigUpdate}
          onNext={() => handleStepComplete('preview')}
        />
      )}
      
      {setupStep === 'complete' && (
        <CompleteStep 
          config={userConfig}
          onRestart={() => setSetupStep('welcome')}
        />
      )}
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext, userName }) {
  return (
    <div className="setup-step welcome-step">
      <div className="step-content">
        <div className="welcome-header">
          <h1>🎉 Welcome to Your Personal Task Center!</h1>
          <p>Let's set up your personalized notification center in just a few steps.</p>
        </div>
        
        <div className="features-list">
          <h3>What you'll get:</h3>
          <ul>
            <li>✅ Personalized task organization</li>
            <li>✅ Custom colors and themes</li>
            <li>✅ Real-time Notion sync</li>
            <li>✅ Mobile-responsive design</li>
            <li>✅ Your own unique configuration</li>
          </ul>
        </div>
        
        {/* Preview on welcome step */}
        <div className="preview-container">
          <div className="preview-header">
            <h3>📋 Preview of Your Notification Center</h3>
            <p>Connect to Notion to unlock this beautiful task management widget!</p>
          </div>
          
          <div className="notification-preview">
            <div className="preview-overlay">
              <div className="preview-content">
                <div className="preview-title">My Task Center</div>
                <div className="preview-filters">
                  <div className="preview-filter">All Courses</div>
                  <div className="preview-filter">All Types</div>
                </div>
                <div className="preview-sections">
                  <div className="preview-section">
                    <div className="preview-section-title">📅 Due Today (3)</div>
                    <div className="preview-task">Complete project proposal</div>
                    <div className="preview-task">Review team feedback</div>
                  </div>
                  <div className="preview-section">
                    <div className="preview-section-title">⏰ Overdue (1)</div>
                    <div className="preview-task">Submit final report</div>
                  </div>
                </div>
              </div>
              <div className="blur-overlay"></div>
              <div className="connect-overlay">
                <div className="connect-content">
                  <div className="connect-icon">🔗</div>
                  <h4>Connect to Notion</h4>
                  <p>Unlock your personalized task center</p>
                  <button 
                    className="connect-button"
                    onClick={onNext}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notion Setup Step Component
function NotionSetupStep({ config, onUpdate, onNext }) {
  const [isConnected, setIsConnected] = useState(!!config.notion.token);

  const handleNotionConnect = (notionData) => {
    onUpdate({
      notion: {
        ...config.notion,
        ...notionData
      }
    });
    setIsConnected(true);
  };

  return (
    <div className="setup-step notion-step">
      <div className="step-content">
        <h2>🔗 Connect to Notion</h2>
        <p>Connect your Notion workspace to sync your tasks automatically.</p>
        
        <div className="setup-instructions" style={{ 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
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
            <li><strong>Database ID</strong> - We'll help you find this in the next step</li>
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
            <div className="preview-container">
              <div className="preview-header">
                <h3>📋 Preview of Your Notification Center</h3>
                <p>Connect to Notion to unlock this beautiful task management widget!</p>
              </div>
              
              <div className="notification-preview">
                <div className="preview-overlay">
                  <div className="preview-content">
                    <div className="preview-title">My Task Center</div>
                    <div className="preview-filters">
                      <div className="preview-filter">All Courses</div>
                      <div className="preview-filter">All Types</div>
                    </div>
                    <div className="preview-sections">
                      <div className="preview-section">
                        <div className="preview-section-title">📅 Due Today (3)</div>
                        <div className="preview-task">Complete project proposal</div>
                        <div className="preview-task">Review team feedback</div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">⏰ Overdue (1)</div>
                        <div className="preview-task">Submit final report</div>
                      </div>
                    </div>
                  </div>
                  <div className="blur-overlay"></div>
                  <div className="connect-overlay">
                    <div className="connect-content">
                      <div className="connect-icon">🔗</div>
                      <h4>Connect to Notion</h4>
                      <p>Unlock your personalized task center</p>
                      <button 
                        className="connect-button"
                        onClick={() => {
                          console.log('NotionSetupStep Connect button clicked!');
                          // For now, just simulate a connection
                          handleNotionConnect({
                            token: 'test_token_123',
                            databaseId: 'test_db_123',
                            workspaceName: 'Test Workspace'
                          });
                        }}
                      >
                        Connect with Notion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="notion-connected">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h4>Connected to Notion!</h4>
              <p>Your workspace is connected and ready to use.</p>
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
                Now we need to connect to your specific task database. Simply paste your Notion database URL below and we'll handle the rest!
              </p>
              
              <div style={{ 
                backgroundColor: '#fef3c7', 
                border: '1px solid #fcd34d', 
                borderRadius: '6px', 
                padding: '12px', 
                margin: '15px 0',
                fontSize: '13px'
              }}>
                <strong>📝 Easy way - just paste your Notion URL:</strong>
                <p style={{ margin: '8px 0 0 0' }}>
                  Copy the URL from your Notion database and paste it below. We'll automatically extract the Database ID for you!
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
                        The link should look like: <code style={{ backgroundColor: '#374151', padding: '2px 4px', borderRadius: '3px' }}>notion.so/workspace/32-char-id</code>
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
                  placeholder="https://notion.so/your-workspace/32-character-id"
                  onChange={(e) => {
                    const url = e.target.value;
                    // Extract database ID from Notion URL
                    const match = url.match(/notion\.so\/[^\/]+\/([a-f0-9]{32})/);
                    if (match) {
                      const databaseId = match[1];
                      onUpdate({
                        notion: { ...config.notion, databaseId: databaseId }
                      });
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
                  value={config.notion.databaseId}
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
            
            <button className="next-button" onClick={onNext}>
              Continue to Customization →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Customize Step Component
function CustomizeStep({ config, onUpdate, onNext }) {
  return (
    <div className="setup-step customize-step">
      <div className="step-content">
        <h2>🎨 Customize Your Widget</h2>
        <p>Make it yours! Choose colors, layout, and preferences.</p>
        
        <ConfigPanel 
          onConfigChange={(updates) => onUpdate(updates)}
          initialConfig={config}
        />
        
        <button className="next-button" onClick={onNext}>
          Preview Your Widget →
        </button>
      </div>
    </div>
  );
}

// Preview Step Component
function PreviewStep({ config, onUpdate, onNext }) {
  return (
    <div className="setup-step preview-step">
      <div className="step-content">
        <h2>👀 Preview Your Widget</h2>
        <p>Here's how your personalized notification center will look:</p>
        
        <div className="preview-container">
          <NotificationCenter config={config} />
        </div>
        
        <div className="preview-actions">
          <button className="back-button" onClick={() => onUpdate({})}>
            ← Back to Customization
          </button>
          <button className="next-button" onClick={onNext}>
            Looks Great! Finish Setup →
          </button>
        </div>
      </div>
    </div>
  );
}

// Complete Step Component
function CompleteStep({ config, onRestart }) {
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
          <button className="copy-button" onClick={() => navigator.clipboard.writeText(embedUrl)}>
            Copy Embed URL
          </button>
        </div>
      </div>
    </div>
  );
}
