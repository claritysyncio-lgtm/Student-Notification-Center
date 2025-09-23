import React, { useState, useEffect } from 'react';

/**
 * DatabaseSelector Component
 * 
 * Allows users to select which Notion database to use for their tasks
 * after they've connected to Notion via OAuth.
 */
export default function DatabaseSelector({ onDatabaseSelected, onCancel }) {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    loadDatabases();
  }, []);

  const loadDatabases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('notionAccessToken');
      if (!token) {
        throw new Error('No access token found. Please reconnect to Notion.');
      }

      const response = await fetch(`/api/databases?token=${encodeURIComponent(token)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load databases');
      }

      setDatabases(data.databases || []);
      
      if (data.databases && data.databases.length === 0) {
        setError('No databases found. Please create a database in Notion first.');
      }
    } catch (err) {
      console.error('Failed to load databases:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSelectDatabase = () => {
    if (selectedDatabase) {
      localStorage.setItem('notionDatabaseId', selectedDatabase);
      onDatabaseSelected(selectedDatabase);
    }
  };

  const handleUrlSubmit = () => {
    setUrlError('');
    
    if (!databaseUrl.trim()) {
      setUrlError('Please enter a database URL');
      return;
    }
    
    const databaseId = extractDatabaseId(databaseUrl);
    
    if (!databaseId) {
      setUrlError('Invalid Notion database URL. Please check the format.');
      return;
    }
    
    // Use the extracted database ID
    localStorage.setItem('notionDatabaseId', databaseId);
    onDatabaseSelected(databaseId);
  };

  const handleRefresh = () => {
    loadDatabases();
  };

  if (loading) {
    return (
      <div className="database-selector">
        <div className="selector-header">
          <h3>Select Your Task Database</h3>
          <p>Loading your Notion databases...</p>
        </div>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="database-selector">
        <div className="selector-header">
          <h3>Select Your Task Database</h3>
          <p className="error-message">❌ {error}</p>
        </div>
        <div className="selector-actions">
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Try Again
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="database-selector">
      <div className="selector-header">
        <h3>Select Your Task Database</h3>
        <p>Choose which Notion database contains your tasks:</p>
      </div>

      {/* URL Input Option */}
      <div className="url-input-section">
        <div className="url-input-header">
          <h4>📋 Or paste your database URL</h4>
          <button 
            type="button"
            className="info-icon"
            title="Click the 3 dots (...) next to your database title in Notion, then select 'Copy link to database'"
          >
            ℹ️
          </button>
        </div>
        
        {!showUrlInput ? (
          <button 
            onClick={() => setShowUrlInput(true)}
            className="show-url-btn"
          >
            📋 Paste Database URL Instead
          </button>
        ) : (
          <div className="url-input-container">
            <input
              type="url"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="url-input"
            />
            {urlError && <p className="url-error">{urlError}</p>}
            <div className="url-actions">
              <button onClick={handleUrlSubmit} className="url-submit-btn">
                ✅ Use This URL
              </button>
              <button onClick={() => setShowUrlInput(false)} className="url-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Database List */}
      <div className="database-list">
        <h4>📁 Or select from your databases:</h4>
        {databases.map((db) => (
          <div 
            key={db.id} 
            className={`database-item ${selectedDatabase === db.id ? 'selected' : ''}`}
            onClick={() => setSelectedDatabase(db.id)}
          >
            <div className="database-info">
              <h4>{db.title}</h4>
              <p className="database-id">ID: {db.id}</p>
            </div>
            <div className="database-radio">
              <input 
                type="radio" 
                name="database" 
                value={db.id}
                checked={selectedDatabase === db.id}
                onChange={() => setSelectedDatabase(db.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="selector-actions">
        <button 
          onClick={handleSelectDatabase} 
          disabled={!selectedDatabase}
          className="select-btn"
        >
          ✅ Use This Database
        </button>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>

      <div className="selector-help">
        <p><strong>💡 Tip:</strong> Make sure your database has these properties:</p>
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
  );
}
