import 'dotenv/config';
import OpenAI from 'openai';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');
const CHAPTERS_DIR = join(ROOT, 'manuscript', 'chapters');
const AUDIO_DIR = join(ROOT, 'site', 'public', 'audio');

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Add it to rag/.env');
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function stripMarkdown(md: string): string {
  return md
    .replace(/\[stage\.[^\]]*\]/g, '')   // strip [stage.*] commands before TTS
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\|.+/gm, '')        // skip table rows (too verbose for TTS)
    .replace(/^---+$/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^## Export[\s\S]*$/m, '') // skip export section
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Split text at sentence boundaries, keeping chunks under maxChars
function chunkText(text: string, maxChars = 4000): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxChars) {
    const segment = remaining.slice(0, maxChars);
    const lastBreak = Math.max(
      segment.lastIndexOf('. '),
      segment.lastIndexOf('.\n'),
      segment.lastIndexOf('? '),
      segment.lastIndexOf('! ')
    );
    const cutAt = lastBreak > maxChars * 0.5 ? lastBreak + 1 : maxChars;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}

async function generateChapter(filePath: string): Promise<void> {
  const slug = basename(filePath, '.md');
  const content = readFileSync(filePath, 'utf-8');

  // Skip stubs
  if (
    content.includes('## Main beats') ||
    content.includes('## Chapter job') ||
    content.includes('## Draft notes')
  ) {
    console.log(`Skipping stub: ${slug}`);
    return;
  }

  const plain = stripMarkdown(content);
  if (plain.length < 100) {
    console.log(`Skipping short content: ${slug}`);
    return;
  }

  const chunks = chunkText(plain);
  console.log(`\n${slug}: ${plain.length} chars, ${chunks.length} chunk(s)`);

  // Generate TTS audio for each chunk
  const audioBuffers: Buffer[] = [];
  for (const [i, chunk] of chunks.entries()) {
    process.stdout.write(`  TTS chunk ${i + 1}/${chunks.length} (${chunk.length} chars)... `);
    const response = await client.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'onyx',
      input: chunk,
      response_format: 'mp3',
    });
    const buf = Buffer.from(await response.arrayBuffer());
    audioBuffers.push(buf);
    console.log(`${buf.length} bytes`);
  }

  const audioBuffer = Buffer.concat(audioBuffers);
  const audioPath = join(AUDIO_DIR, `${slug}.mp3`);
  writeFileSync(audioPath, audioBuffer);
  console.log(`  Audio → ${audioPath}`);

  // Get word-level timestamps via Whisper
  process.stdout.write(`  Whisper word timestamps... `);
  const audioFile = new File([audioBuffer], `${slug}.mp3`, { type: 'audio/mpeg' });

  const transcript = await (client.audio.transcriptions.create as Function)({
    file: audioFile,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  const words = transcript.words ?? [];
  const wordsPath = join(AUDIO_DIR, `${slug}.words.json`);
  writeFileSync(wordsPath, JSON.stringify(words, null, 2));
  console.log(`${words.length} words → ${wordsPath}`);
}

async function main() {
  mkdirSync(AUDIO_DIR, { recursive: true });

  const args = process.argv.slice(2);
  let files: string[];

  if (args.length > 0) {
    files = args.map(a =>
      a.includes('/') || a.includes('\\') ? a : join(CHAPTERS_DIR, a)
    );
  } else {
    files = readdirSync(CHAPTERS_DIR)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => join(CHAPTERS_DIR, f));
  }

  console.log(`Generating audio for ${files.length} file(s)...`);

  for (const filePath of files) {
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    try {
      await generateChapter(filePath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`\n  Error: ${msg}`);
    }
  }

  console.log('\nDone.');
}

main();
