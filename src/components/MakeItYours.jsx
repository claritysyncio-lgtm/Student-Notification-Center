import React, { useState } from 'react';
import { OAUTH_CONFIG } from '../config/oauthConfig';

/**
 * MakeItYours Component
 * 
 * A single-step setup that combines OAuth and database configuration.
 * Once completed, the user's data will be remembered forever.
 */
export default function MakeItYours({ onSetupComplete }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle the "Make it yours" button click
   * This will redirect to Notion OAuth and then guide through database setup
   */
  const handleMakeItYours = async () => {
    try {
      setIsConnecting(true);
      setError('');

      // Validate OAuth configuration before redirecting
      if (!OAUTH_CONFIG.OAUTH_AUTHORIZE_URL) {
        console.error('OAuth configuration is missing');
        setError('OAuth configuration error. Please contact support.');
        setIsConnecting(false);
        return;
      }
      
      console.log('Initiating Notion OAuth flow...');
      window.location.href = OAUTH_CONFIG.OAUTH_AUTHORIZE_URL;
    } catch (err) {
      console.error('Error starting setup:', err);
      setError('Failed to start setup. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="make-it-yours-container">
      <div className="make-it-yours-content">
        <div className="make-it-yours-header">
          <div className="make-it-yours-icon">
            <img 
              src="/notion_logo_icon.png" 
              alt="Notion" 
              width="64" 
              height="64"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 className="make-it-yours-title">Student Notification Center</h1>
          <p className="make-it-yours-subtitle">
            Connect your Notion database to get personalized task notifications
          </p>
        </div>

        <div className="make-it-yours-description">
          <p>
            This will connect to your Notion workspace and set up your personal notification center. 
            Once connected, you'll never need to set it up again.
          </p>
        </div>

        {error && (
          <div className="make-it-yours-error">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
          </div>
        )}

        <div className="make-it-yours-actions">
          <button
            onClick={handleMakeItYours}
            disabled={isConnecting}
            className="make-it-yours-button"
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Make it yours
              </>
            )}
          </button>
          
          <a 
            href="https://claritysync.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-website-button"
          >
            Visit our website
          </a>
        </div>

        <div className="make-it-yours-features">
          <h3>What you'll get:</h3>
          <ul>
            <li>📅 Tasks organized by due date (Overdue, Today, Tomorrow, This Week)</li>
            <li>✅ Mark tasks as complete directly from the notification center</li>
            <li>🎯 Filter by course and task type</li>
            <li>🔄 Automatic updates from your Notion database</li>
            <li>💾 Your data stays connected forever</li>
          </ul>
        </div>

        <div className="make-it-yours-requirements">
          <h3>Requirements:</h3>
          <p>Your Notion database needs these properties:</p>
          <div className="requirements-grid">
            <div className="requirement-item">
              <strong>Name</strong> (Title)
            </div>
            <div className="requirement-item">
              <strong>Due</strong> (Date)
            </div>
            <div className="requirement-item">
              <strong>Course</strong> (Text/Select)
            </div>
            <div className="requirement-item">
              <strong>Type</strong> (Select)
            </div>
            <div className="requirement-item">
              <strong>Grade</strong> (Number)
            </div>
            <div className="requirement-item">
              <strong>Completed</strong> (Checkbox)
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .make-it-yours-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .make-it-yours-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .make-it-yours-header {
          margin-bottom: 30px;
        }

        .make-it-yours-icon {
          margin-bottom: 20px;
        }

        .make-it-yours-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 10px 0;
        }

        .make-it-yours-subtitle {
          font-size: 1.2rem;
          color: #4a5568;
          margin: 0;
        }

        .make-it-yours-description {
          margin-bottom: 30px;
          color: #2d3748;
          line-height: 1.6;
        }

        .make-it-yours-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fed7d7;
          color: #c53030;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .make-it-yours-actions {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: center;
        }

        .make-it-yours-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 18px 40px;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .make-it-yours-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .make-it-yours-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .button-icon {
          font-size: 1.3rem;
        }

        .visit-website-button {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .visit-website-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
          text-decoration: none;
        }

        .make-it-yours-features {
          text-align: left;
          margin-bottom: 30px;
          background: #f7fafc;
          padding: 25px;
          border-radius: 15px;
        }

        .make-it-yours-features h3 {
          margin: 0 0 15px 0;
          color: #2d3748;
          font-size: 1.3rem;
        }

        .make-it-yours-features ul {
          margin: 0;
          padding-left: 20px;
          color: #4a5568;
        }

        .make-it-yours-features li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .make-it-yours-requirements {
          text-align: left;
          background: #edf2f7;
          padding: 25px;
          border-radius: 15px;
        }

        .make-it-yours-requirements h3 {
          margin: 0 0 15px 0;
          color: #2d3748;
          font-size: 1.3rem;
        }

        .make-it-yours-requirements p {
          margin: 0 0 15px 0;
          color: #4a5568;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }

        .requirement-item {
          background: white;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #2d3748;
        }

        @media (max-width: 600px) {
          .make-it-yours-content {
            padding: 30px 20px;
          }
          
          .make-it-yours-title {
            font-size: 2rem;
          }
          
          .requirements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
