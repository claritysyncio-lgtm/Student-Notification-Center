import React from 'react';
import './NotionConnect.css';

export default function NotionConnect() {
  const handleConnectToNotion = () => {
    // Direct users to your specific Notion OAuth integration
    window.location.href = 'https://api.notion.com/v1/oauth/authorize?client_id=276d872b-594c-80c4-8a38-003774c17f93&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fnotification-center-for-customers.vercel.app%2Fapi%2Fauth%2Fcallback%2Fnotion';
  };

  return (
    <div className="notion-connect-page">
      <div className="notion-connect-container">
        <div className="notion-header">
          <div className="notion-logo">
            <img 
              src="/notion_logo_icon.png" 
              alt="Notion" 
              width="40" 
              height="40"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 className="notion-title">Connect to Notion</h1>
          <p className="notion-description">
            Get started with your personalized notification center by connecting to Notion.
          </p>
        </div>

        <div className="notion-content">
          <div className="notion-features">
            <h3>What you'll get:</h3>
            <ul>
              <li>📊 Real-time task notifications</li>
              <li>🎯 Personalized dashboard</li>
              <li>📱 Mobile-friendly interface</li>
              <li>🔒 Secure integration</li>
            </ul>
          </div>

          <button 
            className="notion-button" 
            onClick={handleConnectToNotion}
          >
            Connect to Notion
          </button>
        </div>

        <div className="notion-footer">
          <p className="notion-footer-text">
            Clicking "Connect to Notion" will redirect you to Notion's authorization page where you can grant access to your workspace.
          </p>
          <div className="notion-legal-links">
            <p className="legal-text">
              By connecting, you agree to our{' '}
              <a href="/legal.html#terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>,{' '}
              <a href="/legal.html#privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, and{' '}
              <a href="/legal.html#permissions" target="_blank" rel="noopener noreferrer">Integration Permissions</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}