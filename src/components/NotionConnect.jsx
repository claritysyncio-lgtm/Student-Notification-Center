import React from 'react';
import './NotionConnect.css';

export default function NotionConnect() {
  const handleConnectToNotion = () => {
    // Direct users to the actual Notion integration page
    window.open('https://www.notion.so/integrations', '_blank');
  };

  return (
    <div className="notion-connect-page">
      <div className="notion-connect-container">
        <div className="notion-header">
          <div className="notion-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM7 7h10v10H7V7z" fill="currentColor"/>
            </svg>
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

          <div className="notion-legal">
            <p>
              By connecting to Notion, you agree to our{' '}
              <a href="/legal.html#terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/legal.html#privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </p>
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
            This will open Notion's integration page where you can authorize our app.
          </p>
        </div>
      </div>
    </div>
  );
}