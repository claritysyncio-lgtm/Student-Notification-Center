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

  console.log('PersonalizedSetup render - setupStep:', setupStep, 'userConfig:', userConfig);
  
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
        
        <button className="next-button" onClick={onNext}>
          Let's Get Started! →
        </button>
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
        
        {!isConnected ? (
          <div className="notion-connect">
            <p>Click the button below to connect your Notion account:</p>
            <button 
              className="connect-button"
              onClick={() => {
                console.log('NotionSetupStep Connect button clicked!');
                alert('NotionSetupStep Connect button clicked!');
                // For now, just simulate a connection
                handleNotionConnect({
                  token: 'test_token_123',
                  databaseId: 'test_db_123',
                  workspaceName: 'Test Workspace'
                });
              }}
              style={{ 
                backgroundColor: 'blue', 
                color: 'white', 
                padding: '15px 30px', 
                fontSize: '16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Connect with Notion
            </button>
          </div>
        ) : (
          <div className="notion-connected">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h4>Connected to Notion!</h4>
              <p>Your workspace is connected and ready to use.</p>
            </div>
            
            <div className="database-setup">
              <label>Database ID:</label>
              <input
                type="text"
                value={config.notion.databaseId}
                onChange={(e) => onUpdate({
                  notion: { ...config.notion, databaseId: e.target.value }
                })}
                placeholder="Enter your Notion database ID"
              />
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
