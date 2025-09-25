/**
 * Notion API Proxy for fetching database data
 */

export default async function handler(req, res) {
  // Set CORS headers for iframe embedding
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Try to get session data first
    const sessionId = req.cookies?.session;
    let accessToken, databaseId;

    if (sessionId && global.sessions?.has(sessionId)) {
      // Use session data
      const session = global.sessions.get(sessionId);
      accessToken = session.accessToken;
      databaseId = session.databaseId;
      console.log('Using session data for API call');
    } else {
      // Fallback to request body (for backward compatibility)
      const { databaseId: reqDbId, token } = req.body;
      if (!reqDbId || !token) {
        return res.status(401).json({ error: 'No valid session or credentials provided' });
      }
      accessToken = token;
      databaseId = reqDbId;
      console.log('Using request body data for API call');
    }

    try {
      // Fetch database data from Notion API
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_size: 100
        })
      });

      const data = await response.json();

      console.log('Notion API response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        console.error('Notion API error details:', {
          status: response.status,
          statusText: response.statusText,
          error: data
        });
        throw new Error(data.message || `Notion API error: ${response.status} - ${data.error || 'Unknown error'}`);
      }

      res.status(200).json(data);

    } catch (error) {
      console.error('Notion API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data from Notion',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
