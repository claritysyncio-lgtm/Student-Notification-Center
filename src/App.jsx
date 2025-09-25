
import React, { useState, useEffect, useCallback } from "react";
import NotificationCenter from "./components/NotificationCenter";
import MakeItYours from "./components/MakeItYours";
import SimpleDatabaseSetup from "./components/SimpleDatabaseSetup";
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
    showDatabaseSetup: false
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
  const handleSuccessfulAuth = useCallback(async (token, workspace) => {
    try {
      console.log('🔐 OAuth successful, creating session...');
      
      // Create server session for embed compatibility
      try {
        const sessionResponse = await fetch('/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            accessToken: token,
            workspaceId: workspace?.id,
            workspaceName: workspace?.name
          })
        });
        
        if (sessionResponse.ok) {
          console.log('✅ Session created successfully');
        } else {
          console.warn('⚠️ Session creation failed, falling back to localStorage');
        }
      } catch (error) {
        console.warn('⚠️ Session creation error, falling back to localStorage:', error);
      }
      
      // Also store in localStorage for backward compatibility
      localStorage.setItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN, token);
      
      if (workspace) {
        localStorage.setItem(STORAGE_KEYS.NOTION_WORKSPACE, workspace);
      }

      // Check if user already has a database ID
      const existingDatabaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      console.log('🔍 Existing database ID:', existingDatabaseId);
      
      if (existingDatabaseId) {
        console.log('✅ User has existing database ID, going to notification center');
        // User already has a database ID, go directly to notification center
        setConnectionState({
          isConnected: true,
          isLoading: false,
          error: null,
          showDatabaseSetup: false
        });
      } else {
        console.log('🔗 No database ID found, showing database setup');
        // User needs to set up their database
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          showDatabaseSetup: true
        });
      }

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
      // Check for reset parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const shouldReset = urlParams.get('reset') === 'true';
      
      console.log('🔍 Reset Debug:', {
        url: window.location.href,
        search: window.location.search,
        shouldReset,
        urlParams: Object.fromEntries(urlParams.entries())
      });
      
      if (shouldReset) {
        console.log('🔄 RESET TRIGGERED - Clearing localStorage');
        // Clear all stored data and start fresh
        localStorage.removeItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.NOTION_WORKSPACE);
        localStorage.removeItem(STORAGE_KEYS.NOTION_DATABASE_ID);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        console.log('✅ Reset complete - showing fresh setup');
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          needsDatabaseSelection: false,
          showDatabaseLinkPage: false
        });
        
        // Force a small delay to ensure state is set before continuing
        setTimeout(() => {
          console.log('🔄 Forcing page refresh to ensure clean state');
          window.location.reload();
        }, 100);
        return;
      }
      
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      
      console.log('🔍 localStorage Debug:', {
        databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT FOUND',
        accessToken: accessToken ? `${accessToken.substring(0, 8)}...` : 'NOT FOUND',
        hasBoth: !!(databaseId && accessToken)
      });
      
      if (databaseId && accessToken) {
        // User is fully connected
        setConnectionState({
          isConnected: true,
          isLoading: false,
          error: null,
          showDatabaseSetup: false
        });
      } else if (accessToken && !databaseId) {
        // User has access token but no database selected - show database setup
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          showDatabaseSetup: true
        });
      } else {
        // User needs to connect to Notion
        setConnectionState({
          isConnected: false,
          isLoading: false,
          error: null,
          showDatabaseSetup: false
        });
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
      setConnectionState({
        isConnected: false,
        isLoading: false,
        error: 'Failed to check existing connection',
        needsDatabaseSelection: false,
        showDatabaseLinkPage: false,
        showDatabaseSetupFirst: true
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
   * Handle database connection completion
   */
  const handleDatabaseConnected = useCallback(() => {
    console.log('✅ Database connected, going to notification center');
    setConnectionState({
      isConnected: true,
      isLoading: false,
      error: null,
      showDatabaseSetup: false
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
      {connectionState.showDatabaseSetup && (
        <SimpleDatabaseSetup 
          onDatabaseConnected={handleDatabaseConnected}
        />
      )}
      {!connectionState.isConnected && !connectionState.showDatabaseSetup && <MakeItYours />}
      
      {/* Force cache refresh - remove this comment */}
      <div style={{display: 'none'}}>v3.0-simplified</div>
    </div>
  );
}
