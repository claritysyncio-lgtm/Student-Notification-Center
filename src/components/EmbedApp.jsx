import React, { useState, useEffect, useCallback } from "react";
import NotificationCenter from "./NotificationCenter";
import { defaultConfig } from "../config/widgetConfig";

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
   * Check if user has valid connection data
   */
  const checkConnection = useCallback(() => {
    try {
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      
      console.log('🔍 Embed mode - checking connection:', {
        databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT_FOUND',
        accessToken: accessToken ? `${accessToken.substring(0, 8)}...` : 'NOT_FOUND'
      });
      
      if (databaseId && accessToken) {
        console.log('✅ Embed mode - valid connection found');
        setHasValidConnection(true);
      } else {
        console.log('❌ Embed mode - no valid connection found');
        setHasValidConnection(false);
        setError('Not connected to Notion. Please set up your connection first.');
      }
    } catch (error) {
      console.error('Error checking connection in embed mode:', error);
      setError('Failed to check connection status');
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    checkConnection();
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
