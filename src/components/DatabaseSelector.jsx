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

  const handleSelectDatabase = () => {
    if (selectedDatabase) {
      localStorage.setItem('notionDatabaseId', selectedDatabase);
      onDatabaseSelected(selectedDatabase);
    }
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
      
      <div className="database-list">
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
