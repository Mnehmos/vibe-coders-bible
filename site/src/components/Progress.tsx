import { useState, useEffect } from 'react';

interface ProgressProps {
  chapterSlug: string;
}

function readKey(slug: string) { return `vcb:read:${slug}`; }
function checklistKey(slug: string) { return `vcb:checklist:${slug}`; }

export default function Progress({ chapterSlug }: ProgressProps) {
  const [read, setRead] = useState(false);
  const [checklistDone, setChecklistDone] = useState<number | null>(null);
  const [checklistTotal, setChecklistTotal] = useState<number | null>(null);

  useEffect(() => {
    try {
      setRead(!!localStorage.getItem(readKey(chapterSlug)));
      const cl = localStorage.getItem(checklistKey(chapterSlug));
      if (cl) {
        const obj: Record<string, boolean> = JSON.parse(cl);
        const vals = Object.values(obj);
        setChecklistDone(vals.filter(Boolean).length);
        setChecklistTotal(vals.length);
      }
    } catch {}
  }, [chapterSlug]);

  const markRead = () => {
    try { localStorage.setItem(readKey(chapterSlug), '1'); } catch {}
    setRead(true);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={markRead}
        className={`w-full text-left px-3 py-2 rounded border text-xs transition-all ${
          read
            ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
            : 'border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]'
        }`}
      >
        {read ? '✓ Marked as read' : 'Mark as read'}
      </button>

      {checklistTotal !== null && (
        <div className="px-3 py-2 rounded border border-[#2a2a2a] text-xs text-[#555]">
          <div className="flex justify-between mb-1.5">
            <span>Checklist</span>
            <span className="font-mono">{checklistDone}/{checklistTotal}</span>
          </div>
          <div className="h-0.5 bg-[#2a2a2a] rounded-full">
            <div
              className="h-0.5 bg-amber-500 rounded-full transition-all"
              style={{ width: `${checklistTotal ? (checklistDone! / checklistTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
