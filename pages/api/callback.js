export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET
          ).toString("base64"),
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://notification-center-for-customers.vercel.app/api/callback",
      }),
    });

    const data = await response.json();

    // TODO: Save token securely in our database for the user
    console.log("Notion Access Token:", data);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OAuth exchange failed" });
  }
}
