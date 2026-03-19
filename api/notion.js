export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  try {
    const notionRes = await fetch(
      `https://api.notion.com/v1/${endpoint}`,
      {
        method: req.method,
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      }
    );
    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
