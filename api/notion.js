export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'endpoint 파라미터가 필요합니다' });

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) return res.status(500).json({ error: 'NOTION_TOKEN 환경변수가 설정되지 않았습니다' });

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
        body: (req.method !== 'GET' && req.method !== 'HEAD')
          ? JSON.stringify(req.body)
          : undefined,
      }
    );

    const data = await notionRes.json();
    res.status(notionRes.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
