"use client";

import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyle = (v: Variant): React.CSSProperties => {
  switch (v) {
    case 'primary':
      return {
        background: 'var(--color-primary)',
        color: 'var(--color-on-primary)',
        border: 'none',
      };
    case 'secondary':
      return {
        background: 'var(--color-surface-container-low)',
        color: 'var(--color-on-surface)',
        border: '1px solid var(--color-outline-variant)',
      };
    case 'danger':
      return {
        background: 'var(--color-error-container)',
        color: 'var(--color-on-error-container)',
        border: 'none',
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--color-on-surface-variant)',
        border: 'none',
      };
  }
};

const sizeStyle = (s: Size): React.CSSProperties => {
  switch (s) {
    case 'sm':
      return { padding: '6px 12px', fontSize: '12px', gap: '6px' };
    case 'md':
      return { padding: '8px 16px', fontSize: '14px', gap: '8px' };
    case 'lg':
      return { padding: '12px 24px', fontSize: '16px', gap: '8px' };
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const combinedStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      borderRadius: '8px',
      transition: 'opacity 0.15s ease, background 0.15s ease',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      ...variantStyle(variant),
      ...sizeStyle(size),
      ...style,
    };

    const renderIcon = (name: string) => (
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        {name}
      </span>
    );

    return (
      <button ref={ref} disabled={isDisabled} style={combinedStyle} {...rest}>
        {loading && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}
          >
            progress_activity
          </span>
        )}
        {!loading && icon && iconPosition === 'left' && renderIcon(icon)}
        {children}
        {!loading && icon && iconPosition === 'right' && renderIcon(icon)}
      </button>
    );
  },
);

Button.displayName = 'Button';
