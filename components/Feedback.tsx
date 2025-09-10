'use client';

export default function Feedback({
  open,
  type,
  title,
  message,
  label = 'Continue',
  secondaryLabel,
  onClose,
  onSecondary,
}: {
  open: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  label?: string;
  onClose?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
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
          ) : type === 'error' ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <h3 id="feedback-title" className="popup__title">{title}</h3>
        {message ? <p className="popup__desc">{message}</p> : null}
        <div className={`actions ${secondaryLabel ? '' : 'actions--single'}`}>
          <button className="button button--primary button--lg" onClick={onClose}>{label}</button>
          {secondaryLabel ? (
            <button className="button button--ghost button--lg" onClick={onSecondary}>{secondaryLabel}</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
