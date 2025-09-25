import React from 'react';

/**
 * ConnectToNotionScreen Component
 * 
 * Shows when the embed doesn't have access to localStorage data.
 * Provides a clean interface for users to connect to Notion within the embed.
 */
export default function ConnectToNotionScreen() {
  const handleConnect = () => {
    // Open the main app in a new tab for authentication
    window.open('/', '_blank');
  };

  const handleOpenMainApp = () => {
    // Navigate to main app in the same tab
    window.location.href = '/';
  };

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      background: '#ffffff',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      margin: '10px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🔗
        </div>
        <h2 style={{
          margin: '0 0 12px 0',
          color: '#2d3748',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Connect to Notion
        </h2>
        <p style={{
          margin: '0 0 20px 0',
          color: '#718096',
          lineHeight: '1.5',
          fontSize: '14px'
        }}>
          This embed needs to be connected to your Notion database to show your tasks.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleConnect}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            marginRight: '10px',
            textDecoration: 'none'
          }}
        >
          Connect to Notion
        </button>
        
        <button
          onClick={handleOpenMainApp}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'transparent',
            color: '#4299e1',
            border: '1px solid #4299e1',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Open Main App
        </button>
      </div>

      <div style={{
        padding: '16px',
        background: '#f7fafc',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#4a5568',
        textAlign: 'left'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px' }}>
          How to connect:
        </div>
        <ol style={{ margin: '0', paddingLeft: '16px' }}>
          <li>Click "Connect to Notion" above</li>
          <li>Authorize the app in the new tab</li>
          <li>Select your task database</li>
          <li>Return to this embed - it will now show your tasks</li>
        </ol>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#e6fffa',
        border: '1px solid #81e6d9',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#234e52'
      }}>
        <strong>Note:</strong> The embed needs to authenticate separately from the main app due to browser security restrictions.
      </div>
    </div>
  );
}
