// OAuth callback handler for Notion integration
export default async function handler(req, res) {
  try {
    // Notion sends ?code=... on redirect
    const code = req.query?.code || req.body?.code;
    const error = req.query?.error;

    if (error) {
      console.error('OAuth error from Notion:', error);
      return res.redirect(`/?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.status(400).send('Missing "code" parameter from Notion.');
    }

    // Use the production redirect URI exactly as registered in Notion
    const redirect_uri = 'https://student-notification-center.vercel.app/api/auth/callback/notion';

    // Exchange authorization code for an access token
    const tokenResp = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: process.env.NOTION_CLIENT_ID,
        client_secret: process.env.NOTION_CLIENT_SECRET,
      }),
    });

    const tokenJson = await tokenResp.json();

    if (!tokenResp.ok) {
      console.error('Notion token exchange failed:', tokenJson);
      return res.status(500).send('Token exchange failed. Check server logs.');
    }

    // OPTIONAL: Verify token works by calling Notion API (users/me)
    const verifyResp = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        'Notion-Version': '2022-06-28'
      }
    });
    const verifyJson = await verifyResp.json();
    console.log('Notion user verify result:', verifyJson);

    // Log token for debugging (will appear in Vercel function logs)
    console.log('Notion access_token (SAVE THIS IN DB):', tokenJson);

    // Redirect user to the dashboard with token parameters
    const { access_token, bot_id, workspace_id, workspace_name } = tokenJson;
    const redirectUrl = `https://student-notification-center.vercel.app/dashboard?token=${encodeURIComponent(access_token)}&workspace=${encodeURIComponent(workspace_name)}&bot_id=${encodeURIComponent(bot_id)}`;
    
    return res.redirect(redirectUrl);

  } catch (err) {
    console.error('OAuth callback error:', err);
    return res.status(500).send('Server error in OAuth callback. See logs.');
  }
}
