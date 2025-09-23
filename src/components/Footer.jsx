import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '40px',
      padding: '20px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '10px',
        flexWrap: 'wrap'
      }}>
        <a 
          href="/legal.html#privacy" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = '#e5e7eb';
          }}
        >
          🔒 Privacy Policy
        </a>
        
        <a 
          href="/legal.html#terms" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = '#e5e7eb';
          }}
        >
          📋 Terms of Service
        </a>
        
        <a 
          href="/legal.html#permissions" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = '#e5e7eb';
          }}
        >
          🔐 Integration Permissions
        </a>
        
        <a 
          href="/legal.html" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = '#e5e7eb';
          }}
        >
          📄 All Legal Documents
        </a>
        
        <a 
          href="https://claritysync.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            border: '1px solid #3b82f6',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.borderColor = '#2563eb';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.borderColor = '#3b82f6';
          }}
        >
          🌐 Visit Our Website
        </a>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <p style={{ margin: '0', fontSize: '12px' }}>
          © 2024 ClaritySync Notification Center. All rights reserved.
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
          <a 
            href="https://notification-center-for-customers.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#6b7280', textDecoration: 'none' }}
          >
            notification-center-for-customers.vercel.app
          </a>
        </p>
      </div>
    </footer>
  );
}
