// OAuth Configuration - Update these URLs when deploying to a new Vercel domain
export const OAUTH_CONFIG = {
  // Update this to your new Vercel domain after deployment
  BASE_URL: 'https://student-notification-center.vercel.app',
  
  // These will be automatically generated from BASE_URL
  get OAUTH_REDIRECT_URI() {
    return `${this.BASE_URL}/api/auth/callback/notion`;
  },
  
  get OAUTH_AUTHORIZE_URL() {
    return `https://api.notion.com/v1/oauth/authorize?client_id=277d872b-594c-8009-a497-003712a5baf8&response_type=code&owner=user&redirect_uri=${encodeURIComponent(this.OAUTH_REDIRECT_URI)}`;
  }
};
