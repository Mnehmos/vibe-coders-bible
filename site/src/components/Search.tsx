import { useState, useRef, useCallback } from 'react';

interface SearchProps {
  ragUrl: string;
  base: string;
}

interface Source {
  text: string;
  source_name: string | null;
  score: number;
}

export default function Search({ ragUrl, base }: SearchProps) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const abortRef = useRef<AbortController | null>(null);

  const noBackend = !ragUrl;

  const ask = useCallback(async (q: string) => {
    if (!q.trim() || loading) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');
    setSources([]);
    setAnswer('');

    const userMsg = { role: 'user' as const, content: q };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    try {
      const res = await fetch(`${ragUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, messages, top_k: 6 }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.type === 'sources') setSources(evt.sources ?? []);
            if (evt.type === 'delta') { fullAnswer += evt.text; setAnswer(fullAnswer); }
            if (evt.type === 'done') {
              setMessages(prev => [...prev, { role: 'assistant', content: fullAnswer }]);
            }
          } catch {}
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  }, [ragUrl, loading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      ask(query);
      setQuery('');
    }
  };

  if (noBackend) {
    return (
      <div className="card text-center py-12">
        <p className="text-[#777] text-sm mb-2">RAG backend not configured.</p>
        <p className="text-xs text-[#555]">
          Deploy the <code className="text-amber-400">rag/</code> service to Railway and set{' '}
          <code className="text-amber-400">RAG_URL</code> to enable Ask the Book.
        </p>
        <div className="mt-6 text-left max-w-sm mx-auto">
          <p className="text-xs text-[#555] mb-2 font-mono">Quick keyword search:</p>
          <form onSubmit={e => { e.preventDefault(); const form = e.target as HTMLFormElement; const q = (form.elements.namedItem('q') as HTMLInputElement).value; if (q) window.location.href = `${base}/chapters?q=${encodeURIComponent(q)}`; }}>
            <div className="flex gap-2">
              <input name="q" type="text" placeholder="Search chapters..." className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e2e2e2] placeholder:text-[#444] focus:outline-none focus:border-amber-500/50" />
              <button type="submit" className="btn-primary text-xs">Go</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversation history */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-amber-400 text-xs">B</span>
                </div>
              )}
              <div className={`max-w-2xl rounded-lg px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#1a1a2e] border border-[#2a2a3e] text-[#e2e2e2]'
                  : 'bg-[#161616] border border-[#2a2a2a] text-[#d1d5db]'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {/* Streaming answer */}
          {loading && answer && (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-amber-400 text-xs">B</span>
              </div>
              <div className="max-w-2xl rounded-lg px-4 py-3 text-sm leading-relaxed bg-[#161616] border border-[#2a2a2a] text-[#d1d5db]">
                {answer}
                <span className="inline-block w-1 h-4 bg-amber-400 ml-1 animate-pulse" />
              </div>
            </div>
          )}

          {loading && !answer && (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <span className="text-amber-400 text-xs">B</span>
              </div>
              <div className="flex items-center gap-2 text-[#555] text-sm">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                Searching the manuscript...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <details className="card">
          <summary className="text-xs text-[#555] cursor-pointer hover:text-[#999] transition-colors">
            {sources.length} source{sources.length !== 1 ? 's' : ''} retrieved
          </summary>
          <div className="mt-3 space-y-2">
            {sources.slice(0, 4).map((s, i) => (
              <div key={i} className="text-xs text-[#666] border-l border-[#2a2a2a] pl-3">
                {s.text.slice(0, 180)}…
              </div>
            ))}
          </div>
        </details>
      )}

      {error && (
        <div className="text-sm text-red-400 border border-red-900/50 rounded-lg px-4 py-3 bg-red-900/10">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
          placeholder={messages.length > 0 ? 'Ask a follow-up...' : 'Ask anything about the book...'}
          className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e2e2e2] placeholder:text-[#444] focus:outline-none focus:border-amber-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </form>

      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'What is the hierarchy of AI controls?',
            'How does ProveCalc enforce the trust boundary?',
            'What is the difference between generation and ownership?',
            'How should I structure a proposal / validate / commit loop?',
          ].map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); ask(q); }}
              className="text-left text-xs text-[#555] hover:text-[#999] p-3 rounded-lg border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
