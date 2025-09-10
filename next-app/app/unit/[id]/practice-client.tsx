'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/components/ToastProvider';
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
  const [showFeedback, setShowFeedback] = useState<null | 'success' | 'error'>(null);

  const shuffle = useCallback((array: Prompt[]) => {
    const arr = array.slice();
    let currentIndex = arr.length, randomIndex: number | undefined;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  }, []);

  const loadPrompt = useCallback((arr: Prompt[], idx: number) => {
    setPrompt(arr[idx]?.content ?? '');
    setAnswer(arr[idx]?.answer ?? '');
  }, []);

  const getPrompts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/prompts/${unitId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load prompts');
      const data: Prompt[] = await res.json();
      const shuffled = shuffle(data);
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
  }, [loadPrompt, shuffle, unitId]);

  useEffect(() => {
    getPrompts();
  }, [getPrompts]);

  const isValid = useCallback(() => {
    const reverse = promptIndex % 2 === 1;
    return reverse ? prompt === inputText : answer === inputText;
  }, [answer, inputText, prompt, promptIndex]);

  const next = useCallback(() => {
    const idx = promptIndex + 1;
    if (idx >= prompts.length) {
      setDone(true);
      setInputText('');
      return;
    }
    setPromptIndex(idx);
    loadPrompt(prompts, idx);
    setInputText('');
  }, [loadPrompt, promptIndex, prompts]);

  const onSubmit = useCallback(() => {
    if (isValid()) {
      setShowFeedback('success');
      setTimeout(() => { setShowFeedback(null); next(); }, 600);
    } else {
      setInvalid(true);
      setShowFeedback('error');
      setTimeout(() => { setShowFeedback(null); setInvalid(false); }, 500);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isValid, next]);

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
      await getPrompts();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create prompt');
    } finally {
      setCreating(false);
    }
  }, [getPrompts, newAnswer, newContent, unitId, toast]);

  if (loading) return <div className="screen"><div className="center-panel"><p className="muted">Loading prompts…</p></div></div>;
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
            <button className="button button--primary button--lg" disabled={creating || !newContent || !newAnswer} onClick={addPrompt}>{creating ? 'Adding…' : 'Add'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="progress progress--header" aria-hidden>
        {Math.min(promptIndex + 1, prompts.length)} / {prompts.length}
      </div>
      <div className="center-panel">
        {done ? (
          <div>
            <p>Great job! You finished this unit.</p>
            <div className="actions" style={{ marginTop: 12, maxWidth: 360 }}>
              <button className="button button--primary button--lg" onClick={() => { setDone(false); setPromptIndex(0); loadPrompt(prompts, 0); setInputText(''); }}>Restart</button>
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
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
          />
          <button className="button button--primary button--lg" onClick={onSubmit}>Submit</button>
        </div>
      </div>
      <Feedback
        open={!!showFeedback}
        type={showFeedback === 'success' ? 'success' : 'error'}
        title={showFeedback === 'success' ? 'Correct!' : 'Try again'}
        onClose={() => setShowFeedback(null)}
      />
    </div>
  );
}
