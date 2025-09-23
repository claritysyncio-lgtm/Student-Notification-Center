import React, { useEffect, useState } from 'react';
import NotificationCenter from '../components/NotificationCenter';
import { defaultConfig } from '../config/widgetConfig';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const workspace = urlParams.get('workspace');
    const botId = urlParams.get('bot_id');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      alert(`OAuth Error: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
    } else if (token) {
      // Store the access token and workspace info
      localStorage.setItem('notionAccessToken', token);
      if (workspace) {
        localStorage.setItem('notionWorkspace', workspace);
      }
      if (botId) {
        localStorage.setItem('notionBotId', botId);
      }
      console.log('Successfully connected to Notion!');
      // Clean up URL
      window.history.replaceState({}, document.title, '/dashboard');
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
        <div style={{ fontSize: '16px', color: '#787774' }}>Setting up your notification center...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationCenter config={defaultConfig} />
    </div>
  );
}
