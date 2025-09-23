import React, { useState } from 'react';

/**
 * IntegrationPage Component
 * 
 * A dedicated page for users to integrate their Notion database
 * by simply pasting their database URL.
 */
export default function IntegrationPage({ onDatabaseSelected, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectAssessments = async () => {
    setIsLoading(true);
    
    // Use the Assessments database ID
    const assessmentsDatabaseId = '270a5eba-e7ac-8150-843a-cf6e74c5f8fc';
    localStorage.setItem('notionDatabaseId', assessmentsDatabaseId);
    onDatabaseSelected(assessmentsDatabaseId);
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
            
            <button 
              onClick={handleConnectAssessments}
              disabled={isLoading}
              className="connect-button"
            >
              {isLoading ? '🔄 Connecting...' : '✅ Connect to Assessments'}
            </button>
          </div>
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
