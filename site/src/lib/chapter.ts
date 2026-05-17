export interface ChapterMeta {
  id: string;
  slug: string;
  num: number;
  title: string;
  part: string;
  partNum: number;
  thesis: string;
  keyLine: string;
  isStub: boolean;
}

export function parseChapterMeta(id: string, body: string): ChapterMeta {
  const lines = body.split('\n');

  const titleLine = lines.find(l => l.startsWith('# Chapter'));
  const title = titleLine?.replace(/^# /, '').trim() ?? id;

  const partLine = lines.find(l => l.startsWith('Part: '));
  const part = partLine?.replace(/^Part: /, '').trim() ?? '';

  const partNumMatch = part.match(/^([IVXLC]+)/);
  const partNum = partNumMatch ? romanToInt(partNumMatch[1]) : 0;

  const thesisIdx = lines.findIndex(l => l.trim() === '## Thesis');
  const thesis = thesisIdx >= 0
    ? lines.slice(thesisIdx + 1).find(l => l.trim() && !l.startsWith('#'))?.trim() ?? ''
    : '';

  const keyLineIdx = lines.findIndex(l => l.trim() === '## Key Line' || l.trim() === '## Key line');
  const keyLine = keyLineIdx >= 0
    ? lines.slice(keyLineIdx + 1).find(l => l.trim() && !l.startsWith('#'))?.trim() ?? ''
    : '';

  const numMatch = id.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : 0;

  const isStub = body.includes('## Main beats') || body.includes('## Chapter job') || body.includes('## Draft notes');

  return { id, slug: id, num, title, part, partNum, thesis, keyLine, isStub };
}

export function extractPracticalArtifact(body: string): string | null {
  const idx = body.indexOf('## Practical Artifact');
  if (idx === -1) return null;
  return body.slice(idx);
}

function romanToInt(s: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]] ?? 0;
    const nxt = map[s[i + 1]] ?? 0;
    total += cur < nxt ? -cur : cur;
  }
  return total;
}

export const PARTS: Record<number, string> = {
  1: 'The New Discipline',
  2: 'Trust, But Verify',
  3: 'The Hierarchy Of AI Controls',
  4: 'The Propose / Validate / Commit Loop',
  5: 'AI-Assisted Development Workflows',
  6: 'Case Studies From The Mnehmos Ecosystem',
  7: 'Failure Modes',
  8: 'The Field Manual',
};
