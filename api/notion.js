// Vercel serverless function to proxy Notion API requests
// This avoids CORS issues by making the request from the server
// Updated: Automatic token generation - users only need database ID

export default async function handler(req, res) {
  console.log('🚀 API called:', req.method, req.url);
  
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

    if (!databaseId) {
      return res.status(400).json({ error: 'Missing databaseId' });
    }

    // Use shared integration token - users don't need to provide their own
    const sharedToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_your_shared_integration_token_here';
    
    console.log('🔑 Using shared integration token for database:', databaseId);

    // Query the Notion database using our shared integration
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
      console.error('Notion API Error:', errorData);
      
      // Provide helpful error messages for common issues
      if (notionResponse.status === 401) {
        return res.status(401).json({ 
          error: 'Database access denied', 
          details: 'The shared integration does not have access to this database. Please make sure the database is shared with the integration.',
          suggestion: 'In Notion, go to your database, click the "..." menu, select "Add connections", and add the shared integration.'
        });
      } else if (notionResponse.status === 404) {
        return res.status(404).json({ 
          error: 'Database not found', 
          details: 'The database ID provided does not exist or is not accessible.',
          suggestion: 'Please check that you copied the correct database URL and that the database exists.'
        });
      } else {
        return res.status(notionResponse.status).json({ 
          error: 'Notion API error', 
          details: errorData 
        });
      }
    }

    const data = await notionResponse.json();
    console.log('✅ Successfully fetched data from Notion database');
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
