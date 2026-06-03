import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon = 'inbox',
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      gap: '12px',
    }}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontSize: '56px', color: 'var(--color-outline-variant)' }}
    >
      {icon}
    </span>
    <h3
      style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--color-on-surface)',
        margin: 0,
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-on-surface-variant)',
          maxWidth: '420px',
          margin: 0,
        }}
      >
        {description}
      </p>
    )}
    {action && <div style={{ marginTop: '8px' }}>{action}</div>}
  </div>
);
