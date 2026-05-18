import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AudioWord {
  word: string;
  start: number;
  end: number;
}

interface Para {
  text: string;
  wordStart: number;
  wordEnd: number;
}

interface StageCommand {
  wordIdx: number;  // fire when current word index reaches this
  type: string;
  args: Record<string, string>;
}

interface StagehandProps {
  body: string;
  audioSrc?: string;
  wordsSrc?: string;
}

type PlayState = 'idle' | 'playing' | 'paused';

// ─── Parsers ─────────────────────────────────────────────────────────────────

function parseCommandArgs(raw: string): Record<string, string> {
  const args: Record<string, string> = {};
  // Handles key="value" and key=value
  const re = /(\w+)=(?:"([^"]*?)"|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) args[m[1]] = m[2] ?? m[3];
  return args;
}

// Strip markdown and extract [stage.*] commands with trigger word indices
function extractStage(md: string): { plain: string; commands: StageCommand[] } {
  // Standard markdown cleanup (leave [stage.*] in place for now)
  let text = md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // markdown links (not stage commands — they have no url)
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\|.+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^## Export[\s\S]*$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const commands: StageCommand[] = [];
  // type captures dotted names like "highlight.off", "focus.off"
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

// Build paragraph list with word index ranges
function buildParas(plain: string): Para[] {
  const blocks = plain.split(/\n\n+/).map(b => b.replace(/\n/g, ' ').trim()).filter(Boolean);
  const paras: Para[] = [];
  let wordCursor = 0;
  for (const text of blocks) {
    const count = text.split(/\s+/).filter(Boolean).length;
    paras.push({ text, wordStart: wordCursor, wordEnd: wordCursor + count });
    wordCursor += count;
  }
  return paras;
}

function findPara(paras: Para[], wordIdx: number): number {
  for (let i = paras.length - 1; i >= 0; i--) {
    if (wordIdx >= paras[i].wordStart) return i;
  }
  return 0;
}

// Binary search on Whisper timestamps
function findAudioWord(words: AudioWord[], time: number): number {
  let lo = 0, hi = words.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= time) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

// Binary search on char index (Web Speech fallback)
function findCharWord(tokens: { startChar: number }[], ci: number): number {
  let lo = 0, hi = tokens.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tokens[mid].startChar <= ci) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

// Word window for footer display
function wordWindow(words: string[], current: number, size = 16) {
  const half = Math.floor(size / 2);
  const start = Math.max(0, current - half);
  const end = Math.min(words.length, start + size);
  return { slice: words.slice(start, end), offset: current - start };
}

// Inject presenter CSS once
const CSS_ID = 'sg-presenter-styles';
function injectCSS() {
  if (document.getElementById(CSS_ID)) return;
  const style = document.createElement('style');
  style.id = CSS_ID;
  style.textContent = `
    article.sg-on > *:not(.sg-live) {
      opacity: 0.18;
      transition: opacity 0.35s ease;
    }
    article.sg-on .sg-live {
      opacity: 1;
      transition: opacity 0.35s ease;
      outline: 2px solid rgba(245,158,11,0.25);
      outline-offset: 8px;
      border-radius: 4px;
      background: rgba(245,158,11,0.04);
    }
    article.sg-on {
      transition: none;
    }
    article .sg-highlight {
      background: rgba(245,158,11,0.18);
      outline: 1px solid rgba(245,158,11,0.45);
      outline-offset: 3px;
      border-radius: 3px;
      transition: background 0.3s ease;
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

  // Audio file mode
  const [audioWords, setAudioWords] = useState<AudioWord[]>([]);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Web Speech fallback
  const wsTokensRef = useRef<{ word: string; startChar: number }[]>([]);
  const wsTextRef = useRef('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Paragraph map + DOM elements
  const parasRef = useRef<Para[]>([]);
  const domParasRef = useRef<Element[]>([]);
  const articleRef = useRef<Element | null>(null);
  const prevParaIdxRef = useRef(-1);

  // Command state
  const commandsRef = useRef<StageCommand[]>([]);
  const firedCommandsRef = useRef<Set<number>>(new Set());
  const manualFocusRef = useRef(false);       // true after [stage.focus], suppresses auto-tracking
  const highlightedElsRef = useRef<Set<Element>>(new Set());

  // ── Init ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const { plain, commands } = extractStage(body);
    commandsRef.current = commands;
    wsTextRef.current = plain;

    // Build WS tokens
    const tokens: { word: string; startChar: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(plain)) !== null) {
      tokens.push({ word: m[0], startChar: m.index });
    }
    wsTokensRef.current = tokens;

    parasRef.current = buildParas(plain);

    if (wordsSrc) {
      fetch(wordsSrc)
        .then(r => (r.ok ? r.json() : null))
        .then((words: AudioWord[] | null) => {
          if (words?.length) { setAudioWords(words); setHasAudio(true); }
        })
        .catch(() => {});
    }

    const article = document.querySelector('article');
    if (article) {
      articleRef.current = article;
      domParasRef.current = Array.from(
        article.querySelectorAll('p, li, blockquote, h2, h3')
      );
    }

    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
      if (article) article.classList.remove('sg-on');
    };
  }, [body, wordsSrc]);

  // ── Spotlight management ────────────────────────────────────────────────

  const spotlightPara = useCallback((paraIdx: number) => {
    if (!presentMode) return;
    const prev = prevParaIdxRef.current;
    if (prev === paraIdx) return;
    prevParaIdxRef.current = paraIdx;

    const domParas = domParasRef.current;
    if (prev >= 0 && domParas[prev]) domParas[prev].classList.remove('sg-live');
    if (paraIdx >= 0 && domParas[paraIdx]) {
      domParas[paraIdx].classList.add('sg-live');
      domParas[paraIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [presentMode]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    injectCSS();
    if (presentMode && playState !== 'idle') {
      article.classList.add('sg-on');
      const domParas = domParasRef.current;
      domParas.forEach(el => el.classList.remove('sg-live'));
      if (currentParaIdx >= 0 && domParas[currentParaIdx]) {
        domParas[currentParaIdx].classList.add('sg-live');
      }
    } else {
      article.classList.remove('sg-on');
      domParasRef.current.forEach(el => el.classList.remove('sg-live'));
      prevParaIdxRef.current = -1;
    }
  }, [presentMode, playState, currentParaIdx]);

  // ── Command execution ────────────────────────────────────────────────────

  const executeCommand = useCallback((cmd: StageCommand) => {
    switch (cmd.type) {
      case 'focus': {
        // [stage.focus para=3] — spotlight paragraph N (1-indexed), suppress auto-tracking
        const idx = parseInt(cmd.args.para ?? '1', 10) - 1;
        manualFocusRef.current = true;
        spotlightPara(idx);
        break;
      }
      case 'focus.off':
      case 'auto': {
        // [stage.focus.off] — return to auto-tracking
        manualFocusRef.current = false;
        break;
      }
      case 'highlight': {
        // [stage.highlight text="some phrase"] — amber-highlight paragraph containing text
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
        // [stage.highlight.off text="..."] — remove highlight from specific text, or all if no text
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
        // [stage.clear] — remove all highlights and resume auto-tracking
        manualFocusRef.current = false;
        for (const el of highlightedElsRef.current) el.classList.remove('sg-highlight');
        highlightedElsRef.current.clear();
        break;
      }
      case 'diagram': {
        // [stage.diagram src="/diagrams/foo.png"] — show overlay image
        setDiagramSrc(cmd.args.src ?? '');
        break;
      }
      case 'diagram.off': {
        // [stage.diagram.off] — dismiss diagram overlay
        setDiagramSrc('');
        break;
      }
    }
  }, [spotlightPara]);

  // ── Word / para tracking ────────────────────────────────────────────────

  const updatePosition = useCallback((wordIdx: number, prog: number) => {
    setCurrentWordIdx(wordIdx);
    setProgress(prog);
    const paraIdx = findPara(parasRef.current, wordIdx);
    setCurrentParaIdx(paraIdx);

    if (!manualFocusRef.current) {
      spotlightPara(paraIdx);
    }

    // Fire any commands whose trigger word has been reached
    for (const cmd of commandsRef.current) {
      if (cmd.wordIdx <= wordIdx && !firedCommandsRef.current.has(cmd.wordIdx)) {
        firedCommandsRef.current.add(cmd.wordIdx);
        executeCommand(cmd);
      }
    }
  }, [spotlightPara, executeCommand]);

  // ── Audio element ───────────────────────────────────────────────────────

  const onTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el || !audioWords.length) return;
    const t = el.currentTime;
    const p = isFinite(el.duration) && el.duration > 0
      ? Math.round((t / el.duration) * 100) : 0;
    updatePosition(findAudioWord(audioWords, t), p);
  }, [audioWords, updatePosition]);

  const playAudio = useCallback(async () => {
    if (!audioSrc) return;
    if (!audioRef.current) {
      const el = new Audio(audioSrc);
      el.ontimeupdate = onTimeUpdate;
      el.onended = () => {
        setPlayState('idle');
        setCurrentWordIdx(-1);
        setCurrentParaIdx(-1);
        setProgress(0);
        const article = articleRef.current;
        if (article) {
          article.classList.remove('sg-on');
          domParasRef.current.forEach(el => el.classList.remove('sg-live'));
        }
        prevParaIdxRef.current = -1;
      };
      audioRef.current = el;
    }
    await audioRef.current.play();
    setPlayState('playing');
  }, [audioSrc, onTimeUpdate]);

  // ── Web Speech fallback ─────────────────────────────────────────────────

  const startWebSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = wsTextRef.current;
    const tokens = wsTokensRef.current;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92;
    utt.onboundary = (ev) => {
      if (ev.name !== 'word') return;
      const wi = findCharWord(tokens, ev.charIndex);
      updatePosition(wi, Math.round((ev.charIndex / text.length) * 100));
    };
    utt.onend = () => {
      setPlayState('idle');
      setCurrentWordIdx(-1);
      setCurrentParaIdx(-1);
      setProgress(0);
      prevParaIdxRef.current = -1;
    };
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setPlayState('playing');
  }, [updatePosition]);

  // ── Controls ────────────────────────────────────────────────────────────

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
    setCurrentWordIdx(-1);
    setCurrentParaIdx(-1);
    setProgress(0);
    prevParaIdxRef.current = -1;
    setPresentMode(false);
    setDiagramSrc('');
    // Reset command firing state
    firedCommandsRef.current.clear();
    manualFocusRef.current = false;
    for (const el of highlightedElsRef.current) el.classList.remove('sg-highlight');
    highlightedElsRef.current.clear();
  };

  // ── Render ──────────────────────────────────────────────────────────────

  const displayWords = hasAudio
    ? audioWords.map(w => w.word)
    : wsTokensRef.current.map(t => t.word);

  const { slice: windowWords, offset: hi } = currentWordIdx >= 0
    ? wordWindow(displayWords, currentWordIdx)
    : { slice: [], offset: -1 };

  return (
    <>
      {/* Diagram overlay */}
      {diagramSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setDiagramSrc('')}
        >
          <img
            src={diagramSrc}
            alt="Stage diagram"
            className="max-w-[82vw] max-h-[82vh] rounded-lg shadow-2xl border border-[#2a2a3a]"
          />
          <button
            className="absolute top-4 right-4 text-[#aaa] text-sm font-mono hover:text-white"
            onClick={() => setDiagramSrc('')}
          >
            ✕ close
          </button>
        </div>
      )}

      {/* Idle controls */}
      {playState === 'idle' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={play}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono
              bg-[#1a1a2e] border border-[#2a2a3a] text-amber-400/70
              hover:border-amber-400/40 hover:text-amber-400 transition-colors"
          >
            ▶ {hasAudio ? 'Play narration' : 'Read aloud'}
          </button>
          {hasAudio && (
            <button
              onClick={() => { setPresentMode(true); play(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono
                bg-amber-400/10 border border-amber-400/30 text-amber-400
                hover:bg-amber-400/20 transition-colors"
            >
              ◈ Present
            </button>
          )}
        </div>
      )}

      {/* Active controls bar */}
      {playState !== 'idle' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#080810]/97 backdrop-blur-md
            border-t border-[#2a2a3a] shadow-2xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Top controls row */}
          <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 pt-3 pb-2">
            <button
              onClick={playState === 'playing' ? pause : resume}
              className="text-amber-400 text-sm font-mono hover:text-amber-300 transition-colors w-20 shrink-0"
            >
              {playState === 'playing' ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={stop}
              className="text-[#555] text-sm font-mono hover:text-[#999] transition-colors shrink-0"
            >
              ■ Stop
            </button>

            {/* Present mode toggle */}
            {hasAudio && (
              <button
                onClick={() => setPresentMode(p => !p)}
                className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors shrink-0 ${
                  presentMode
                    ? 'border-amber-400/60 text-amber-400 bg-amber-400/10'
                    : 'border-[#333] text-[#555] hover:text-[#999]'
                }`}
              >
                {presentMode ? '◈ Stage ON' : '◈ Stage'}
              </button>
            )}

            {/* Progress bar */}
            <div className="flex-1 h-0.5 bg-[#1e1e2e] rounded overflow-hidden mx-1">
              <div
                className="h-full bg-amber-400/60 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#444] font-mono tabular-nums w-8 text-right shrink-0">
              {progress}%
            </span>
          </div>

          {/* Word teleprompter */}
          <div
            className="max-w-4xl mx-auto px-4 pb-3 text-sm leading-relaxed text-[#666]
              font-mono select-none tracking-wide"
            aria-hidden="true"
          >
            {windowWords.map((w, i) => (
              <span
                key={i}
                className={
                  i === hi
                    ? 'text-amber-300 bg-amber-400/20 rounded px-0.5 mx-[2px] font-semibold'
                    : 'mx-[2px]'
                }
              >
                {w}
              </span>
            ))}
            {presentMode && currentParaIdx >= 0 && (
              <span className="ml-3 text-[#333] text-xs">
                § {currentParaIdx + 1}
              </span>
            )}
          </div>
        </div>
      )}

      {playState !== 'idle' && <div className="h-20" aria-hidden />}
    </>
  );
}
