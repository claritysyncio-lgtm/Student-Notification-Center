import React, { useState } from 'react';

/**
 * IntegrationPage Component
 * 
 * A dedicated page for users to integrate their Notion database
 * by simply pasting their database URL.
 */
export default function IntegrationPage({ onDatabaseSelected, onCancel }) {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Extract database ID from Notion URL
   */
  const extractDatabaseId = (url) => {
    try {
      // Handle different Notion URL formats
      const patterns = [
        /notion\.so\/[^\/]+\/([a-f0-9]{32})/i,
        /notion\.site\/([a-f0-9]{32})/i,
        /notion\.so\/([a-f0-9]{32})/i
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
      
      // If no pattern matches, try to extract 32-character hex string
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

  const handleUrlSubmit = async () => {
    setUrlError('');
    setIsLoading(true);
    
    if (!databaseUrl.trim()) {
      setUrlError('Please enter a database URL');
      setIsLoading(false);
      return;
    }
    
    const databaseId = extractDatabaseId(databaseUrl);
    
    if (!databaseId) {
      setUrlError('Invalid Notion database URL. Please check the format.');
      setIsLoading(false);
      return;
    }
    
    // Use the extracted database ID
    localStorage.setItem('notionDatabaseId', databaseId);
    onDatabaseSelected(databaseId);
  };

  return (
    <div className="integration-page">
      <div className="integration-container">
        <div className="integration-header">
          <h1>🔗 Connect Your Database</h1>
          <p>Paste your Notion database URL to get started with your notification center</p>
        </div>

        <div className="integration-form">
          <div className="url-input-section">
            <div className="input-header">
              <label htmlFor="database-url">Database URL</label>
              <button 
                type="button"
                className="help-icon"
                title="In Notion: Click the 3 dots (...) next to your database title, then select 'Copy link to database'"
              >
                ℹ️ How to get this link
              </button>
            </div>
            
            <input
              id="database-url"
              type="url"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="url-input"
              disabled={isLoading}
            />
            
            {urlError && <div className="error-message">{urlError}</div>}
            
            <button 
              onClick={handleUrlSubmit}
              disabled={!databaseUrl.trim() || isLoading}
              className="connect-button"
            >
              {isLoading ? '🔄 Connecting...' : '✅ Connect Database'}
            </button>
          </div>
        </div>

        <div className="integration-help">
          <h3>📋 How to get your database URL:</h3>
          <ol>
            <li>Go to your Notion database</li>
            <li>Click the <strong>3 dots (...)</strong> next to the database title</li>
            <li>Select <strong>"Copy link to database"</strong></li>
            <li>Paste the link above</li>
          </ol>
          
          <div className="help-note">
            <strong>💡 Required database properties:</strong>
            <ul>
              <li><strong>Name</strong> (Title)</li>
              <li><strong>Due</strong> (Date)</li>
              <li><strong>Course</strong> (Text/Select)</li>
              <li><strong>Type</strong> (Select)</li>
              <li><strong>Grade</strong> (Number)</li>
              <li><strong>Completed</strong> (Checkbox)</li>
            </ul>
          </div>
        </div>

        <div className="integration-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
