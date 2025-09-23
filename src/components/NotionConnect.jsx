import React from 'react';
import './NotionConnect.css';
import { OAUTH_CONFIG } from '../config/oauthConfig';

export default function NotionConnect() {
  const handleConnectToNotion = () => {
    // Direct users to your specific Notion OAuth integration
    window.location.href = OAUTH_CONFIG.OAUTH_AUTHORIZE_URL;
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
          
          <div className="notion-website-section">
            <a 
              href="https://claritysync.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="visit-website-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Visit Our Website
            </a>
          </div>

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