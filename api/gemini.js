export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY 없음' });

  try {
    const { messages, system } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // 2025-2026년 기준 최신 모델 순서로 시도
    const models = [
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.5-flash-preview-04-17',
      'gemini-1.5-flash-8b',
    ];

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system || '친절한 AI 어시스턴트입니다.' }] },
            contents,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        console.warn(`[${model}] 오류:`, data.error.message);
        continue;
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') ||
        null;

      if (text) {
        console.log(`[${model}] 성공`);
        return res.status(200).json({ text });
      }
    }

    return res.status(200).json({ text: '응답을 가져오지 못했어요. 잠시 후 다시 시도해주세요.' });

  } catch (e) {
    console.error('Gemini 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
}
