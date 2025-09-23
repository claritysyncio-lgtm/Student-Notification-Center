// OAuth callback handler for Notion integration
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect('/?error=missing_authorization_code');
  }

  try {
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
        redirect_uri: 'https://notification-center-for-customers.vercel.app/api/auth/callback/notion'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return res.redirect(`/?error=${encodeURIComponent('token_exchange_failed')}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, bot_id, workspace_id, workspace_name } = tokenData;

    // Store the access token and workspace info in localStorage via redirect
    // Redirect to dashboard with token parameters
    const redirectUrl = `https://notification-center-for-customers.vercel.app/dashboard?token=${encodeURIComponent(access_token)}&workspace=${encodeURIComponent(workspace_name)}&bot_id=${encodeURIComponent(bot_id)}`;
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(`/?error=${encodeURIComponent('oauth_callback_error')}`);
  }
}
