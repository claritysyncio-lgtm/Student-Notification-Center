
import React, { useState, useEffect } from "react";
import NotificationCenter from "./components/NotificationCenter";
import NotionConnect from "./components/NotionConnect";
import { defaultConfig } from "./config/widgetConfig";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const workspace = urlParams.get('workspace');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token) {
      // Store the access token and mark as connected
      localStorage.setItem('notionAccessToken', token);
      if (workspace) {
        localStorage.setItem('notionWorkspace', workspace);
      }
      setIsConnected(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if user has connected a Notion database (legacy)
      const databaseId = localStorage.getItem('notionDatabaseId');
      const accessToken = localStorage.getItem('notionAccessToken');
      if (databaseId || accessToken) {
        setIsConnected(true);
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#ffffff'
      }}>
        <div style={{ fontSize: '16px', color: '#787774' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationCenter config={defaultConfig} />
      {!isConnected && <NotionConnect />}
    </div>
  );
}
