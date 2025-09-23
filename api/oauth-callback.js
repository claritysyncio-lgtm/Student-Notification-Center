// Notion OAuth callback handler
// This endpoint receives the authorization code from Notion and exchanges it for an access token

export default async function handler(req, res) {
  console.log('🔐 OAuth callback received:', req.method, req.url);
  
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
    const { code, error, state } = req.query;

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect(`/?error=${encodeURIComponent(error)}&error_description=OAuth authentication failed`);
    }

    // Check for authorization code
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`/?error=missing_code&error_description=No authorization code received from Notion`);
    }

    console.log('🔄 Exchanging authorization code for access token...');

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://notification-center-for-customers.vercel.app/api/oauth-callback'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return res.redirect(`/?error=token_exchange_failed&error_description=${encodeURIComponent(errorData.error_description || 'Failed to exchange authorization code')}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Successfully obtained access token');

    // Store the token securely (in a real app, you'd store this in a database)
    // For now, we'll redirect back to the main app with success
    const successUrl = `/?oauth_success=true&access_token=${tokenData.access_token}&workspace_id=${tokenData.workspace_id}&workspace_name=${encodeURIComponent(tokenData.workspace_name || 'Unknown Workspace')}`;
    
    return res.redirect(successUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(`/?error=callback_error&error_description=${encodeURIComponent(error.message)}`);
  }
}
