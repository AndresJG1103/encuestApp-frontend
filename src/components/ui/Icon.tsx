import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  filled?: boolean;
}

export const Icon = ({ name, size = 20, filled = false, className = '', style, ...rest }: IconProps) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontSize: `${size}px`,
      fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      ...style,
    }}
    {...rest}
  >
    {name}
  </span>
);
