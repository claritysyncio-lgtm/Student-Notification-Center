import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const workspace = searchParams.get('workspace');
    const error = searchParams.get('message');

    if (error) {
      setStatus('error');
      setMessage(decodeURIComponent(error));
      return;
    }

    if (token) {
      setStatus('success');
      setMessage(`Successfully connected to ${decodeURIComponent(workspace || 'Notion')}`);
      
      // Store the token securely
      localStorage.setItem('notionAccessToken', token);
      
      // Redirect to setup page after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setStatus('error');
      setMessage('No access token received from Notion');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="auth-callback">
        <div className="auth-loading">
          <div className="loading-spinner"></div>
          <h2>Connecting to Notion...</h2>
          <p>Please wait while we set up your connection.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="auth-callback">
        <div className="auth-error">
          <div className="error-icon">❌</div>
          <h2>Connection Failed</h2>
          <p>{message}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/'}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback">
      <div className="auth-success">
        <div className="success-icon">✅</div>
        <h2>Successfully Connected!</h2>
        <p>{message}</p>
        <p>Redirecting to setup page...</p>
      </div>
    </div>
  );
}
