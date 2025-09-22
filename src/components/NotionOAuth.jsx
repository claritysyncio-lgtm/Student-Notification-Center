import React, { useState } from 'react';

export default function NotionOAuth({ onSuccess, onError }) {
  console.log('NotionOAuth component rendered');
  console.log('onSuccess function:', onSuccess);
  console.log('onError function:', onError);
  const [showManualSetup, setShowManualSetup] = useState(false);
  const [token, setToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');

  const handleConnect = () => {
    console.log('Connect button clicked!');
    setShowManualSetup(true);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    if (!token || !databaseId) {
      alert('Please enter both your Notion token and database ID');
      return;
    }

    // Simulate successful connection
    if (onSuccess) {
      onSuccess({
        token: token,
        databaseId: databaseId,
        workspaceName: 'Your Notion Workspace'
      });
    }
  };

  const handleOpenNotionIntegrations = () => {
    window.open('https://notion.so/my-integrations', '_blank');
  };

  if (showManualSetup) {
    return (
      <div className="notion-oauth">
        <div className="oauth-card">
          <div className="oauth-header">
            <div className="notion-logo">📝</div>
            <h3>Connect to Notion</h3>
            <p>Enter your Notion integration details</p>
          </div>
          
          <form onSubmit={handleManualSubmit} className="manual-setup-form">
            <div className="form-group">
              <label>Integration Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="secret_..."
                required
              />
              <small>
                Get this from{' '}
                <button 
                  type="button" 
                  className="link-button"
                  onClick={handleOpenNotionIntegrations}
                >
                  notion.so/my-integrations
                </button>
              </small>
            </div>
            
            <div className="form-group">
              <label>Database ID</label>
              <input
                type="text"
                value={databaseId}
                onChange={(e) => setDatabaseId(e.target.value)}
                placeholder="32-character database ID"
                required
              />
              <small>Find this in your Notion database URL</small>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="back-button"
                onClick={() => setShowManualSetup(false)}
              >
                ← Back
              </button>
              <button type="submit" className="connect-button">
                Connect to Notion
              </button>
            </div>
          </form>
          
          <div className="oauth-info">
            <p><strong>Setup Instructions:</strong></p>
            <ol>
              <li>Create a Notion integration at the link above</li>
              <li>Copy the integration token</li>
              <li>Share your database with the integration</li>
              <li>Copy the database ID from the URL</li>
              <li>Enter both details above</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-oauth">
      <div className="oauth-card">
        <div className="oauth-header">
          <div className="notion-logo">📝</div>
          <h3>Connect to Notion</h3>
          <p>Connect your Notion workspace to sync your tasks</p>
        </div>
        
        <button 
          className="connect-button"
          onClick={handleConnect}
          style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.459 4.208c.746-.606 1.026-.56 2.428.466l13.967 10.873c.763.646.763 1.169 0 1.815L6.887 21.82c-1.402 1.026-1.682 1.072-2.428.466-.746-.606-.746-1.169 0-1.815L15.437 12 4.459 6.023c-.746-.606-.746-1.169 0-1.815z"/>
          </svg>
          Connect with Notion
        </button>
        
        <div className="oauth-info">
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>You'll enter your Notion integration details</li>
            <li>Your data stays secure and private</li>
            <li>No server required - everything runs locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
