import React, { useCallback, useState } from 'react';
import './NotionConnect.css';
import { OAUTH_CONFIG } from '../config/oauthConfig';
import DatabaseLinkPage from './DatabaseLinkPage';

/**
 * NotionConnect Component
 * 
 * Displays the connection interface for users to authenticate with Notion.
 * Provides information about the integration and handles the OAuth flow initiation.
 */
export default function NotionConnect() {
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);

  /**
   * Handle Notion OAuth connection initiation
   */
  const handleConnectToNotion = useCallback(() => {
    try {
      // Validate OAuth configuration before redirecting
      if (!OAUTH_CONFIG.OAUTH_AUTHORIZE_URL) {
        console.error('OAuth configuration is missing');
        alert('OAuth configuration error. Please contact support.');
        return;
      }
      
      console.log('Initiating Notion OAuth flow...');
      window.location.href = OAUTH_CONFIG.OAUTH_AUTHORIZE_URL;
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      alert('Failed to connect to Notion. Please try again.');
    }
  }, []);

  /**
   * Handle database setup completion - proceed to OAuth
   */
  const handleDatabaseSetupComplete = useCallback((databaseId) => {
    console.log('Database setup complete, database ID:', databaseId);
    // The database ID should already be stored by DatabaseLinkPage
    // Now proceed to OAuth
    handleConnectToNotion();
  }, [handleConnectToNotion]);

  /**
   * Handle database setup cancellation
   */
  const handleDatabaseSetupCancel = useCallback(() => {
    setShowDatabaseSetup(false);
  }, []);

  // Show database setup page if requested
  if (showDatabaseSetup) {
    return (
      <DatabaseLinkPage 
        onDatabaseIdExtracted={handleDatabaseSetupComplete}
        onCancel={handleDatabaseSetupCancel}
        isFirstStep={true}
      />
    );
  }

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
              <li>💻 Desktop and mobile friendly interface</li>
              <li>🔒 Secure integration</li>
            </ul>
          </div>

                  <div className="notion-button-group">
                    <button 
                      className="notion-button" 
                      onClick={() => setShowDatabaseSetup(true)}
                    >
                      Get Started
                    </button>
                    <button 
                      className="notion-button secondary" 
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      style={{ marginTop: '12px' }}
                    >
                      Start Fresh (Clear All Data)
                    </button>
                  </div>
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