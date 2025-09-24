import React, { useState } from 'react';

/**
 * IntegrationPage Component
 * 
 * A dedicated page for users to integrate their Notion database
 * by simply pasting their database URL.
 */
export default function IntegrationPage({ onDatabaseSelected, onCancel }) {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [extractedId, setExtractedId] = useState('');
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

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setUrlError('');
    
    // Auto-extract ID as user types
    const databaseId = extractDatabaseId(url);
    if (databaseId) {
      setExtractedId(databaseId);
    } else {
      setExtractedId('');
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
    
    if (!extractedId) {
      setUrlError('Invalid Notion database URL. Please check the format.');
      setIsLoading(false);
      return;
    }
    
    // Use the extracted database ID
    localStorage.setItem('notionDatabaseId', extractedId);
    onDatabaseSelected(extractedId);
  };

  return (
    <div className="integration-page">
      <div className="integration-container">
        <div className="integration-header">
          <h1>📊 Connect to Assessments</h1>
          <p>Connect to your Assessments database to start using the notification center</p>
        </div>

        <div className="integration-form">
          <div className="database-selection">
            <div className="database-item">
              <div className="database-info">
                <h3>📊 Assessments</h3>
                <p>Your main assessments and tasks database</p>
              </div>
              <div className="database-radio">
                <input 
                  type="radio" 
                  name="database" 
                  value="assessments"
                  checked={true}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="url-input-section">
            <div className="input-header">
              <label htmlFor="database-url">Enter your database URL</label>
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
              type="text"
              value={databaseUrl}
              onChange={handleUrlChange}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="url-input"
              disabled={isLoading}
            />
            
            {extractedId && (
              <div className="extracted-id-display">
                <label>Auto-generated Database ID:</label>
                <input
                  type="text"
                  value={extractedId}
                  readOnly
                  className="id-input"
                />
              </div>
            )}
            
            {urlError && <div className="error-message">{urlError}</div>}
          </div>
            
          <button 
            onClick={() => {
              if (extractedId) {
                // Use the extracted ID from URL
                localStorage.setItem('notionDatabaseId', extractedId);
                onDatabaseSelected(extractedId);
              } else {
                // Use the default Assessments database ID
                const assessmentsDatabaseId = '270a5eba-e7ac-8150-843a-cf6e74c5f8fc';
                localStorage.setItem('notionDatabaseId', assessmentsDatabaseId);
                onDatabaseSelected(assessmentsDatabaseId);
              }
            }}
            disabled={isLoading}
            className="connect-button"
          >
            {isLoading ? '🔄 Connecting...' : '✅ Connect to Assessments'}
          </button>
        </div>

        <div className="integration-help">
          <h3>📋 What you'll get:</h3>
          <ul>
            <li>📊 Real-time task notifications</li>
            <li>🎯 Personalized dashboard</li>
            <li>💻 Desktop and mobile friendly interface</li>
            <li>🔒 Secure integration</li>
          </ul>
          
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
