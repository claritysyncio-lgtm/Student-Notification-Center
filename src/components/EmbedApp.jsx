import React, { useState, useEffect, useCallback } from "react";
import NotificationCenter from "./NotificationCenter";
import { defaultConfig } from "../config/widgetConfig";
import { getTasks } from "../api/notionApi";

// Constants for localStorage keys
const STORAGE_KEYS = {
  NOTION_ACCESS_TOKEN: 'notionAccessToken',
  NOTION_WORKSPACE: 'notionWorkspace',
  NOTION_DATABASE_ID: 'notionDatabaseId'
};

/**
 * EmbedApp Component
 * 
 * Special app component for embedded contexts (like Notion).
 * This component bypasses the setup flow and goes directly to the notification center
 * if the user has valid credentials stored.
 */
export default function EmbedApp() {
  const [isReady, setIsReady] = useState(false);
  const [hasValidConnection, setHasValidConnection] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if user has valid connection data by testing the API
   */
  const checkConnection = useCallback(async () => {
    try {
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      
      console.log('🔍 Embed mode - checking connection:', {
        databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT_FOUND',
        accessToken: accessToken ? `${accessToken.substring(0, 8)}...` : 'NOT_FOUND'
      });
      
      if (!databaseId || !accessToken) {
        console.log('❌ Embed mode - missing connection data');
        setHasValidConnection(false);
        setError('Not connected to Notion. Please set up your connection first.');
        setIsReady(true);
        return;
      }

      // Test the connection by trying to fetch tasks
      console.log('🧪 Embed mode - testing connection by fetching tasks...');
      try {
        const tasks = await getTasks();
        
        // Check if we got fallback data (which means connection failed)
        if (tasks.length === 1 && tasks[0].id === "no-data") {
          console.log('❌ Embed mode - got fallback data, connection invalid');
          setHasValidConnection(false);
          setError('Connection expired or invalid. Please reconnect to Notion.');
        } else {
          console.log('✅ Embed mode - got real data, connection is valid');
          setHasValidConnection(true);
        }
      } catch (testError) {
        console.log('❌ Embed mode - connection test error:', testError);
        setHasValidConnection(false);
        setError('Connection test failed. Please reconnect to Notion.');
      }
    } catch (error) {
      console.error('Error checking connection in embed mode:', error);
      setError('Failed to check connection status');
      setHasValidConnection(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Listen for localStorage changes (like when reset button is clicked)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.NOTION_DATABASE_ID || 
          e.key === STORAGE_KEYS.NOTION_ACCESS_TOKEN) {
        console.log('🔄 Embed mode - localStorage changed, re-checking connection...');
        checkConnection();
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (from same window)
    const handleCustomStorageChange = () => {
      console.log('🔄 Embed mode - custom storage event, re-checking connection...');
      checkConnection();
    };
    
    window.addEventListener('localStorageChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChanged', handleCustomStorageChange);
    };
  }, [checkConnection]);

  if (!isReady) {
    return (
      <div className="embed-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading notification center...</div>
      </div>
    );
  }

  if (!hasValidConnection) {
    return (
      <div className="embed-error">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3>Not Connected</h3>
          <p>
            This notification center is not connected to your Notion database. 
            Please visit the main app to set up your connection.
          </p>
        <a 
          href="/" 
          target="_parent"
          rel="noopener noreferrer"
          className="setup-link"
        >
          Set up connection →
        </a>
        </div>
      </div>
    );
  }

  return (
    <div className="embed-app">
      <NotificationCenter config={defaultConfig} />
    </div>
  );
}
