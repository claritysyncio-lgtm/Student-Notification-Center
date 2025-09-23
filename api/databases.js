/**
 * API endpoint to fetch user's Notion databases
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
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    try {
      // Fetch user's databases from Notion API
      const response = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: {
            value: 'database',
            property: 'object'
          },
          page_size: 100
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch databases from Notion API');
      }

      // Transform the data to include only relevant information
      const databases = data.results.map(db => ({
        id: db.id,
        title: db.title?.[0]?.text?.content || 'Untitled Database',
        url: db.url,
        created_time: db.created_time,
        last_edited_time: db.last_edited_time
      }));

      res.status(200).json({ databases });

    } catch (error) {
      console.error('Databases API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch databases from Notion',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
