/**
 * Vercel serverless proxy for Anthropic API.
 * Keeps the API key server-side and avoids CORS.
 * Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(501).json({
      error: 'ANTHROPIC_API_KEY not configured',
      message: 'Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.',
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Anthropic proxy error:', err);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message || 'Failed to reach Anthropic API.',
    });
  }
}
