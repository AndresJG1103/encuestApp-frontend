import React from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: string;
}

const toneStyle = (t: Tone): React.CSSProperties => {
  switch (t) {
    case 'neutral':
      return {
        background: 'var(--color-surface-container-high)',
        color: 'var(--color-on-surface-variant)',
      };
    case 'success':
      return {
        background: 'var(--color-secondary-container)',
        color: 'var(--color-on-secondary-container)',
      };
    case 'warning':
      return {
        background: 'var(--color-tertiary-container)',
        color: 'var(--color-on-tertiary-container)',
      };
    case 'danger':
      return {
        background: 'var(--color-error-container)',
        color: 'var(--color-on-error-container)',
      };
    case 'info':
      return {
        background: 'var(--color-primary-container)',
        color: 'var(--color-on-primary-container)',
      };
    case 'primary':
      return {
        background: 'var(--color-primary)',
        color: 'var(--color-on-primary)',
      };
  }
};

export const Badge = ({
  tone = 'neutral',
  icon,
  style,
  children,
  ...rest
}: BadgeProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 600,
      ...toneStyle(tone),
      ...style,
    }}
    {...rest}
  >
    {icon && (
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        {icon}
      </span>
    )}
    {children}
  </span>
);
