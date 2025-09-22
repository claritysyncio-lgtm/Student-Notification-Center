// Vercel serverless function to proxy Notion API requests
// This avoids CORS issues by making the request from the server
// Updated: Force deployment refresh

export default async function handler(req, res) {
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
    const { databaseId, token } = req.body;

    if (!databaseId || !token) {
      return res.status(400).json({ error: 'Missing databaseId or token' });
    }

    // Query the Notion database
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        page_size: 100
      })
    });

    if (!notionResponse.ok) {
      const errorData = await notionResponse.json();
      return res.status(notionResponse.status).json({ 
        error: 'Notion API error', 
        details: errorData 
      });
    }

    const data = await notionResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
