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
    // Use the actual Assessments database ID from your Notion workspace
    const assessmentsDatabaseId = '270a5eba-e7ac-8150-843a-cf6e74c5f8fc';
    localStorage.setItem('notionDatabaseId', assessmentsDatabaseId);
    onDatabaseSelected(assessmentsDatabaseId);
  };


  return (
    <div className="database-selector">
      <div className="selector-header">
        <h3>Select Your Task Database</h3>
        <p>Connect to your Assessments database:</p>
        <p style={{fontSize: '12px', color: '#666'}}>Version 2.0 - Simplified</p>
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
