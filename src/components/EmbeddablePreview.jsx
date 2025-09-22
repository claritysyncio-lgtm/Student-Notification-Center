import React from 'react';

export default function EmbeddablePreview() {
  const handleConnect = () => {
    // Open the main app in a new tab/window
    window.open('/', '_blank');
  };

  return (
    <div className="embeddable-preview">
      <div className="preview-container">
        <div className="preview-header">
          <h3>📋 Your Personal Task Center</h3>
          <p>Connect to Notion to unlock this beautiful task management widget!</p>
        </div>
        
        <div className="notification-preview">
          <div className="preview-overlay">
            <div className="preview-content">
              <div className="preview-title">My Task Center</div>
              <div className="preview-filters">
                <div className="preview-filter">All Courses</div>
                <div className="preview-filter">All Types</div>
              </div>
              <div className="preview-sections">
                <div className="preview-section">
                  <div className="preview-section-title">📅 Due Today (3)</div>
                  <div className="preview-task">Complete project proposal</div>
                  <div className="preview-task">Review team feedback</div>
                </div>
                <div className="preview-section">
                  <div className="preview-section-title">⏰ Overdue (1)</div>
                  <div className="preview-task">Submit final report</div>
                </div>
                <div className="preview-section">
                  <div className="preview-section-title">📆 Due Tomorrow (2)</div>
                  <div className="preview-task">Team meeting prep</div>
                  <div className="preview-task">Update project timeline</div>
                </div>
              </div>
            </div>
            <div className="blur-overlay"></div>
            <div className="connect-overlay">
              <div className="connect-content">
                <div className="connect-icon">🔗</div>
                <h4>Connect to Notion</h4>
                <p>Unlock your personalized task center</p>
                <button 
                  className="connect-button"
                  onClick={handleConnect}
                >
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
