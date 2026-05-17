/**
 * Reads all manuscript chapters and produces data/chunks.jsonl
 * Run: npm run index  (from the rag/ directory)
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTERS_DIR = join(__dirname, '..', '..', '..', 'manuscript', 'chapters');
const FRONT_MATTER_DIR = join(__dirname, '..', '..', '..', 'manuscript', 'front-matter');
const DATA_DIR = join(__dirname, '..', '..', 'data');

interface Chunk {
  chunk_id: string;
  chapter_id: string;
  chapter_num: number;
  chapter_title: string;
  section: string;
  text: string;
}

function splitIntoChunks(text: string, maxLen = 600): string[] {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function parseChapterFile(filename: string, content: string): Chunk[] {
  const lines = content.split('\n');
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine?.replace(/^# /, '').trim() ?? filename;

  const numMatch = filename.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 0;

  // Skip pure stubs
  if (content.includes('## Main beats') || content.includes('## Chapter job')) return [];

  const chunks: Chunk[] = [];
  let currentSection = '';
  let currentBuffer = '';

  const flush = () => {
    if (!currentBuffer.trim()) return;
    splitIntoChunks(currentBuffer).forEach(text => {
      if (text.length < 60) return; // skip tiny fragments
      chunks.push({
        chunk_id: randomUUID(),
        chapter_id: filename.replace('.md', ''),
        chapter_num: num,
        chapter_title: title,
        section: currentSection,
        text,
      });
    });
    currentBuffer = '';
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      currentSection = line.replace(/^## /, '').trim();
    } else if (!line.startsWith('# ') && !line.startsWith('Part: ')) {
      currentBuffer += line + '\n';
    }
  }
  flush();
  return chunks;
}

function buildIndex() {
  mkdirSync(DATA_DIR, { recursive: true });

  const allChunks: Chunk[] = [];

  // Process chapters
  const chapterFiles = readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.md')).sort();
  for (const file of chapterFiles) {
    const content = readFileSync(join(CHAPTERS_DIR, file), 'utf-8');
    const chunks = parseChapterFile(file, content);
    allChunks.push(...chunks);
    if (chunks.length > 0) console.log(`${file}: ${chunks.length} chunks`);
  }

  // Process front matter
  try {
    const fmFiles = readdirSync(FRONT_MATTER_DIR).filter(f => f.endsWith('.md')).sort();
    for (const file of fmFiles) {
      const content = readFileSync(join(FRONT_MATTER_DIR, file), 'utf-8');
      const chunks = parseChapterFile(`fm-${file}`, content);
      allChunks.push(...chunks);
    }
  } catch {}

  const jsonl = allChunks.map(c => JSON.stringify(c)).join('\n');
  writeFileSync(join(DATA_DIR, 'chunks.jsonl'), jsonl, 'utf-8');
  console.log(`\nWrote ${allChunks.length} chunks to data/chunks.jsonl`);
}

buildIndex();
