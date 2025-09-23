import React, { useState, useEffect } from 'react';

/**
 * DatabaseSelector Component
 * 
 * Allows users to select which Notion database to use for their tasks
 * after they've connected to Notion via OAuth.
 */
export default function DatabaseSelector({ onDatabaseSelected, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectAssessments = () => {
    // For now, we'll use a placeholder database ID
    // In a real implementation, this would be the actual Assessments database ID
    const assessmentsDatabaseId = 'assessments-database-id';
    localStorage.setItem('notionDatabaseId', assessmentsDatabaseId);
    onDatabaseSelected(assessmentsDatabaseId);
  };


  return (
    <div className="database-selector">
      <div className="selector-header">
        <h3>Select Your Task Database</h3>
        <p>Connect to your Assessments database:</p>
      </div>

      {/* Single Assessments Option */}
      <div className="database-list">
        <div className="database-item selected">
          <div className="database-info">
            <h4>📊 Assessments</h4>
            <p className="database-description">Your main assessments and tasks database</p>
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

      <div className="selector-actions">
        <button 
          onClick={handleSelectAssessments}
          className="select-btn"
        >
          ✅ Use Assessments Database
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
