'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { useProgress } from '@/components/ProgressProvider';
import { useScriptDirection } from '@/components/ScriptDirectionProvider';
import Feedback from '@/components/Feedback';

type Prompt = { content: string; answer: string; notes?: string | null };

export default function PracticeClient({ unitId }: { unitId: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptIndex, setPromptIndex] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [notes, setNotes] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const { reverse } = useScriptDirection(); // false: Script -> Roman, true: Roman -> Script
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const [showFeedback, setShowFeedback] = useState<null | 'success' | 'error' | 'reveal'>(null);
  const [revealText, setRevealText] = useState<string>('');
  const { set: setProgress, clear: clearProgress } = useProgress();

  const router = useRouter();

  const loadPrompt = useCallback((arr: Prompt[], idx: number) => {
    setPrompt(arr[idx]?.content ?? '');
    setAnswer(arr[idx]?.answer ?? '');
    setNotes(arr[idx]?.notes ?? null);
  }, []);

  const fetchPromptsData = useCallback(async (): Promise<Prompt[]> => {
    const res = await fetch(`/api/prompts/${unitId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load prompts');
    const data: Prompt[] = await res.json();
    return data;
  }, [unitId]);

  const reloadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPromptsData();
      setPrompts(data);
      setPromptIndex(data.length > 0 ? 0 : -1);
      if (data.length > 0) {
        setDone(false);
        loadPrompt(data, 0);
      } else {
        setNotes(null);
      }
      try {
        localStorage.removeItem(`unit-progress:${unitId}`);
        localStorage.removeItem(`unit-prompts:${unitId}`);
      } catch {
        // ignore
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load prompts');
    } finally {
      setLoading(false);
      setInputText('');
    }
  }, [fetchPromptsData, loadPrompt, unitId]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPromptsData();
        if (!alive) return;
        setPrompts(data);
        try { localStorage.removeItem(`unit-prompts:${unitId}`); } catch { /* cleanup old data */ }
        let idx = data.length > 0 ? 0 : -1;
        let doneFromStorage = false;
        try {
          const raw = localStorage.getItem(`unit-progress:${unitId}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.current === 'number') {
              const stored = Math.floor(parsed.current);
              if (stored >= data.length) {
                doneFromStorage = true;
                idx = Math.max(data.length - 1, 0);
              } else if (stored > 0) {
                idx = Math.min(stored - 1, data.length - 1);
              }
            }
          }
        } catch { /* ignore */ }
        setPromptIndex(idx);
        if (doneFromStorage) {
          setDone(true);
        } else if (idx >= 0) {
          setDone(false);
          loadPrompt(data, idx);
        } else {
          setNotes(null);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load prompts');
      } finally {
        if (!alive) return;
        setLoading(false);
        setInputText('');
      }
    })();
    return () => { alive = false; };
  }, [fetchPromptsData, loadPrompt, unitId]);

  // keep header progress in sync
  useEffect(() => {
    if (loading) {
      return () => { clearProgress(); };
    }
    const total = prompts.length;
    const current = done ? total : (promptIndex >= 0 ? promptIndex + 1 : 0);
    setProgress(current, total);
    try {
      const key = `unit-progress:${unitId}`;
      if (!total || current <= 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify({ current, total }));
      }
    } catch {
      // ignore
    }
    return () => { /* on unmount */ clearProgress(); };
  }, [loading, done, promptIndex, prompts.length, unitId, setProgress, clearProgress]);

  // Dynamic viewport height for mobile browsers
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      root.style.setProperty('--app-h', `${vh}px`);
    };
    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  const nativeNorm = useCallback((s: string) => s.normalize('NFKC').trim(), []);
  const romanNorm = useCallback((s: string) => s.normalize('NFKC').trim().toLowerCase().replace(/[^a-z0-9]/g, ''), []);
  const isValid = useCallback(() => {
    if (reverse) {
      // User types the native script
      return nativeNorm(prompt) === nativeNorm(inputText);
    }
    // User types the romanization; ignore spaces, hyphens, punctuation
    return romanNorm(answer) === romanNorm(inputText);
  }, [answer, inputText, nativeNorm, romanNorm, prompt, reverse]);

  const next = useCallback(() => {
    const idx = promptIndex + 1;
    if (idx >= prompts.length) {
      setDone(true);
      setInputText('');
      setRevealText('');
      setNotes(null);
      return;
    }
    setPromptIndex(idx);
    loadPrompt(prompts, idx);
    setInputText('');
    setRevealText('');
  }, [loadPrompt, promptIndex, prompts]);

  const onSubmit = useCallback(() => {
    if (showFeedback) return; // guard while popup open
    if (isValid()) {
      setShowFeedback('success');
    } else {
      setInvalid(true);
      setShowFeedback('error');
      setTimeout(() => setInvalid(false), 340);
    }
  }, [isValid, showFeedback]);

  const shown = useMemo(() => (reverse ? answer : prompt), [answer, prompt, reverse]);

  const buildFeedbackDetails = useCallback((resolvedAnswer: string) => {
    const noteLines = (notes ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
    return (
      <div className="feedback-details">
        <div className="feedback-line"><strong>Answer:</strong> {resolvedAnswer}</div>
        {noteLines.map((line, idx) => {
          const [label, ...rest] = line.split(':');
          if (rest.length === 0) {
            return <div key={`${idx}-${line}`} className="feedback-line">{line}</div>;
          }
          return (
            <div key={`${idx}-${label.trim()}`} className="feedback-line">
              <strong>{`${label.trim()}:`}</strong> {rest.join(':').trim()}
            </div>
          );
        })}
      </div>
    );
  }, [notes]);

  const feedbackMessage = useMemo(() => {
    if (showFeedback === 'success') {
      return buildFeedbackDetails(reverse ? prompt : answer);
    }
    if (showFeedback === 'reveal') {
      const resolved = revealText || (reverse ? prompt : answer);
      return buildFeedbackDetails(resolved);
    }
    return null;
  }, [showFeedback, buildFeedbackDetails, reverse, prompt, answer, revealText]);

  // Create prompt form (optional, for quick authoring)
  const [newContent, setNewContent] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [creating, setCreating] = useState(false);

  const addPrompt = useCallback(async () => {
    if (!newContent || !newAnswer) return;
    try {
      setCreating(true);
      const res = await fetch('/api/create/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, content: newContent, answer: newAnswer }),
      });
      if (!res.ok) throw new Error('Failed to create prompt');
      setNewContent('');
      setNewAnswer('');
      await reloadPrompts();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create prompt');
    } finally {
      setCreating(false);
    }
  }, [reloadPrompts, newAnswer, newContent, unitId, toast]);

  if (loading) {
    return (
      <div className="screen" aria-busy>
        <div className="center-panel">
          <div className="loading-placeholder" aria-label="Loading prompts">
            <div className="skeleton skeleton--prompt" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </div>
        <div className="bottom-bar">
          <div className="bottom-inner">
            <div className="skeleton skeleton--input" />
            <div className="skeleton skeleton--button" />
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="screen"><div className="center-panel"><p className="muted" style={{ color: 'crimson' }}>{error}</p></div></div>;
  if (prompts.length === 0) {
    return (
      <div className="screen">
        <div className="center-panel">
          <p className="muted">No prompts yet. Add one below.</p>
        </div>
        <div className="bottom-bar">
          <div className="bottom-inner">
            <input className="input input--lg" placeholder="Script (native)" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            <button className="button button--ghost button--lg" disabled>+ Prompt</button>
            <input className="input input--lg" placeholder="Roman (latin)" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
            <button className="button button--primary button--lg" disabled={creating || !newContent || !newAnswer} onClick={addPrompt}>{creating ? 'Adding...' : 'Add'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="center-panel">
        {done ? (
          <div>
            <p>Great job! You finished this unit.</p>
            <div className="actions" style={{ marginTop: 12 }}>
              <button
                className="button button--primary button--lg"
                onClick={() => router.back()}
              >
                Back
              </button>
              <button
                className="button button--ghost button--lg"
                onClick={() => {
                  setDone(false);
                  setPromptIndex(0);
                  loadPrompt(prompts, 0);
                  setInputText('');
                }}
              >
                Restart
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="prompt">{shown}</div>
          </div>
        )}
      </div>
      {!done && (
        <div className="bottom-bar">
          <div className="bottom-inner">
            <input
              ref={inputRef}
              className={`input input--lg ${invalid ? 'input--error shake' : ''}`}
              autoFocus
              placeholder={reverse ? 'Type the script' : 'Type the romanization'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inputText) onSubmit(); }}
            />
            <button className="button button--primary button--lg" disabled={!inputText} onClick={onSubmit}>Submit</button>
          </div>
        </div>
      )}
      <Feedback
        open={!!showFeedback}
        type={showFeedback === 'success' ? 'success' : showFeedback === 'reveal' ? 'info' : 'error'}
        title={showFeedback === 'success' ? 'Correct!' : showFeedback === 'reveal' ? 'Answer' : 'Incorrect'}
        message={feedbackMessage ?? undefined}
        label={showFeedback === 'success' ? 'Next' : showFeedback === 'reveal' ? 'Continue' : 'Try Again'}
        secondaryLabel={showFeedback === 'success' || showFeedback === 'reveal' ? undefined : 'Skip'}
        onClose={() => {
          if (showFeedback === 'success') {
            setShowFeedback(null);
            next();
          } else if (showFeedback === 'reveal') {
            setShowFeedback(null);
            next();
          } else {
            setShowFeedback(null);
            setInvalid(false);
            if (inputRef.current) inputRef.current.focus();
          }
        }}
        onSecondary={showFeedback === 'success' || showFeedback === 'reveal' ? undefined : () => {
          const expected = reverse ? prompt : answer;
          setRevealText(expected);
          setShowFeedback('reveal');
        }}
      />
    </div>
  );
}









