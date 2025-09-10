'use client';

export default function Feedback({
  open,
  type,
  title,
  message,
  onClose,
}: {
  open: boolean;
  type: 'success' | 'error';
  title: string;
  message?: string;
  onClose?: () => void;
}) {
  if (!open) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className={`popup popup--${type}`}>
        <div className="popup__icon" aria-hidden>
          {type === 'success' ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <h3 id="feedback-title" className="popup__title">{title}</h3>
        {message ? <p className="popup__desc">{message}</p> : null}
        <div className="actions">
          <button className="button button--primary button--lg" onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
}

