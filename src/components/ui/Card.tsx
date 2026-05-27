import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  interactive?: boolean;
}

export const Card = ({
  padded = true,
  interactive = false,
  className = '',
  style,
  children,
  ...rest
}: CardProps) => (
  <div
    className={className}
    style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: '12px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      padding: padded ? '24px' : 0,
      cursor: interactive ? 'pointer' : 'default',
      transition: interactive ? 'box-shadow 0.2s ease' : undefined,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({
  className = '',
  style,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{
      padding: '16px 24px',
      borderBottom: '1px solid var(--color-outline-variant)',
      backgroundColor: 'var(--color-surface-container-low)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const CardBody = ({
  className = '',
  style,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{ padding: '24px', ...style }}
    {...rest}
  >
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  style,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{
      padding: '16px 24px',
      borderTop: '1px solid var(--color-outline-variant)',
      backgroundColor: 'var(--color-surface-container-low)',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);
