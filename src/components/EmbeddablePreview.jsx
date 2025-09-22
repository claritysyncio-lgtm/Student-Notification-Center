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
        
        <div className="setup-prompt">
          <div className="setup-content">
            <div className="setup-icon">🚀</div>
            <h4>Ready to Get Started?</h4>
            <p>Set up your personalized task center in just 2 minutes!</p>
            <button 
              className="connect-button"
              onClick={handleConnect}
            >
              Set Up My Task Center →
            </button>
            <div className="setup-features">
              <div className="feature">✅ Auto-detects your Notion databases</div>
              <div className="feature">✅ Customizable colors and themes</div>
              <div className="feature">✅ Real-time task synchronization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
