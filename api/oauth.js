/**
 * Vercel Serverless API for Notion OAuth
 * 
 * This API handles the OAuth flow securely on the server side,
 * keeping sensitive credentials away from the browser.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Check if environment variables are set
    if (!process.env.NOTION_CLIENT_ID || !process.env.NOTION_CLIENT_SECRET || !process.env.BASE_URL) {
      console.error('Missing environment variables:', {
        NOTION_CLIENT_ID: !!process.env.NOTION_CLIENT_ID,
        NOTION_CLIENT_SECRET: !!process.env.NOTION_CLIENT_SECRET,
        BASE_URL: !!process.env.BASE_URL
      });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
      const redirectUri = `${process.env.BASE_URL}/oauthcallback.html`;
      
      console.log('OAuth request:', {
        code: code.substring(0, 10) + '...',
        redirectUri,
        clientId: process.env.NOTION_CLIENT_ID
      });

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
          ).toString('base64')}`
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri
        })
      });

      const tokenData = await tokenResponse.json();

      console.log('Notion API response:', {
        status: tokenResponse.status,
        ok: tokenResponse.ok,
        error: tokenData.error
      });

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || `HTTP ${tokenResponse.status}: Failed to exchange code for token`);
      }

      // Return the access token to the frontend
      res.status(200).json({
        access_token: tokenData.access_token,
        workspace_id: tokenData.workspace_id,
        workspace_name: tokenData.workspace_name
      });

    } catch (error) {
      console.error('OAuth error:', error);
      res.status(500).json({ 
        error: 'Failed to complete OAuth flow',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
