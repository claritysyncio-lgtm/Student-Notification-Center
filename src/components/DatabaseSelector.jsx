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
      <div className="notion-database-selector">
        <div className="notion-header">
          <div className="notion-title">Connect your database</div>
          <div className="notion-subtitle">Loading your Notion databases...</div>
        </div>
        <div className="notion-loading">
          <div className="notion-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notion-database-selector">
        <div className="notion-header">
          <div className="notion-title">Connect your database</div>
          <div className="notion-error">❌ {error}</div>
        </div>
        <div className="notion-actions">
          <button onClick={handleRefresh} className="notion-button secondary">
            Try again
          </button>
          <button onClick={onCancel} className="notion-button">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-database-selector">
      <div className="notion-header">
        <div className="notion-title">Connect your database</div>
        <div className="notion-subtitle">Choose which Notion database contains your tasks and assessments</div>
      </div>

      {/* URL Input Option */}
      <div className="notion-section">
        <div className="notion-section-header">
          <span className="notion-section-title">Or paste your database URL</span>
          <button 
            type="button"
            className="notion-info-icon"
            title="Click the 3 dots (...) next to your database title in Notion, then select 'Copy link to database'"
          >
            ℹ️
          </button>
        </div>
        
        {!showUrlInput ? (
          <button 
            onClick={() => setShowUrlInput(true)}
            className="notion-button secondary full-width"
          >
            📋 Paste Database URL Instead
          </button>
        ) : (
          <div className="notion-url-container">
            <input
              type="url"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="notion-input"
            />
            {urlError && <div className="notion-error-text">{urlError}</div>}
            <div className="notion-url-actions">
              <button onClick={handleUrlSubmit} className="notion-button">
                Use this URL
              </button>
              <button onClick={() => setShowUrlInput(false)} className="notion-button secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Database List */}
      <div className="notion-section">
        <div className="notion-section-title">Or select from your databases:</div>
        <div className="notion-database-list">
          {databases.map((db) => (
            <div 
              key={db.id} 
              className={`notion-database-item ${selectedDatabase === db.id ? 'selected' : ''}`}
              onClick={() => setSelectedDatabase(db.id)}
            >
              <div className="notion-database-info">
                <div className="notion-database-name">{db.title}</div>
                <div className="notion-database-id">ID: {db.id}</div>
              </div>
              <div className="notion-radio">
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
      </div>

      <div className="notion-actions">
        <button 
          onClick={handleSelectDatabase} 
          disabled={!selectedDatabase}
          className="notion-button primary"
        >
          Connect database
        </button>
        <button onClick={handleRefresh} className="notion-button secondary">
          Refresh
        </button>
        <button onClick={onCancel} className="notion-button">
          Cancel
        </button>
      </div>

      <div className="notion-help">
        <div className="notion-help-title">💡 Required database properties:</div>
        <div className="notion-help-list">
          <div className="notion-help-item"><strong>Name</strong> (Title)</div>
          <div className="notion-help-item"><strong>Due</strong> (Date)</div>
          <div className="notion-help-item"><strong>Course</strong> (Text/Select)</div>
          <div className="notion-help-item"><strong>Type</strong> (Select)</div>
          <div className="notion-help-item"><strong>Grade</strong> (Number)</div>
          <div className="notion-help-item"><strong>Completed</strong> (Checkbox)</div>
        </div>
      </div>
    </div>
  );
}
