
import React, { useState, useEffect, useCallback } from "react";
import NotificationCenter from "./components/NotificationCenter";
import NotionConnect from "./components/NotionConnect";
import DatabaseSelector from "./components/DatabaseSelector";
import { defaultConfig } from "./config/widgetConfig";

// Constants for localStorage keys - centralized for easier maintenance
const STORAGE_KEYS = {
  NOTION_ACCESS_TOKEN: 'notionAccessToken',
  NOTION_WORKSPACE: 'notionWorkspace',
  NOTION_DATABASE_ID: 'notionDatabaseId'
};

// URL parameter keys for OAuth callback
const URL_PARAMS = {
  TOKEN: 'token',
  WORKSPACE: 'workspace',
  ERROR: 'error'
};

/**
 * Main App Component
 * 
 * This is the root component that handles:
 * - OAuth callback processing from Notion
 * - Connection state management
 * - Conditional rendering of notification center vs connection flow
 * 
 * The component uses a state machine pattern to manage the different
 * application states (loading, connected, disconnected).
 */
export default function App() {
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isLoading: true,
    error: null,
    needsDatabaseSelection: false
  });

  /**
   * Initialize connection state on component mount
   * 
   * This function handles the OAuth callback flow and checks for
   * existing authentication tokens in localStorage.
   */
  const initializeConnection = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get(URL_PARAMS.TOKEN);
      const workspace = urlParams.get(URL_PARAMS.WORKSPACE);
      const error = urlParams.get(URL_PARAMS.ERROR);

      if (error) {
        console.error('OAuth authentication failed:', error);
        setConnectionState(prev => ({
          ...prev,
          error: `Authentication failed: ${error}`,
          isLoading: false
        }));
        clearUrlParams();
        return;
      }

      if (token) {
        handleSuccessfulAuth(token, workspace);
      } else {
        checkExistingConnection();
      }
    } catch (error) {
      console.error('Error during connection initialization:', error);
      setConnectionState(prev => ({
        ...prev,
        error: 'Failed to initialize connection',
        isLoading: false
      }));
    }
  }, []);

  /**
   * Handle successful OAuth authentication
   * 
   * Stores the authentication tokens securely and updates the connection state.
   * Also clears the URL parameters to prevent re-processing on refresh.
   */
  const handleSuccessfulAuth = useCallback((token, workspace) => {
    try {
      // Store authentication data
      localStorage.setItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN, token);
      
      if (workspace) {
        localStorage.setItem(STORAGE_KEYS.NOTION_WORKSPACE, workspace);
      }

      setConnectionState({
        isConnected: true,
        isLoading: false,
        error: null
      });

      clearUrlParams();
    } catch (error) {
      console.error('Error storing authentication data:', error);
      setConnectionState(prev => ({
        ...prev,
        error: 'Failed to save authentication data',
        isLoading: false
      }));
    }
  }, []);

  /**
   * Check for existing connection tokens in localStorage
   * 
   * This allows users to remain connected across browser sessions
   * without having to re-authenticate every time.
   */
  const checkExistingConnection = useCallback(() => {
    try {
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      
      if (accessToken && !databaseId) {
        // User has access token but no database selected
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          needsDatabaseSelection: true
        });
      } else if (databaseId && accessToken) {
        // User is fully connected
        setConnectionState({
          isConnected: true,
          isLoading: false,
          error: null,
          needsDatabaseSelection: false
        });
      } else {
        // User needs to connect to Notion
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          needsDatabaseSelection: false
        });
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
      setConnectionState({
        isConnected: false,
        isLoading: false,
        error: 'Failed to check existing connection',
        needsDatabaseSelection: false
      });
    }
  }, []);

  /**
   * Remove OAuth parameters from URL without page reload
   * 
   * This provides a clean URL after successful authentication
   * and prevents re-processing of OAuth parameters on refresh.
   */
  const clearUrlParams = useCallback(() => {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.warn('Failed to clear URL parameters:', error);
    }
  }, []);

  /**
   * Handle database selection completion
   */
  const handleDatabaseSelected = useCallback((databaseId) => {
    console.log('Database selected:', databaseId);
    setConnectionState({
      isConnected: true,
      isLoading: false,
      error: null,
      needsDatabaseSelection: false
    });
  }, []);

  /**
   * Handle database selection cancellation
   */
  const handleDatabaseSelectionCancel = useCallback(() => {
    // Clear the access token and go back to connection screen
    localStorage.removeItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.NOTION_WORKSPACE);
    setConnectionState({
      isConnected: false,
      isLoading: false,
      error: null,
      needsDatabaseSelection: false
    });
  }, []);

  // Initialize connection on component mount
  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  // Loading state
  if (connectionState.isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <div className="loading-text">Initializing...</div>
      </div>
    );
  }

  // Error state
  if (connectionState.error) {
    return (
      <div className="app-error">
        <div className="error-content">
          <h2>Connection Error</h2>
          <p>{connectionState.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main application render
  return (
    <div className="app">
      {connectionState.isConnected && <NotificationCenter config={defaultConfig} />}
      {connectionState.needsDatabaseSelection && (
        <DatabaseSelector 
          onDatabaseSelected={handleDatabaseSelected}
          onCancel={handleDatabaseSelectionCancel}
        />
      )}
      {!connectionState.isConnected && !connectionState.needsDatabaseSelection && <NotionConnect />}
    </div>
  );
}
