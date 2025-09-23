// Notion OAuth initiation endpoint
// This endpoint starts the OAuth flow by redirecting users to Notion

export default async function handler(req, res) {
  console.log('🚀 OAuth start requested:', req.method, req.url);
  
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.NOTION_CLIENT_ID;
    
    if (!clientId) {
      console.error('NOTION_CLIENT_ID environment variable not set');
      return res.status(500).json({ 
        error: 'OAuth not configured',
        details: 'NOTION_CLIENT_ID environment variable is not set'
      });
    }

    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store state in a cookie for validation (in production, use a secure session store)
    res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);

    // Build the OAuth authorization URL
    const authUrl = new URL('https://api.notion.com/v1/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', 'https://notification-center-for-customers.vercel.app/auth/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('owner', 'user');
    authUrl.searchParams.set('state', state);

    console.log('🔄 Redirecting to Notion OAuth:', authUrl.toString());

    // Redirect user to Notion OAuth
    return res.redirect(authUrl.toString());

  } catch (error) {
    console.error('OAuth start error:', error);
    return res.status(500).json({ 
      error: 'OAuth initiation failed', 
      details: error.message 
    });
  }
}
