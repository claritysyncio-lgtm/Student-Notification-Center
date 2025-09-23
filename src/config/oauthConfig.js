/**
 * OAuth Configuration for Notion Integration
 * 
 * This configuration handles the OAuth flow for connecting to Notion.
 * Update the BASE_URL when deploying to a new domain.
 */

// Notion OAuth client configuration
const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID || '277d872b-594c-8009-a497-003712a5baf8';

// Base URL for the application - update this when deploying
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://student-notification-center.vercel.app';

export const OAUTH_CONFIG = {
  /**
   * Base URL of the deployed application
   */
  BASE_URL,
  
  /**
   * Notion OAuth client ID
   */
  CLIENT_ID: NOTION_CLIENT_ID,
  
  /**
   * OAuth redirect URI for Notion callback
   */
  get OAUTH_REDIRECT_URI() {
    return `${this.BASE_URL}/oauthcallback.html`;
  },
  
  /**
   * Complete OAuth authorization URL for Notion
   */
  get OAUTH_AUTHORIZE_URL() {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      response_type: 'code',
      owner: 'user',
      redirect_uri: this.OAUTH_REDIRECT_URI
    });
    
    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }
};
