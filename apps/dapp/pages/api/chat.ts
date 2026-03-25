import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), '../../docs');

let docsCache: string | null = null;

function loadDocs(): string {
  if (docsCache) return docsCache;
  try {
    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
    docsCache = files
      .map(f => {
        const content = fs.readFileSync(path.join(DOCS_DIR, f), 'utf-8');
        return `## ${f.replace('.md', '').replace(/-/g, ' ')}\n\n${content}`;
      })
      .join('\n\n---\n\n');
  } catch {
    docsCache = '';
  }
  return docsCache ?? '';
}

const SYSTEM_PROMPT = `You are the sCrow support assistant. sCrow is a secure escrow platform for web3 freelancers.

RULES:
- ONLY answer questions using the documentation provided below.
- If the answer is not in the docs, say "I don't have information about that. You can ask about creating contracts, deposits, releases, disputes, fees, arbitrators, or templates."
- Never make up information or guess.
- Keep answers concise (2-4 sentences unless the user asks for detail).
- Be friendly and helpful.

DOCUMENTATION:
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chat not configured' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages required' });
  }

  const docs = loadDocs();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + docs },
          ...messages.slice(-6),
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'AI request failed' });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      'Sorry, I could not generate a response.';

    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
