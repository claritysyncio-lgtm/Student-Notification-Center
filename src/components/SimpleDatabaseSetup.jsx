import React, { useState } from 'react';

/**
 * SimpleDatabaseSetup Component
 * 
 * A streamlined database setup that appears after OAuth.
 * Users just need to paste their database link.
 */
export default function SimpleDatabaseSetup({ onDatabaseConnected }) {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [extractedId, setExtractedId] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Extract database ID from Notion URL
   */
  const extractDatabaseId = (url) => {
    try {
      const patterns = [
        /notion\.so\/[^\/]+\/([a-f0-9]{32})/i,
        /notion\.site\/([a-f0-9]{32})/i,
        /notion\.so\/([a-f0-9]{32})/i,
        /notion\.so\/[^\/]+\/([a-f0-9]{32})\?/i,
        /notion\.so\/[^\/]+\/([a-f0-9]{32})#/i
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
      
      const hexMatch = url.match(/([a-f0-9]{32})/i);
      if (hexMatch) {
        return hexMatch[1];
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting database ID:', error);
      return null;
    }
  };

  /**
   * Handle URL input and automatic ID extraction
   */
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setError('');
    
    if (url.trim()) {
      const id = extractDatabaseId(url);
      if (id) {
        setExtractedId(id);
      } else {
        setExtractedId('');
      }
    } else {
      setExtractedId('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (!databaseUrl.trim()) {
      setError('Please enter a database URL');
      setIsProcessing(false);
      return;
    }

    const databaseId = extractDatabaseId(databaseUrl);
    
    if (!databaseId) {
      setError('Invalid Notion database URL. Please check the format and try again.');
      setIsProcessing(false);
      return;
    }

    try {
      console.log('💾 Storing database ID:', databaseId);
      localStorage.setItem('notionDatabaseId', databaseId);
      console.log('✅ Database ID stored successfully');
      
      // Call the callback to complete setup
      onDatabaseConnected();
    } catch (error) {
      console.error('Error storing database ID:', error);
      setError('Failed to save database ID. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="simple-database-setup">
      <div className="setup-content">
        <div className="setup-header">
          <div className="setup-icon">
            <img 
              src="/notion_logo_icon.png" 
              alt="Notion" 
              width="48" 
              height="48"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h2 className="setup-title">Almost there!</h2>
          <p className="setup-subtitle">
            Paste your Notion database link to complete the setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-section">
            <label htmlFor="database-url" className="input-label">
              Database URL
            </label>
            <input
              id="database-url"
              type="url"
              value={databaseUrl}
              onChange={handleUrlChange}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="url-input"
              disabled={isProcessing}
              autoFocus
            />
            <div className="input-hint">
              Click the 3 dots (...) next to your database title in Notion, then select "Copy link to view"
            </div>
          </div>

          {extractedId && (
            <div className="extracted-id">
              <div className="extracted-label">Database ID detected</div>
              <div className="extracted-content">
                <div className="extracted-text">{extractedId}</div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(extractedId)}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">{error}</div>
            </div>
          )}

          <div className="setup-actions">
            <button
              type="submit"
              disabled={!extractedId || isProcessing}
              className="connect-button"
            >
              {isProcessing ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        </form>

        <div className="help-section">
          <h3>How to get your database link:</h3>
          <ol>
            <li>Go to your Notion database</li>
            <li>Click the 3 dots (...) next to the database title</li>
            <li>Select "Copy link to view"</li>
            <li>Paste the link above</li>
          </ol>
        </div>

        <div className="important-section">
          <h3>⚠️ Important: Database Access</h3>
          <p>
            After connecting, you may need to share your database with the integration:
          </p>
          <ol>
            <li>Go to your database in Notion</li>
            <li>Click the <strong>"Share"</strong> button (top right)</li>
            <li>Click <strong>"Add people, emails, groups, or integrations"</strong></li>
            <li>Search for <strong>"Student Notification Center"</strong></li>
            <li>Add the integration to give it access</li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        .simple-database-setup {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .setup-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .setup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .setup-icon {
          margin-bottom: 20px;
        }

        .setup-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 10px 0;
        }

        .setup-subtitle {
          font-size: 1.1rem;
          color: #4a5568;
          margin: 0;
        }

        .setup-form {
          margin-bottom: 30px;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .url-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .url-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .input-hint {
          font-size: 0.9rem;
          color: #718096;
          margin-top: 8px;
        }

        .extracted-id {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .extracted-label {
          font-weight: 600;
          color: #22543d;
          margin-bottom: 8px;
        }

        .extracted-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .extracted-text {
          font-family: monospace;
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
          flex: 1;
          color: #2d3748;
        }

        .copy-button {
          background: #48bb78;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fed7d7;
          color: #c53030;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .setup-actions {
          text-align: center;
        }

        .connect-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .connect-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .connect-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .help-section, .important-section {
          background: #f7fafc;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .help-section h3, .important-section h3 {
          margin: 0 0 15px 0;
          color: #2d3748;
          font-size: 1.2rem;
        }

        .help-section ol, .important-section ol {
          margin: 0;
          padding-left: 20px;
          color: #4a5568;
        }

        .help-section li, .important-section li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .important-section {
          background: #fff5f5;
          border: 1px solid #feb2b2;
        }

        .important-section h3 {
          color: #c53030;
        }

        @media (max-width: 600px) {
          .setup-content {
            padding: 30px 20px;
          }
          
          .setup-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
