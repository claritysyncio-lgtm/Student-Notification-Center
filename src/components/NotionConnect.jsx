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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.186c.373.047.56.327.373.746zm-1.635 10.5v.327l-2.428-.28v-9.186l2.428.233v9.106z" fill="currentColor"/>
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