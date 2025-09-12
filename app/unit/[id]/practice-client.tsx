'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useProgress } from '@/components/ProgressProvider';
import Feedback from '@/components/Feedback';

type Prompt = { content: string; answer: string };

export default function PracticeClient({ unitId }: { unitId: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptIndex, setPromptIndex] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputText, setInputText] = useState('');
  // Alternate direction each prompt: even -> Script->Roman, odd -> Roman->Script
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const [showFeedback, setShowFeedback] = useState<null | 'success' | 'error' | 'reveal'>(null);
  const [revealText, setRevealText] = useState<string>('');
  const { set: setProgress, clear: clearProgress } = useProgress();
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const shuffle = useCallback((array: Prompt[], seed: string) => {
    const arr = array.slice();
    let s = 0;
    for (let i = 0; i < seed.length; i++) {
      s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    }
    const random = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const loadPrompt = useCallback((arr: Prompt[], idx: number) => {
    setPrompt(arr[idx]?.content ?? '');
    setAnswer(arr[idx]?.answer ?? '');
  }, []);

  useEffect(() => {
    setDeviceId(localStorage.getItem('deviceId'));
  }, []);

  const fetchPromptsData = useCallback(async (id: string): Promise<Prompt[]> => {
    const res = await fetch(`/api/prompts/${unitId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load prompts');
    const data: Prompt[] = await res.json();
    return shuffle(data, `${id}-${unitId}`);
  }, [shuffle, unitId]);

  const fetchProgress = useCallback(async (id: string) => {
    const res = await fetch(`/api/progress/${unitId}?deviceId=${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: { currentPrompt: number; completed: boolean } = await res.json();
    return data;
  }, [unitId]);

  const saveProgress = useCallback(async (idx: number, completed: boolean) => {
    if (!deviceId) return;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, unitId, currentPrompt: idx, completed }),
      });
    } catch {
      /* ignore */
    }
  }, [deviceId, unitId]);

  const reloadPrompts = useCallback(async () => {
    if (!deviceId) return;
    try {
      setLoading(true);
      setError(null);
      const shuffled = await fetchPromptsData(deviceId);
      setPrompts(shuffled);
      setPromptIndex(shuffled.length > 0 ? 0 : -1);
      if (shuffled.length > 0) {
        setDone(false);
        loadPrompt(shuffled, 0);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load prompts');
    } finally {
      setLoading(false);
      setInputText('');
    }
  }, [deviceId, fetchPromptsData, loadPrompt]);

  useEffect(() => {
    if (!deviceId) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const shuffled = await fetchPromptsData(deviceId);
        if (!alive) return;
        setPrompts(shuffled);
        const idx = shuffled.length > 0 ? 0 : -1;
        setPromptIndex(idx);
        if (idx === 0) {
          setDone(false);
          loadPrompt(shuffled, 0);
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
  }, [deviceId, fetchPromptsData, loadPrompt]);

  useEffect(() => {
    if (!deviceId || prompts.length === 0) return;
    let alive = true;
    (async () => {
      try {
        const progress = await fetchProgress(deviceId);
        if (!alive || !progress) return;
        setPromptIndex(progress.currentPrompt);
        setDone(progress.completed);
        if (!progress.completed && progress.currentPrompt < prompts.length) {
          loadPrompt(prompts, progress.currentPrompt);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => { alive = false; };
  }, [deviceId, prompts, fetchProgress, loadPrompt]);

  // keep header progress in sync
  useEffect(() => {
    const total = prompts.length;
    const current = done ? total : (promptIndex >= 0 ? promptIndex + 1 : 0);
    setProgress(current, total);
    return () => { /* on unmount */ clearProgress(); };
  }, [done, promptIndex, prompts.length, setProgress, clearProgress]);

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
    const reverse = promptIndex % 2 === 1;
    if (reverse) {
      // User types the native script
      return nativeNorm(prompt) === nativeNorm(inputText);
    }
    // User types the romanization; ignore spaces, hyphens, punctuation
    return romanNorm(answer) === romanNorm(inputText);
  }, [answer, inputText, nativeNorm, romanNorm, prompt, promptIndex]);

  const next = useCallback(() => {
    const idx = promptIndex + 1;
    if (idx >= prompts.length) {
      setDone(true);
      setInputText('');
      void saveProgress(prompts.length, true);
      return;
    }
    setPromptIndex(idx);
    loadPrompt(prompts, idx);
    setInputText('');
    void saveProgress(idx, false);
  }, [loadPrompt, promptIndex, prompts, saveProgress]);

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

  const shown = useMemo(() => (promptIndex % 2 === 1 ? answer : prompt), [answer, prompt, promptIndex]);

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

  if (loading) return <div className="screen"><div className="center-panel"><p className="muted">Loading prompts...</p></div></div>;
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
            <div className="actions" style={{ marginTop: 12, maxWidth: 360 }}>
              <button className="button button--primary button--lg" onClick={() => { setDone(false); setPromptIndex(0); loadPrompt(prompts, 0); setInputText(''); void saveProgress(0, false); }}>Restart</button>
            </div>
          </div>
        ) : (
          <div className="prompt">{shown}</div>
        )}
      </div>
      <div className="bottom-bar">
        <div className="bottom-inner">
          <input
            ref={inputRef}
            className={`input input--lg ${invalid ? 'input--error shake' : ''}`}
            autoFocus
            placeholder={promptIndex % 2 === 1 ? 'Type the script' : 'Type the romanization'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && inputText) onSubmit(); }}
          />
          <button className="button button--primary button--lg" disabled={!inputText} onClick={onSubmit}>Submit</button>
        </div>
      </div>
      <Feedback
        open={!!showFeedback}
        type={showFeedback === 'success' ? 'success' : showFeedback === 'reveal' ? 'info' : 'error'}
        title={showFeedback === 'success' ? 'Correct!' : showFeedback === 'reveal' ? 'Answer' : 'Incorrect'}
        message={showFeedback === 'reveal' ? revealText : undefined}
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
          const reverse = promptIndex % 2 === 1;
          const expected = reverse ? prompt : answer;
          setRevealText(expected);
          setShowFeedback('reveal');
        }}
      />
    </div>
  );
}
