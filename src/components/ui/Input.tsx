"use client";

import React from 'react';

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const fieldWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-on-surface-variant)',
};

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-outline)',
  margin: 0,
};

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-error)',
  margin: 0,
};

const fieldStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${hasError ? 'var(--color-error)' : 'var(--color-outline-variant)'}`,
  background: 'var(--color-surface)',
  color: 'var(--color-on-surface)',
  outline: 'none',
  fontSize: '14px',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
});

export const FieldWrapper = ({
  label,
  hint,
  error,
  required,
  children,
}: FieldWrapperProps) => (
  <div style={fieldWrapperStyle}>
    {label && (
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--color-error)', marginLeft: 4 }}>*</span>}
      </label>
    )}
    {children}
    {error ? <p style={errorStyle}>{error}</p> : hint ? <p style={hintStyle}>{hint}</p> : null}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, required, style, ...rest }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <input
        ref={ref}
        required={required}
        style={{ ...fieldStyle(!!error), ...style }}
        {...rest}
      />
    </FieldWrapper>
  ),
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, rows = 4, style, ...rest }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        rows={rows}
        required={required}
        style={{ ...fieldStyle(!!error), resize: 'vertical', ...style }}
        {...rest}
      />
    </FieldWrapper>
  ),
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, style, children, ...rest }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          ref={ref}
          required={required}
          style={{
            ...fieldStyle(!!error),
            paddingRight: '36px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            cursor: 'pointer',
            ...style,
          }}
          {...rest}
        >
          {children}
        </select>
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--color-on-surface-variant)',
            fontSize: '20px',
          }}
        >
          expand_more
        </span>
      </div>
    </FieldWrapper>
  ),
);
Select.displayName = 'Select';
