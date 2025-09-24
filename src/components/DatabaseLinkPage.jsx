import React, { useState } from 'react';

/**
 * DatabaseLinkPage Component
 * 
 * A dedicated page for customers to paste their Notion database link
 * and have the database ID automatically extracted and configured.
 * This page appears right before the database ID page to individualize
 * the experience for each customer.
 */
export default function DatabaseLinkPage({ onDatabaseIdExtracted, onCancel, isFirstStep = false }) {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [extractedId, setExtractedId] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Extract database ID from Notion URL
   * Handles various Notion URL formats
   */
  const extractDatabaseId = (url) => {
    try {
      // Handle different Notion URL formats
      const patterns = [
        // Standard Notion URLs: https://notion.so/workspace/database-id?v=...
        /notion\.so\/[^\/]+\/([a-f0-9]{32})/i,
        // Direct database URLs: https://notion.site/database-id
        /notion\.site\/([a-f0-9]{32})/i,
        // Simple format: https://notion.so/database-id
        /notion\.so\/([a-f0-9]{32})/i,
        // URLs with query parameters
        /notion\.so\/[^\/]+\/([a-f0-9]{32})\?/i,
        // URLs with fragments
        /notion\.so\/[^\/]+\/([a-f0-9]{32})#/i
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }
      
      // Fallback: try to extract any 32-character hex string
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

  /**
   * Handle URL input and automatic ID extraction
   */
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setDatabaseUrl(url);
    setError('');
    
    // Auto-extract ID as user types
    if (url.trim()) {
      const id = extractDatabaseId(url);
      if (id) {
        setExtractedId(id);
      } else {
        setExtractedId('');
      }
    } else {
      setExtractedId('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (!databaseUrl.trim()) {
      setError('Please enter a database URL');
      setIsProcessing(false);
      return;
    }

    const databaseId = extractDatabaseId(databaseUrl);
    
    if (!databaseId) {
      setError('Invalid Notion database URL. Please check the format and try again.');
      setIsProcessing(false);
      return;
    }

    // Store the database ID and proceed
    try {
      console.log('💾 Storing database ID:', databaseId);
      localStorage.setItem('notionDatabaseId', databaseId);
      console.log('✅ Database ID stored successfully');
      console.log('🔍 Verification - stored ID:', localStorage.getItem('notionDatabaseId'));
      
      // Call the callback with the database ID
      onDatabaseIdExtracted(databaseId);
    } catch (error) {
      console.error('Error storing database ID:', error);
      setError('Failed to save database ID. Please try again.');
      setIsProcessing(false);
    }
  };

  /**
   * Handle paste event for better UX
   */
  const handlePaste = (e) => {
    // Small delay to allow paste to complete
    setTimeout(() => {
      const url = e.target.value;
      if (url) {
        const id = extractDatabaseId(url);
        if (id) {
          setExtractedId(id);
        }
      }
    }, 10);
  };

  return (
    <div className="notion-database-setup">
      <div className="notion-setup-header">
        <div className="notion-setup-icon">
          <img 
            src="/notion_logo_icon.png" 
            alt="Notion" 
            width="48" 
            height="48"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="notion-setup-title">
          {isFirstStep ? 'Connect your database' : 'Database setup'}
        </div>
        <div className="notion-setup-description">
          {isFirstStep 
            ? 'Paste your Notion database link to get started with your personalized notification center.'
            : 'Paste your Notion database link below and we\'ll automatically extract the database ID for you'
          }
        </div>
      </div>

      <form onSubmit={handleSubmit} className="notion-setup-content">
        <div className="notion-input-section">
          <div className="notion-input-label">Database URL</div>
          <div className="notion-input-container">
            <input
              id="database-url"
              type="url"
              value={databaseUrl}
              onChange={handleUrlChange}
              onPaste={handlePaste}
              placeholder="https://notion.so/your-workspace/database-id..."
              className="notion-url-input"
              disabled={isProcessing}
              autoFocus
            />
            <div className="notion-input-hint">
              Click the 3 dots (...) next to your database title in Notion, then select "Copy link to view"
            </div>
          </div>
        </div>

        {extractedId && (
          <div className="notion-extracted-id">
            <div className="notion-extracted-label">Database ID extracted</div>
            <div className="notion-extracted-content">
              <div className="notion-extracted-text">{extractedId}</div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(extractedId)}
                className="notion-copy-button"
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="notion-error-message">
            <div className="notion-error-icon">⚠️</div>
            <div className="notion-error-text">{error}</div>
          </div>
        )}

        <div className="notion-setup-actions">
          <button
            type="button"
            onClick={onCancel}
            className="notion-button secondary"
            disabled={isProcessing}
          >
            {isFirstStep ? 'Back' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={!extractedId || isProcessing}
            className="notion-button primary"
          >
            {isProcessing ? 'Processing...' : (isFirstStep ? 'Continue to Notion' : 'Connect Database')}
          </button>
        </div>
      </form>

            <div className="notion-help-section">
              <div className="notion-help-title">How to get your database link</div>
              <div className="notion-help-steps">
                <div className="notion-help-step">
                  <div className="notion-step-number">1</div>
                  <div className="notion-step-text">Click the 3 dots (...) next to the "Assessments" database title</div>
                </div>
                <div className="notion-help-step">
                  <div className="notion-step-number">2</div>
                  <div className="notion-step-text">Select "Copy link to view"</div>
                </div>
                <div className="notion-help-step">
                  <div className="notion-step-number">3</div>
                  <div className="notion-step-text">Paste the link in the field above</div>
                </div>
              </div>
            </div>

            <div className="notion-important-section">
              <div className="notion-important-title">⚠️ Important: Database Access</div>
              <div className="notion-important-content">
                <p>After connecting to Notion, you may need to share your database with the integration:</p>
                <ol>
                  <li>Go to your database in Notion</li>
                  <li>Click the <strong>"Share"</strong> button (top right)</li>
                  <li>Click <strong>"Add people, emails, groups, or integrations"</strong></li>
                  <li>Search for <strong>"Student Notification Center"</strong></li>
                  <li>Add the integration to give it access</li>
                </ol>
                <p><em>This is a one-time setup step required by Notion for security.</em></p>
              </div>
            </div>

      <div className="notion-requirements-section">
        <div className="notion-requirements-title">Required database properties</div>
        <div className="notion-requirements-grid">
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Name</div>
            <div className="notion-requirement-type">Title</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Due</div>
            <div className="notion-requirement-type">Date</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Course</div>
            <div className="notion-requirement-type">Text/Select</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Type</div>
            <div className="notion-requirement-type">Select</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Grade</div>
            <div className="notion-requirement-type">Number</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Completed</div>
            <div className="notion-requirement-type">Checkbox</div>
          </div>
          <div className="notion-requirement-item">
            <div className="notion-requirement-name">Countdown</div>
            <div className="notion-requirement-type">Formula</div>
          </div>
        </div>
      </div>
    </div>
  );
}
