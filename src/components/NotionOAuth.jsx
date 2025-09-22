import React, { useState } from 'react';

export default function NotionOAuth({ onSuccess, onError }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('notion_oauth_state', state);
    
    // Build OAuth URL
    const clientId = '276d872b-594c-80c4-8a38-003774c17f93';
    const redirectUri = encodeURIComponent('https://claritysync.io/auth/callback');
    const oauthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}&state=${state}`;
    
    // Redirect to Notion OAuth
    window.location.href = oauthUrl;
  };

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
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="loading-spinner-small"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746-.606 1.026-.56 2.428.466l13.967 10.873c.763.646.763 1.169 0 1.815L6.887 21.82c-1.402 1.026-1.682 1.072-2.428.466-.746-.606-.746-1.169 0-1.815L15.437 12 4.459 6.023c-.746-.606-.746-1.169 0-1.815z"/>
              </svg>
              Connect with Notion
            </>
          )}
        </button>
        
        <div className="oauth-info">
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>You'll be redirected to Notion to authorize the connection</li>
            <li>After authorization, you'll return to setup your widget</li>
            <li>Your data stays secure and private</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
