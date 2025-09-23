import React, { useEffect, useState, useCallback } from 'react';
import NotificationCenter from '../components/NotificationCenter';
import { defaultConfig } from '../config/widgetConfig';

/**
 * Dashboard Page Component
 * 
 * Handles OAuth callback processing and displays the main notification center.
 * Manages authentication state and provides user feedback during setup.
 */
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Process OAuth callback parameters from URL
   */
  const processOAuthCallback = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const workspace = urlParams.get('workspace');
      const botId = urlParams.get('bot_id');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth authentication failed:', error);
        setAuthError(`Authentication failed: ${error}`);
        clearUrlParams();
        return;
      }

      if (token) {
        handleSuccessfulAuth(token, workspace, botId);
      }
    } catch (error) {
      console.error('Error processing OAuth callback:', error);
      setAuthError('Failed to process authentication callback');
    }
  }, []);

  /**
   * Handle successful OAuth authentication
   */
  const handleSuccessfulAuth = useCallback((token, workspace, botId) => {
    try {
      // Store authentication data securely
      localStorage.setItem('notionAccessToken', token);
      
      if (workspace) {
        localStorage.setItem('notionWorkspace', workspace);
      }
      
      if (botId) {
        localStorage.setItem('notionBotId', botId);
      }
      
      console.log('Successfully authenticated with Notion');
      clearUrlParams();
    } catch (error) {
      console.error('Error storing authentication data:', error);
      setAuthError('Failed to save authentication data');
    }
  }, []);

  /**
   * Remove OAuth parameters from URL
   */
  const clearUrlParams = useCallback(() => {
    try {
      window.history.replaceState({}, document.title, '/dashboard');
    } catch (error) {
      console.warn('Failed to clear URL parameters:', error);
    }
  }, []);

  useEffect(() => {
    processOAuthCallback();
    setIsLoading(false);
  }, [processOAuthCallback]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#ffffff'
      }}>
        <div style={{ fontSize: '16px', color: '#787774' }}>
          Setting up your notification center...
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#ffffff',
        padding: '20px'
      }}>
        <div style={{ 
          fontSize: '18px', 
          color: '#dc2626',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Authentication Error
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {authError}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationCenter config={defaultConfig} />
    </div>
  );
}
