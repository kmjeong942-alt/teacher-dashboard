export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, ...params } = req.query;

  const endpoints = {
    meal: 'mealServiceDietInfo',
    schedule: 'SchoolSchedule',
  };

  const endpoint = endpoints[type];
  if (!endpoint) return res.status(400).json({ error: 'type 파라미터 필요 (meal 또는 schedule)' });

  const qs = new URLSearchParams({ Type: 'json', ...params }).toString();
  const url = `https://open.neis.go.kr/hub/${endpoint}?${qs}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
