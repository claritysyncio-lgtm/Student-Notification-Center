// Simple Notion API proxy for the notification center
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { databaseId } = req.body;

    if (!databaseId) {
      return res.status(400).json({ error: 'Missing databaseId' });
    }

    // Use shared integration token
    const sharedToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_your_shared_integration_token_here';

    // Query the Notion database
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sharedToken}`,
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
