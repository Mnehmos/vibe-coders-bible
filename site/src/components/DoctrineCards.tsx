import { useState } from 'react';

interface Card {
  num: number;
  title: string;
  keyLine: string;
  thesis: string;
  slug: string;
  part: string;
}

interface DoctrineCardsProps {
  cards: Card[];
  base: string;
}

export default function DoctrineCards({ cards, base }: DoctrineCardsProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  const filtered = cards.filter(c =>
    !filter ||
    c.keyLine.toLowerCase().includes(filter.toLowerCase()) ||
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  const copy = (card: Card) => {
    navigator.clipboard.writeText(`"${card.keyLine}"\n— The Vibe Coder's Bible, Chapter ${card.num}: ${card.title}`).then(() => {
      setCopiedId(card.num);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter doctrine..."
          className="w-full max-w-sm bg-[#161616] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e2e2e2] placeholder:text-[#444] focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(card => (
          <button
            key={card.num}
            onClick={() => copy(card)}
            className="text-left p-5 rounded-xl border border-[#2a2a2a] bg-[#161616] hover:border-amber-500/40 hover:bg-[#1a1a1a] transition-all group relative"
          >
            <div className="font-mono text-xs text-[#444] mb-3">
              Ch. {String(card.num).padStart(2, '0')} · {card.part.replace(/^[IVX]+ — /, '')}
            </div>
            <p className="text-amber-400 font-medium leading-relaxed text-sm mb-3 italic">
              "{card.keyLine}"
            </p>
            {card.thesis && (
              <p className="text-xs text-[#666] leading-relaxed line-clamp-2">{card.thesis}</p>
            )}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-[#555] font-mono">
                {copiedId === card.num ? '✓ copied' : 'copy'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[#555] text-sm text-center py-12">No matches.</p>
      )}
    </div>
  );
}
