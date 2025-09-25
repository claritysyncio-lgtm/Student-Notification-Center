import React, { useState, useEffect, useCallback } from "react";
import NotificationCenter from "./NotificationCenter";
import ConnectToNotionScreen from "./ConnectToNotionScreen";
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
  
  // Force embed to start in "not connected" state
  console.log('🚀 EmbedApp initialized - starting in not connected state');
  
  // Check for localStorage data on mount
  useEffect(() => {
    console.log('🧹 Embed mode - checking for localStorage data');
    
    // Check if we have localStorage data
    const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
    const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
    
    console.log('🔍 Embed localStorage check:', {
      databaseId: databaseId ? 'Found' : 'Not found',
      accessToken: accessToken ? 'Found' : 'Not found',
      allKeys: Object.keys(localStorage)
    });
    
    if (databaseId && accessToken) {
      console.log('✅ Embed mode - found localStorage data, validating connection');
      // We have data, validate it
      setTimeout(() => {
        checkConnection();
      }, 100);
    } else {
      console.log('❌ Embed mode - no localStorage data found, showing connect screen');
      // No data, show connect screen immediately
      setHasValidConnection(false);
      setError('No connection data found in embed context');
      setIsReady(true);
    }
  }, [checkConnection]);

  /**
   * Check if user has valid connection data by testing the API
   */
  const checkConnection = useCallback(async () => {
    try {
      // Clear any existing state first
      setHasValidConnection(false);
      setError(null);
      
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      const workspace = localStorage.getItem(STORAGE_KEYS.NOTION_WORKSPACE);
      
      console.log('🔍 Embed mode - checking connection:', {
        databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT_FOUND',
        accessToken: accessToken ? `${accessToken.substring(0, 8)}...` : 'NOT_FOUND',
        workspace: workspace ? `${workspace.substring(0, 8)}...` : 'NOT_FOUND',
        allLocalStorageKeys: Object.keys(localStorage),
        currentUrl: window.location.href,
        referrer: document.referrer
      });
      
      if (!databaseId || !accessToken) {
        console.log('❌ Embed mode - missing connection data, showing not connected state');
        setHasValidConnection(false);
        setError('Not connected to Notion. Please set up your connection first.');
        setIsReady(true);
        return;
      }

      // Test the connection by trying to fetch tasks
      console.log('🧪 Embed mode - testing connection by fetching tasks...');
      try {
        const tasks = await getTasks();
        console.log('📊 Embed mode - received tasks:', {
          taskCount: tasks.length,
          tasks: tasks,
          isFallbackData: tasks.length === 1 && tasks[0].id === "no-data",
          firstTask: tasks[0] || 'no tasks'
        });
        
        // Check if we got fallback data (which means connection failed)
        if (tasks.length === 1 && tasks[0].id === "no-data") {
          console.log('❌ Embed mode - got fallback data, connection invalid');
          setHasValidConnection(false);
          setError('Not connected to Notion. Please set up your connection first.');
        } else if (tasks.length === 0) {
          console.log('❌ Embed mode - no tasks found, but connection might be valid');
          setHasValidConnection(false);
          setError('No tasks found in your Notion database. Please check your database or set up your connection.');
        } else {
          // Check if we have any tasks (not just fallback data)
          const hasRealTasks = tasks.some(task => 
            task.id && 
            task.id !== "no-data" && 
            task.name && 
            task.name !== "No tasks found"
          );
          
          if (hasRealTasks) {
            console.log('✅ Embed mode - got real tasks, connection is valid');
            setHasValidConnection(true);
          } else {
            console.log('❌ Embed mode - no real tasks found, connection invalid');
            setHasValidConnection(false);
            setError('No tasks found in your Notion database. Please check your database or set up your connection.');
          }
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
        // If the key was removed (set to null), immediately show not connected
        if (e.newValue === null) {
          console.log('🗑️ Embed mode - connection data removed, showing not connected state');
          setHasValidConnection(false);
          setError('Connection has been reset. Please set up your connection again.');
          setIsReady(true);
        } else {
          checkConnection();
        }
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (from same window)
    const handleCustomStorageChange = () => {
      console.log('🔄 Embed mode - custom storage event, re-checking connection...');
      // Check if localStorage was cleared
      const databaseId = localStorage.getItem(STORAGE_KEYS.NOTION_DATABASE_ID);
      const accessToken = localStorage.getItem(STORAGE_KEYS.NOTION_ACCESS_TOKEN);
      
      if (!databaseId || !accessToken) {
        console.log('🗑️ Embed mode - connection data cleared, showing not connected state');
        setHasValidConnection(false);
        setError('Connection has been reset. Please set up your connection again.');
        setIsReady(true);
      } else {
        checkConnection();
      }
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
    // Show connect screen instead of error message
    return <ConnectToNotionScreen />;
  }

  return (
    <div className="embed-app">
      <NotificationCenter config={defaultConfig} />
      
      {/* Debug panel for troubleshooting */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <div><strong>Embed Debug Info:</strong></div>
          <div>Ready: {isReady ? 'Yes' : 'No'}</div>
          <div>Valid Connection: {hasValidConnection ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          <div>URL: {window.location.href}</div>
          <div>Referrer: {document.referrer || 'None'}</div>
        </div>
      )}
    </div>
  );
}
