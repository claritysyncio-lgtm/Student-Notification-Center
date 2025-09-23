import React, { useState } from 'react';
import './NotionConnect.css';

export default function NotionConnect() {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!databaseUrl.trim()) {
      setError('Please enter a Notion database URL');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Extract database ID from URL
      const url = new URL(databaseUrl);
      const pathParts = url.pathname.split('/');
      const databaseId = pathParts[pathParts.length - 1];
      
      if (!databaseId || databaseId.length < 32) {
        throw new Error('Invalid Notion database URL');
      }

      // Test the connection
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ databaseId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to database');
      }

      // Store the database ID and refresh the page to show notification center
      localStorage.setItem('notionDatabaseId', databaseId);
      window.location.reload();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="notion-connect-page">
      <div className="notion-connect-container">
        <div className="notion-header">
          <div className="notion-logo">
            <div className="notion-icon">📝</div>
            <h1>Connect to Notion</h1>
          </div>
          <p className="notion-subtitle">
            Connect your Notion database to start receiving notifications
          </p>
        </div>

        <div className="notion-form">
          <div className="form-group">
            <label htmlFor="database-url" className="form-label">
              Notion Database URL
            </label>
            <input
              id="database-url"
              type="url"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="https://www.notion.so/your-workspace/database-id?v=..."
              className="form-input"
              disabled={isConnecting}
            />
            <p className="form-help">
              Copy the URL from your Notion database page
            </p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting || !databaseUrl.trim()}
            className="notion-button"
          >
            {isConnecting ? (
              <>
                <div className="spinner"></div>
                Connecting...
              </>
            ) : (
              <>
                <span className="button-icon">🔗</span>
                Connect to Notion
              </>
            )}
          </button>
        </div>

        <div className="notion-footer">
          <p className="footer-text">
            By connecting, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
