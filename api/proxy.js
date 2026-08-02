export default async function handler(req, res) {
  // Set CORS headers so the client can call this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Base-Url'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, body } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing target URL in request body' });
    }

    // Forward the request to the target server
    const targetResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify(body || {})
    });

    const responseText = await targetResponse.text();
    
    // Set headers and forward status and text
    res.status(targetResponse.status).send(responseText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
