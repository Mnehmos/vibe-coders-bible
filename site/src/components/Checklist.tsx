import { useState, useEffect } from 'react';

interface ChecklistProps {
  chapterSlug: string;
  chapterBody: string;
}

interface CheckItem {
  id: string;
  question: string;
  protects: string;
}

function parseChecklist(body: string): CheckItem[] {
  const artifactIdx = body.indexOf('## Practical Artifact');
  if (artifactIdx === -1) return [];

  const artifactSection = body.slice(artifactIdx);
  const tableMatch = artifactSection.match(/\|.+\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/);
  if (!tableMatch) return [];

  const rows = tableMatch[1]
    .split('\n')
    .map(r => r.trim())
    .filter(r => r.startsWith('|') && r.endsWith('|'));

  return rows.map((row, i) => {
    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
    return {
      id: `${i}`,
      question: cells[0] ?? '',
      protects: cells[1] ?? '',
    };
  }).filter(item => item.question && !item.question.startsWith('---'));
}

function storageKey(slug: string) {
  return `vcb:checklist:${slug}`;
}

export default function Checklist({ chapterSlug, chapterBody }: ChecklistProps) {
  const items = parseChecklist(chapterBody);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [exported, setExported] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(chapterSlug));
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, [chapterSlug]);

  if (items.length === 0) return null;

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(storageKey(chapterSlug), JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const doneCount = items.filter(i => checked[i.id]).length;
  const pct = Math.round((doneCount / items.length) * 100);

  const exportText = () => {
    const lines = [
      `# Checklist: ${chapterSlug}`,
      '',
      ...items.map(i => `- [${checked[i.id] ? 'x' : ' '}] ${i.question}`),
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest font-mono">
          Practical Artifact
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#555] font-mono">{doneCount}/{items.length} checked</span>
          <button
            onClick={exportText}
            className="text-xs px-2 py-1 border border-[#2a2a2a] rounded text-[#777] hover:border-amber-500 hover:text-amber-400 transition-colors"
          >
            {exported ? 'Copied!' : 'Export'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#2a2a2a] rounded-full mb-6">
        <div
          className="h-1 bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              checked[item.id]
                ? 'border-amber-500/30 bg-amber-500/5'
                : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
            }`}
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                checked[item.id] ? 'border-amber-500 bg-amber-500' : 'border-[#444]'
              }`}
              onClick={() => toggle(item.id)}
            >
              {checked[item.id] && (
                <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                  <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0" onClick={() => toggle(item.id)}>
              <p className={`text-sm leading-relaxed ${checked[item.id] ? 'text-[#666] line-through' : 'text-[#d1d5db]'}`}>
                {item.question}
              </p>
              {item.protects && (
                <p className="text-xs text-[#555] mt-0.5">{item.protects}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {doneCount === items.length && items.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
          <p className="text-sm text-amber-400">Checklist complete. Trust the work.</p>
        </div>
      )}
    </div>
  );
}
