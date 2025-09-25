/**
 * Test Session API
 * 
 * Simple endpoint to test if sessions are working
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const sessionId = req.cookies?.session;
    const hasSession = req.cookies?.hasSession;
    
    res.status(200).json({
      message: 'Session test endpoint',
      hasSessionCookie: !!hasSession,
      hasSessionId: !!sessionId,
      sessionId: sessionId ? sessionId.substring(0, 8) + '...' : 'none',
      allCookies: req.cookies,
      globalSessions: global.sessions ? global.sessions.size : 0
    });
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
