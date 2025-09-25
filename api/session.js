/**
 * Session Management API
 * 
 * Handles server-side session storage for embed compatibility.
 * Uses HTTP-only cookies that work in Notion iframes.
 */

const sessions = new Map(); // In production, use Redis or database

export default async function handler(req, res) {
  // Set CORS headers for iframe embedding
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Create or update session
    const { accessToken, databaseId, workspaceId, workspaceName } = req.body;
    
    if (!accessToken || !databaseId) {
      return res.status(400).json({ error: 'Access token and database ID are required' });
    }

    // Generate session ID
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Store session data
    sessions.set(sessionId, {
      accessToken,
      databaseId,
      workspaceId,
      workspaceName,
      createdAt: new Date().toISOString()
    });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `session=${sessionId}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
      `hasSession=true; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    ]);

    res.status(200).json({ 
      success: true, 
      sessionId: sessionId.substring(0, 8) + '...' // Don't expose full session ID
    });

  } else if (req.method === 'GET') {
    // Get session data
    const sessionId = req.cookies?.session;
    
    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(401).json({ error: 'No valid session found' });
    }

    const session = sessions.get(sessionId);
    res.status(200).json({
      hasSession: true,
      accessToken: session.accessToken,
      databaseId: session.databaseId,
      workspaceId: session.workspaceId,
      workspaceName: session.workspaceName
    });

  } else if (req.method === 'DELETE') {
    // Clear session
    const sessionId = req.cookies?.session;
    
    if (sessionId) {
      sessions.delete(sessionId);
    }

    res.setHeader('Set-Cookie', [
      'session=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/',
      'hasSession=; Secure; SameSite=None; Max-Age=0; Path=/'
    ]);

    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
