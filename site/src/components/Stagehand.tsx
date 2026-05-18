import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AudioWord { word: string; start: number; end: number; }
interface Para { text: string; wordStart: number; wordEnd: number; }
interface StageCommand { wordIdx: number; type: string; args: Record<string, string>; }
interface StagehandProps { body: string; audioSrc?: string; wordsSrc?: string; }
type PlayState = 'idle' | 'playing' | 'paused';

// ─── Parsers ─────────────────────────────────────────────────────────────────

function parseCommandArgs(raw: string): Record<string, string> {
  const args: Record<string, string> = {};
  const re = /(\w+)=(?:"([^"]*?)"|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) args[m[1]] = m[2] ?? m[3];
  return args;
}

function extractStage(md: string): { plain: string; commands: StageCommand[] } {
  let text = md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\|.+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^## Export[\s\S]*$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const commands: StageCommand[] = [];
  const cmdRe = /\[stage\.([\w.]+)([^\]]*)\]/g;
  let lastIdx = 0, wc = 0, plain = '';
  let m: RegExpExecArray | null;
  while ((m = cmdRe.exec(text)) !== null) {
    const seg = text.slice(lastIdx, m.index);
    plain += seg;
    wc += seg.split(/\s+/).filter(Boolean).length;
    commands.push({ wordIdx: wc, type: m[1], args: parseCommandArgs(m[2]) });
    lastIdx = m.index + m[0].length;
  }
  plain += text.slice(lastIdx);
  return { plain: plain.replace(/\n{3,}/g, '\n\n').trim(), commands };
}

function buildParas(plain: string): Para[] {
  const blocks = plain.split(/\n\n+/).map(b => b.replace(/\n/g, ' ').trim()).filter(Boolean);
  const paras: Para[] = [];
  let wc = 0;
  for (const text of blocks) {
    const count = text.split(/\s+/).filter(Boolean).length;
    paras.push({ text, wordStart: wc, wordEnd: wc + count });
    wc += count;
  }
  return paras;
}

function findPara(paras: Para[], wordIdx: number): number {
  for (let i = paras.length - 1; i >= 0; i--) {
    if (wordIdx >= paras[i].wordStart) return i;
  }
  return 0;
}

function findAudioWord(words: AudioWord[], time: number): number {
  let lo = 0, hi = words.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= time) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

function findCharWord(tokens: { startChar: number }[], ci: number): number {
  let lo = 0, hi = tokens.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tokens[mid].startChar <= ci) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

function wordWindow(words: string[], current: number, size = 16) {
  const half = Math.floor(size / 2);
  const start = Math.max(0, current - half);
  const end = Math.min(words.length, start + size);
  return { slice: words.slice(start, end), offset: current - start };
}

// Build a fingerprint-based map: para index → best-matching DOM element.
// Positional matching breaks on code blocks, tables, nested blockquotes;
// text fingerprinting is robust across markdown complexity.
function buildParaElMap(paras: Para[], domParas: Element[]): Map<number, Element> {
  const map = new Map<number, Element>();
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const precomputed = domParas.map(el => normalize(el.textContent ?? ''));

  for (let i = 0; i < paras.length; i++) {
    const fp = normalize(paras[i].text.split(/\s+/).slice(0, 7).join(' '));
    if (!fp) continue;
    let best = -1, bestLen = 0;
    for (let j = 0; j < precomputed.length; j++) {
      if (precomputed[j].includes(fp) && fp.length > bestLen) {
        best = j; bestLen = fp.length;
      }
    }
    if (best >= 0) map.set(i, domParas[best]);
  }
  return map;
}

// Wrap text nodes in a DOM element with <span class="sg-word"> per word.
// Returns the span array. Preserves existing element children (links, code).
function wrapParaWords(el: Element): HTMLElement[] {
  const spans: HTMLElement[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);
  for (const tn of textNodes) {
    const parts = (tn.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (/^\s*$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
      const span = document.createElement('span');
      span.className = 'sg-word';
      span.textContent = part;
      frag.appendChild(span);
      spans.push(span);
    }
    tn.parentNode?.replaceChild(frag, tn);
  }
  return spans;
}

const CSS_ID = 'sg-presenter-styles';
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const style = document.createElement('style');
  style.id = CSS_ID;
  style.textContent = `
    article.sg-on .sg-live {
      position: relative;
      z-index: 41;
      outline: 2px solid rgba(245,158,11,0.55);
      outline-offset: 14px;
      border-radius: 6px;
      background: rgba(245,158,11,0.06);
      box-shadow:
        0 0 0 16px rgba(245,158,11,0.04),
        0 0 60px rgba(245,158,11,0.20),
        0 0 120px rgba(245,158,11,0.10);
    }
    article .sg-word-live {
      color: rgb(252,211,77);
      background: rgba(245,158,11,0.28);
      border-radius: 2px;
      padding: 0 2px;
      margin: 0 -2px;
    }
    article .sg-highlight {
      background: rgba(245,158,11,0.18);
      outline: 1px solid rgba(245,158,11,0.45);
      outline-offset: 3px;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Stagehand({ body, audioSrc, wordsSrc }: StagehandProps) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [presentMode, setPresentMode] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [currentParaIdx, setCurrentParaIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [diagramSrc, setDiagramSrc] = useState('');

  const [audioWords, setAudioWords] = useState<AudioWord[]>([]);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioWordsRef = useRef<AudioWord[]>([]);   // stable ref for RAF loop

  const presentModeRef = useRef(false);

  const wsTokensRef = useRef<{ word: string; startChar: number }[]>([]);
  const wsTextRef = useRef('');

  const parasRef = useRef<Para[]>([]);
  const domParasRef = useRef<Element[]>([]);
  const paraElMapRef = useRef<Map<number, Element>>(new Map());
  const articleRef = useRef<Element | null>(null);
  const prevParaIdxRef = useRef(-1);

  // In-article word highlighting
  const activeParaElRef = useRef<Element | null>(null);
  const activeParaOrigHTMLRef = useRef('');
  const activeWordSpansRef = useRef<HTMLElement[]>([]);
  const prevWordSpanIdxRef = useRef(-1);

  const commandsRef = useRef<StageCommand[]>([]);
  const firedCommandsRef = useRef<Set<number>>(new Set());
  const manualFocusRef = useRef(false);
  const highlightedElsRef = useRef<Set<Element>>(new Set());

  const rafRef = useRef<number | null>(null);
  // Stable ref so the RAF loop always calls the latest updatePosition
  const updatePositionRef = useRef<(wi: number, p: number) => void>(() => {});

  // ── Init ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const { plain, commands } = extractStage(body);
    commandsRef.current = commands;
    wsTextRef.current = plain;

    const tokens: { word: string; startChar: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(plain)) !== null) tokens.push({ word: m[0], startChar: m.index });
    wsTokensRef.current = tokens;

    parasRef.current = buildParas(plain);

    if (wordsSrc) {
      fetch(wordsSrc)
        .then(r => (r.ok ? r.json() : null))
        .then((words: AudioWord[] | null) => {
          if (words?.length) {
            audioWordsRef.current = words;
            setAudioWords(words);
            setHasAudio(true);
          }
        })
        .catch(() => {});
    }

    const article = document.querySelector('article');
    if (article) {
      articleRef.current = article;
      domParasRef.current = Array.from(article.querySelectorAll('p, li, blockquote, h2, h3'));
      paraElMapRef.current = buildParaElMap(parasRef.current, domParasRef.current);
    }

    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
      if (article) article.classList.remove('sg-on');
      cleanupWordWrap();
    };
  }, [body, wordsSrc]);

  // ── RAF timing loop (60fps vs ontimeupdate's ~4fps) ─────────────────────

  useEffect(() => {
    if (playState !== 'playing' || !hasAudio) return;

    const loop = () => {
      const el = audioRef.current;
      if (!el) return;
      const words = audioWordsRef.current;
      if (words.length) {
        const t = el.currentTime;
        const p = isFinite(el.duration) && el.duration > 0
          ? Math.round((t / el.duration) * 100) : 0;
        updatePositionRef.current(findAudioWord(words, t), p);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [playState, hasAudio]);

  // ── Word wrap cleanup ────────────────────────────────────────────────────

  function cleanupWordWrap() {
    if (activeParaElRef.current && activeParaOrigHTMLRef.current) {
      activeParaElRef.current.innerHTML = activeParaOrigHTMLRef.current;
    }
    activeParaElRef.current = null;
    activeParaOrigHTMLRef.current = '';
    activeWordSpansRef.current = [];
    prevWordSpanIdxRef.current = -1;
  }

  // ── Spotlight ────────────────────────────────────────────────────────────

  const spotlightPara = useCallback((paraIdx: number) => {
    if (!presentModeRef.current) return;
    const prev = prevParaIdxRef.current;
    if (prev === paraIdx) return;
    prevParaIdxRef.current = paraIdx;

    const prevEl = prev >= 0 ? paraElMapRef.current.get(prev) : null;
    const nextEl = paraIdx >= 0 ? paraElMapRef.current.get(paraIdx) : null;

    if (prevEl) prevEl.classList.remove('sg-live');
    if (nextEl) {
      nextEl.classList.add('sg-live');
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    injectCSS();
    const article = articleRef.current;
    if (!article) return;
    const active = presentMode && playState !== 'idle';
    if (active) {
      article.classList.add('sg-on');
      paraElMapRef.current.forEach(el => el.classList.remove('sg-live'));
      const el = paraElMapRef.current.get(currentParaIdx);
      if (el) el.classList.add('sg-live');
    } else {
      article.classList.remove('sg-on');
      paraElMapRef.current.forEach(el => el.classList.remove('sg-live'));
      prevParaIdxRef.current = -1;
      cleanupWordWrap();
    }
  }, [presentMode, playState, currentParaIdx]);

  // ── Commands ─────────────────────────────────────────────────────────────

  const executeCommand = useCallback((cmd: StageCommand) => {
    switch (cmd.type) {
      case 'focus': {
        const idx = parseInt(cmd.args.para ?? '1', 10) - 1;
        manualFocusRef.current = true;
        spotlightPara(idx);
        break;
      }
      case 'focus.off': case 'auto': {
        manualFocusRef.current = false;
        break;
      }
      case 'highlight': {
        const needle = cmd.args.text ?? '';
        if (!needle) break;
        for (const el of domParasRef.current) {
          if (el.textContent?.includes(needle)) {
            el.classList.add('sg-highlight');
            highlightedElsRef.current.add(el);
            break;
          }
        }
        break;
      }
      case 'highlight.off': {
        const needle = cmd.args.text ?? '';
        if (needle) {
          for (const el of highlightedElsRef.current) {
            if (el.textContent?.includes(needle)) {
              el.classList.remove('sg-highlight');
              highlightedElsRef.current.delete(el);
              break;
            }
          }
        } else {
          for (const el of highlightedElsRef.current) el.classList.remove('sg-highlight');
          highlightedElsRef.current.clear();
        }
        break;
      }
      case 'clear': {
        manualFocusRef.current = false;
        for (const el of highlightedElsRef.current) el.classList.remove('sg-highlight');
        highlightedElsRef.current.clear();
        break;
      }
      case 'diagram': { setDiagramSrc(cmd.args.src ?? ''); break; }
      case 'diagram.off': { setDiagramSrc(''); break; }
    }
  }, [spotlightPara]);

  // ── Position update (called 60fps from RAF or on Web Speech boundary) ────

  const updatePosition = useCallback((wordIdx: number, prog: number) => {
    setCurrentWordIdx(wordIdx);
    setProgress(prog);
    const paraIdx = findPara(parasRef.current, wordIdx);
    setCurrentParaIdx(paraIdx);

    if (!manualFocusRef.current) spotlightPara(paraIdx);

    // Fire commands
    for (const cmd of commandsRef.current) {
      if (cmd.wordIdx <= wordIdx && !firedCommandsRef.current.has(cmd.wordIdx)) {
        firedCommandsRef.current.add(cmd.wordIdx);
        executeCommand(cmd);
      }
    }

    // Inline word highlight (presenter mode only)
    if (presentModeRef.current) {
      const domEl = paraElMapRef.current.get(paraIdx) ?? null;
      if (domEl !== activeParaElRef.current) {
        // Restore previous para
        if (activeParaElRef.current && activeParaOrigHTMLRef.current) {
          activeParaElRef.current.innerHTML = activeParaOrigHTMLRef.current;
        }
        // Wrap new para
        if (domEl) {
          activeParaOrigHTMLRef.current = domEl.innerHTML;
          activeWordSpansRef.current = wrapParaWords(domEl);
          prevWordSpanIdxRef.current = -1;
        }
        activeParaElRef.current = domEl;
      }

      const para = parasRef.current[paraIdx];
      if (para) {
        const relIdx = wordIdx - para.wordStart;
        const spans = activeWordSpansRef.current;
        if (prevWordSpanIdxRef.current >= 0 && spans[prevWordSpanIdxRef.current]) {
          spans[prevWordSpanIdxRef.current].classList.remove('sg-word-live');
        }
        if (relIdx >= 0 && relIdx < spans.length) {
          spans[relIdx].classList.add('sg-word-live');
          prevWordSpanIdxRef.current = relIdx;
        }
      }
    }
  }, [spotlightPara, executeCommand]);

  // Keep the ref current so the RAF loop never uses a stale closure
  useEffect(() => { updatePositionRef.current = updatePosition; }, [updatePosition]);

  // ── Audio ─────────────────────────────────────────────────────────────────

  const playAudio = useCallback(async () => {
    if (!audioSrc) return;
    if (!audioRef.current) {
      const el = new Audio(audioSrc);
      el.onended = () => {
        setPlayState('idle');
        setCurrentWordIdx(-1); setCurrentParaIdx(-1); setProgress(0);
        const article = articleRef.current;
        if (article) {
          article.classList.remove('sg-on');
          paraElMapRef.current.forEach(e => e.classList.remove('sg-live'));
        }
        prevParaIdxRef.current = -1;
        cleanupWordWrap();
      };
      audioRef.current = el;
    }
    await audioRef.current.play();
    setPlayState('playing');
  }, [audioSrc]);

  // ── Web Speech fallback ───────────────────────────────────────────────────

  const startWebSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = wsTextRef.current;
    const tokens = wsTokensRef.current;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.onboundary = (ev) => {
      if (ev.name !== 'word') return;
      updatePositionRef.current(findCharWord(tokens, ev.charIndex), Math.round((ev.charIndex / text.length) * 100));
    };
    utt.onend = () => {
      setPlayState('idle');
      setCurrentWordIdx(-1); setCurrentParaIdx(-1); setProgress(0);
      prevParaIdxRef.current = -1;
      cleanupWordWrap();
    };
    window.speechSynthesis.speak(utt);
    setPlayState('playing');
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (hasAudio) playAudio(); else startWebSpeech();
  }, [hasAudio, playAudio, startWebSpeech]);

  const pause = () => {
    if (hasAudio && audioRef.current) audioRef.current.pause();
    else window.speechSynthesis?.pause();
    setPlayState('paused');
  };

  const resume = () => {
    if (hasAudio && audioRef.current) audioRef.current.play();
    else window.speechSynthesis?.resume();
    setPlayState('playing');
  };

  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    window.speechSynthesis?.cancel();
    setPlayState('idle');
    setCurrentWordIdx(-1); setCurrentParaIdx(-1); setProgress(0);
    prevParaIdxRef.current = -1;
    presentModeRef.current = false;
    setPresentMode(false);
    setDiagramSrc('');
    firedCommandsRef.current.clear();
    manualFocusRef.current = false;
    for (const el of highlightedElsRef.current) el.classList.remove('sg-highlight');
    highlightedElsRef.current.clear();
    cleanupWordWrap();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const displayWords = hasAudio ? audioWords.map(w => w.word) : wsTokensRef.current.map(t => t.word);
  const { slice: windowWords, offset: hi } = currentWordIdx >= 0
    ? wordWindow(displayWords, currentWordIdx) : { slice: [], offset: -1 };
  const overlayActive = presentMode && playState !== 'idle';

  return (
    <>
      {/* Full-page dark overlay at z-40 via body portal */}
      {typeof document !== 'undefined' && createPortal(
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          background: 'rgba(4,4,14,0.86)',
          zIndex: 40, pointerEvents: 'none',
          opacity: overlayActive ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }} />,
        document.body
      )}

      {/* Diagram overlay */}
      {diagramSrc && (
        <div className="fixed inset-0 z-[52] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setDiagramSrc('')}>
          <img src={diagramSrc} alt="Stage diagram"
            className="max-w-[82vw] max-h-[82vh] rounded-lg shadow-2xl border border-[#2a2a3a]" />
          <button className="absolute top-4 right-4 text-[#aaa] text-sm font-mono hover:text-white"
            onClick={() => setDiagramSrc('')}>✕ close</button>
        </div>
      )}

      {/* Idle controls */}
      {playState === 'idle' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={play}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono
              bg-[#1a1a2e] border border-[#2a2a3a] text-amber-400/70
              hover:border-amber-400/40 hover:text-amber-400 transition-colors">
            ▶ {hasAudio ? 'Play narration' : 'Read aloud'}
          </button>
          {hasAudio && (
            <button onClick={() => { presentModeRef.current = true; setPresentMode(true); play(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono
                bg-amber-400/10 border border-amber-400/30 text-amber-400
                hover:bg-amber-400/20 transition-colors">
              ◈ Present
            </button>
          )}
        </div>
      )}

      {/* Active controls bar */}
      {playState !== 'idle' && (
        <div role="status" aria-live="polite"
          className="fixed bottom-0 left-0 right-0 bg-[#080810]/97 backdrop-blur-md
            border-t border-[#2a2a3a] shadow-2xl"
          style={{ zIndex: 51, paddingBottom: 'env(safe-area-inset-bottom)' }}>

          <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 pt-3 pb-3">
            <button onClick={playState === 'playing' ? pause : resume}
              className="text-amber-400 text-sm font-mono hover:text-amber-300 transition-colors w-20 shrink-0">
              {playState === 'playing' ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={stop}
              className="text-[#555] text-sm font-mono hover:text-[#999] transition-colors shrink-0">
              ■ Stop
            </button>

            {hasAudio && (
              <button
                onClick={() => { presentModeRef.current = !presentModeRef.current; setPresentMode(p => !p); }}
                className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors shrink-0 ${
                  presentMode ? 'border-amber-400/60 text-amber-400 bg-amber-400/10' : 'border-[#333] text-[#555] hover:text-[#999]'
                }`}>
                {presentMode ? '◈ Stage ON' : '◈ Stage'}
              </button>
            )}

            <div className="flex-1 h-0.5 bg-[#1e1e2e] rounded overflow-hidden mx-1">
              <div className="h-full bg-amber-400/60 transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-[#444] font-mono tabular-nums w-8 text-right shrink-0">{progress}%</span>
          </div>

          {/* Teleprompter — shown in reader mode only; presenter mode highlights words inline */}
          {!presentMode && (
            <div className="max-w-4xl mx-auto px-4 pb-3 text-sm leading-relaxed text-[#666] font-mono select-none tracking-wide" aria-hidden="true">
              {windowWords.map((w, i) => (
                <span key={i} className={i === hi
                  ? 'text-amber-300 bg-amber-400/20 rounded px-0.5 mx-[2px] font-semibold'
                  : 'mx-[2px]'}>{w}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {playState !== 'idle' && <div className="h-16" aria-hidden />}
    </>
  );
}
