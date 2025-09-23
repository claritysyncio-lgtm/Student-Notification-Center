
import React, { useState, useEffect } from "react";
import NotificationCenter from "./components/NotificationCenter";
import NotionConnect from "./components/NotionConnect";
import { defaultConfig } from "./config/widgetConfig";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has connected a Notion database
    const databaseId = localStorage.getItem('notionDatabaseId');
    if (databaseId) {
      setIsConnected(true);
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
