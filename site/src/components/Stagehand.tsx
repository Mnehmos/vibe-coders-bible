import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AudioWord {
  word: string;
  start: number;
  end: number;
}

interface StagehandProps {
  body: string;       // raw markdown — used for Web Speech fallback text
  audioSrc?: string;  // URL to pre-generated .mp3
  wordsSrc?: string;  // URL to pre-generated .words.json (Whisper timestamps)
}

type PlayState = 'idle' | 'playing' | 'paused';

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripMarkdown(md: string): string {
  return md
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
}

function binarySearchWord(words: AudioWord[], time: number): number {
  let lo = 0, hi = words.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].start <= time) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

function binarySearchChar(
  tokens: { word: string; startChar: number }[],
  charIndex: number
): number {
  let lo = 0, hi = tokens.length - 1, found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tokens[mid].startChar <= charIndex) { found = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return found;
}

function wordWindow(
  words: string[],
  current: number,
  size = 14
): { slice: string[]; offset: number } {
  const half = Math.floor(size / 2);
  const start = Math.max(0, current - half);
  const end = Math.min(words.length, start + size);
  return { slice: words.slice(start, end), offset: current - start };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Stagehand({ body, audioSrc, wordsSrc }: StagehandProps) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [progress, setProgress] = useState(0);

  // Audio-file mode
  const [audioWords, setAudioWords] = useState<AudioWord[]>([]);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Web Speech fallback mode
  const wsTokensRef = useRef<{ word: string; startChar: number }[]>([]);
  const wsTextRef = useRef('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Initialisation ──────────────────────────────────────────────────────

  useEffect(() => {
    // Prepare fallback text regardless
    const plain = stripMarkdown(body);
    wsTextRef.current = plain;
    const tokens: { word: string; startChar: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(plain)) !== null) {
      tokens.push({ word: m[0], startChar: m.index });
    }
    wsTokensRef.current = tokens;

    // Try to load pre-generated audio timestamps
    if (wordsSrc) {
      fetch(wordsSrc)
        .then(r => (r.ok ? r.json() : null))
        .then((words: AudioWord[] | null) => {
          if (words && words.length > 0) {
            setAudioWords(words);
            setHasAudio(true);
          }
        })
        .catch(() => {});
    }

    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [body, wordsSrc]);

  // ── Audio-file playback ─────────────────────────────────────────────────

  const onTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (!el || audioWords.length === 0) return;
    const t = el.currentTime;
    const p = isFinite(el.duration) && el.duration > 0
      ? Math.round((t / el.duration) * 100)
      : 0;
    setProgress(p);
    setCurrentWordIdx(binarySearchWord(audioWords, t));
  }, [audioWords]);

  const playAudio = useCallback(async () => {
    if (!audioSrc) return;
    if (!audioRef.current) {
      const el = new Audio(audioSrc);
      el.ontimeupdate = onTimeUpdate;
      el.onended = () => {
        setPlayState('idle');
        setCurrentWordIdx(-1);
        setProgress(0);
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
      const idx = binarySearchChar(tokens, ev.charIndex);
      setCurrentWordIdx(idx);
      setProgress(Math.round((ev.charIndex / text.length) * 100));
    };
    utt.onend = () => {
      setPlayState('idle');
      setCurrentWordIdx(-1);
      setProgress(0);
    };

    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setPlayState('playing');
  }, []);

  // ── Controls ────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (hasAudio) playAudio();
    else startWebSpeech();
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setPlayState('idle');
    setCurrentWordIdx(-1);
    setProgress(0);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  const displayWords = hasAudio
    ? audioWords.map(w => w.word)
    : wsTokensRef.current.map(t => t.word);

  const { slice: windowWords, offset: highlightOffset } =
    currentWordIdx >= 0
      ? wordWindow(displayWords, currentWordIdx)
      : { slice: [], offset: -1 };

  const label = hasAudio ? '▶ Play narration' : '▶ Read aloud';

  return (
    <>
      {playState === 'idle' && (
        <button
          onClick={play}
          aria-label={hasAudio ? 'Play narration' : 'Read this chapter aloud'}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono
            bg-[#1a1a2e] border border-[#2a2a3a] text-amber-400/70
            hover:border-amber-400/40 hover:text-amber-400 transition-colors"
        >
          {label}
        </button>
      )}

      {playState !== 'idle' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/95 backdrop-blur-sm
            border-t border-[#2a2a3a] px-4 py-3 shadow-2xl"
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3 mb-2">
            <button
              onClick={playState === 'playing' ? pause : resume}
              className="text-amber-400 text-sm font-mono hover:text-amber-300 transition-colors w-20"
            >
              {playState === 'playing' ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={stop}
              className="text-[#555] text-sm font-mono hover:text-[#999] transition-colors"
            >
              ■ Stop
            </button>
            <div className="flex-1 h-0.5 bg-[#2a2a2a] rounded overflow-hidden">
              <div
                className="h-full bg-amber-400/70 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#555] font-mono tabular-nums w-8 text-right">
              {progress}%
            </span>
          </div>

          <div
            className="max-w-3xl mx-auto text-sm leading-relaxed text-[#888] font-mono select-none"
            aria-hidden="true"
          >
            {windowWords.map((w, i) => (
              <span
                key={i}
                className={
                  i === highlightOffset
                    ? 'text-amber-300 bg-amber-400/20 rounded px-0.5 mx-0.5'
                    : 'mx-0.5'
                }
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {playState !== 'idle' && <div className="h-24" aria-hidden />}
    </>
  );
}
