/**
 * Test API to check environment variables
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envCheck = {
    NOTION_CLIENT_ID: !!process.env.NOTION_CLIENT_ID,
    NOTION_CLIENT_SECRET: !!process.env.NOTION_CLIENT_SECRET,
    BASE_URL: !!process.env.BASE_URL,
    CLIENT_ID_VALUE: process.env.NOTION_CLIENT_ID,
    BASE_URL_VALUE: process.env.BASE_URL
  };
  
  res.status(200).json({
    message: 'Environment variables check',
    env: envCheck
  });
}
