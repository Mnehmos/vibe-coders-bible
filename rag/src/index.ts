import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

// ============================================================================
// Types
// ============================================================================

interface Chunk {
  chunk_id: string;
  chapter_id: string;
  chapter_num: number;
  chapter_title: string;
  section: string;
  text: string;
}

interface Message { role: 'user' | 'assistant'; content: string; }

// ============================================================================
// Data loading
// ============================================================================

let chunks: Chunk[] = [];
const chunkMap = new Map<string, Chunk>();

function loadJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l) as T);
}

function loadData() {
  chunks = loadJsonl<Chunk>(join(DATA_DIR, 'chunks.jsonl'));
  chunks.forEach(c => chunkMap.set(c.chunk_id, c));
  console.error(`Loaded ${chunks.length} chunks from ${DATA_DIR}`);
}

// ============================================================================
// Search (keyword — upgrade to semantic by adding embeddings later)
// ============================================================================

function searchKeyword(query: string, topK = 8): Chunk[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return [];

  const scored = chunks.map(c => {
    const text = (c.text + ' ' + c.section + ' ' + c.chapter_title).toLowerCase();
    const matches = terms.filter(t => text.includes(t)).length;
    return { chunk: c, score: matches / terms.length };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(r => r.chunk);
}

// ============================================================================
// HTTP server
// ============================================================================

const app = express();
app.use(express.json({ limit: '512kb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use((req, _res, next) => {
  console.error(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok', chunks: chunks.length, uptime: Math.floor(process.uptime()) });
});

app.get('/stats', (_, res) => {
  res.json({
    project: 'vibe-coders-bible',
    description: "The Vibe Coder's Bible RAG search",
    chunks: chunks.length,
  });
});

app.post('/search', (req, res) => {
  const { query, top_k = 8 } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });
  const results = searchKeyword(query, Math.min(top_k, 20));
  res.json({ results, total: results.length, query });
});

app.post('/chat', async (req, res) => {
  const { question, messages = [], top_k = 6 } = req.body as {
    question: string;
    messages?: Message[];
    top_k?: number;
  };

  if (!question) return res.status(400).json({ error: 'question required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const client = new Anthropic({ apiKey });

  const relevant = searchKeyword(question, Math.min(top_k, 10));

  const context = relevant.map((c, i) =>
    `[${i + 1}] Chapter ${c.chapter_num} — ${c.chapter_title}${c.section ? ` (${c.section})` : ''}\n${c.text}`
  ).join('\n\n---\n\n');

  const system = `You are an expert guide for "The Vibe Coder's Bible" by Mnehmos from The Mnemosyne Research Institute.

The book's core doctrine:
- Trust AI to propose. Verify before commit.
- Attention to detail was always a labor constraint. AI makes detail affordable.
- Design systems where hallucination can exist, but cannot silently become truth.
- Prompting is PPE — real safety lives higher in the hierarchy of controls.

Answer questions using the retrieved passages below. Always cite which chapter your answer draws from.
If the passages don't cover the question, say so and point to the most relevant part of the book.

RETRIEVED PASSAGES:
${context || 'No passages retrieved — use your knowledge of the book.'}`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send sources first
  res.write(`data: ${JSON.stringify({
    type: 'sources',
    sources: relevant.map(c => ({
      chunk_id: c.chunk_id,
      text: c.text.slice(0, 300),
      source_name: `Chapter ${c.chapter_num}: ${c.chapter_title}`,
      score: 1,
    })),
  })}\n\n`);

  try {
    const history: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...messages.slice(-8),
      { role: 'user', content: question },
    ];

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages: history,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ type: 'delta', text: chunk.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Generation failed' })}\n\n`);
    res.end();
  }
});

const PORT = parseInt(process.env.PORT ?? '8080');
app.listen(PORT, () => {
  console.error(`vibe-coders-bible RAG server on :${PORT}`);
  console.error(`Endpoints: /health /stats /search /chat`);
});

loadData();
