import React from 'react';

interface SpinnerProps {
  size?: number;
  label?: string;
  fullScreen?: boolean;
}

export const Spinner = ({ size = 24, label, fullScreen = false }: SpinnerProps) => {
  const content = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'var(--color-on-surface-variant)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: `${size}px`, animation: 'spin 1s linear infinite' }}
      >
        progress_activity
      </span>
      {label && <span style={{ fontSize: '14px' }}>{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {content}
      </div>
    );
  }
  return <div style={{ padding: '40px 0', textAlign: 'center' }}>{content}</div>;
};
