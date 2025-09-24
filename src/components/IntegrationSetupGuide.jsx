import React, { useState } from 'react';

export default function IntegrationSetupGuide({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationToken, setIntegrationToken] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const steps = [
    {
      title: "Create Notion Integration",
      description: "We'll guide you through creating your own Notion integration in just 2 minutes."
    },
    {
      title: "Get Your Token",
      description: "Copy your integration token and paste it below."
    },
    {
      title: "Connect Your Database",
      description: "Paste your database URL and we'll test the connection."
    }
  ];

  const handleTokenSubmit = () => {
    if (integrationToken.trim()) {
      setCurrentStep(3);
    }
  };

  const handleDatabaseSubmit = async () => {
    if (!databaseUrl.trim() || !integrationToken.trim()) return;
    
    setIsTesting(true);
    
    try {
      // Extract database ID from URL
      const databaseId = extractDatabaseId(databaseUrl);
      if (!databaseId) {
        alert('Invalid database URL. Please check the format.');
        setIsTesting(false);
        return;
      }

      // Test the connection
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseId: databaseId,
          token: integrationToken.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token and database ID
        localStorage.setItem('notionAccessToken', integrationToken.trim());
        localStorage.setItem('notionDatabaseId', databaseId);
        localStorage.setItem('notionWorkspace', 'User Integration');
        
        // Complete the setup
        onComplete(databaseId);
      } else {
        alert(`Connection failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error testing connection: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const extractDatabaseId = (url) => {
    const patterns = [
      /notion\.so\/([a-f0-9]{32})/i,
      /notion\.so\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
      /([a-f0-9]{32})/i,
      /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const openNotionIntegrations = () => {
    window.open('https://www.notion.so/my-integrations', '_blank');
  };

  return (
    <div className="notion-integration-setup">
      <div className="notion-setup-header">
        <div className="notion-setup-icon">
          <img 
            src="/notion_logo_icon.png" 
            alt="Notion" 
            width="48" 
            height="48"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="notion-setup-title">Setup Your Notion Integration</div>
        <div className="notion-setup-description">
          Create your own Notion integration to connect your database. This gives you full control and works with any database you own.
        </div>
      </div>

      {/* Progress Steps */}
      <div className="notion-progress-steps">
        {steps.map((step, index) => (
          <div key={index} className={`notion-step ${currentStep > index ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}>
            <div className="notion-step-number">{index + 1}</div>
            <div className="notion-step-content">
              <div className="notion-step-title">{step.title}</div>
              <div className="notion-step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Create Integration */}
      {currentStep === 1 && (
        <div className="notion-setup-content">
          <div className="notion-step-instructions">
            <h3>Step 1: Create Your Notion Integration</h3>
            <ol>
              <li>Click the button below to open Notion's integration page</li>
              <li>Click <strong>"New integration"</strong></li>
              <li>Give it a name like <strong>"My Notification Center"</strong></li>
              <li>Select your workspace</li>
              <li>Click <strong>"Submit"</strong></li>
              <li>Copy the <strong>"Internal Integration Token"</strong></li>
            </ol>
            
            <div className="notion-action-buttons">
              <button 
                className="notion-button primary"
                onClick={openNotionIntegrations}
              >
                Open Notion Integrations
              </button>
              <button 
                className="notion-button secondary"
                onClick={() => setCurrentStep(2)}
              >
                I've Created My Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Token Input */}
      {currentStep === 2 && (
        <div className="notion-setup-content">
          <div className="notion-input-section">
            <div className="notion-input-label">Integration Token</div>
            <div className="notion-input-container">
              <input
                type="password"
                value={integrationToken}
                onChange={(e) => setIntegrationToken(e.target.value)}
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="notion-token-input"
                autoFocus
              />
              <div className="notion-input-hint">
                Paste your integration token from Notion. It should start with "secret_"
              </div>
            </div>
          </div>

          <div className="notion-action-buttons">
            <button 
              className="notion-button secondary"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </button>
            <button 
              className="notion-button primary"
              onClick={handleTokenSubmit}
              disabled={!integrationToken.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Database Connection */}
      {currentStep === 3 && (
        <div className="notion-setup-content">
          <div className="notion-input-section">
            <div className="notion-input-label">Database URL</div>
            <div className="notion-input-container">
              <input
                type="url"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                placeholder="https://notion.so/your-workspace/database-id..."
                className="notion-url-input"
                autoFocus
              />
              <div className="notion-input-hint">
                Paste your Notion database URL. Click the 3 dots (...) next to your database title, then "Copy link to view"
              </div>
            </div>
          </div>

          <div className="notion-action-buttons">
            <button 
              className="notion-button secondary"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </button>
            <button 
              className="notion-button primary"
              onClick={handleDatabaseSubmit}
              disabled={!databaseUrl.trim() || isTesting}
            >
              {isTesting ? 'Testing Connection...' : 'Connect Database'}
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="notion-help-section">
        <div className="notion-help-title">Why This Approach?</div>
        <div className="notion-help-content">
          <p>Creating your own integration gives you:</p>
          <ul>
            <li>✅ Full control over your data</li>
            <li>✅ Access to any database you own</li>
            <li>✅ No sharing permission issues</li>
            <li>✅ Works with any Notion workspace</li>
          </ul>
        </div>
      </div>

      <div className="notion-setup-actions">
        <button
          onClick={onCancel}
          className="notion-button secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
