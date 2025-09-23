// Notion OAuth callback handler for exchanging authorization code for access token
export default async function handler(req, res) {
  console.log('🔐 Notion OAuth callback received:', req.method, req.url);
  
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
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
        redirect_uri: 'https://notification-center-for-customers.vercel.app/callback'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return res.status(tokenResponse.status).json({ 
        error: 'Failed to exchange authorization code',
        details: errorData 
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Successfully obtained access token');

    // Return the token and workspace info to the frontend
    res.status(200).json({
      access_token: tokenData.access_token,
      workspace_id: tokenData.workspace_id,
      workspace_name: tokenData.workspace_name || 'Unknown Workspace',
      bot_id: tokenData.bot_id
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
