import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get the authorization code from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      setStatus('Exchanging code for access token...');

      // Exchange code for access token
      const response = await fetch('/api/notion/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to exchange code for token');
      }

      const data = await response.json();
      
      // Save token and user info to localStorage
      localStorage.setItem('notion_access_token', data.access_token);
      localStorage.setItem('notion_workspace_id', data.workspace_id);
      localStorage.setItem('notion_workspace_name', data.workspace_name);
      
      setStatus('Success! Redirecting...');
      
      // Redirect to main app after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err.message);
      setStatus('Error occurred');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {error ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Authentication Failed</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Go Back to Setup
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
            <h2 style={{ color: '#374151', marginBottom: '16px' }}>Connecting to Notion</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{status}</p>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
