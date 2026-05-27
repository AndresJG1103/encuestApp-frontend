import React from 'react';

export const Table = ({
  className = '',
  children,
  ...rest
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto">
    <table className={`w-full text-left border-collapse ${className}`} {...rest}>
      {children}
    </table>
  </div>
);

export const THead = ({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={`bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider ${className}`}
    {...rest}
  >
    {children}
  </thead>
);

export const TBody = ({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className} {...rest}>
    {children}
  </tbody>
);

export const TR = ({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b border-outline-variant ${className}`} {...rest}>
    {children}
  </tr>
);

export const TH = ({
  className = '',
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-6 py-4 ${className}`} {...rest}>
    {children}
  </th>
);

export const TD = ({
  className = '',
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 text-sm text-on-surface ${className}`} {...rest}>
    {children}
  </td>
);
