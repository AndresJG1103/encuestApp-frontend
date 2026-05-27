"use client";

import React from 'react';
import { Sidebar } from '../Sidebar';

interface PageLayoutProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const PageLayout = ({
  title,
  actions,
  children,
  maxWidth = '1200px',
}: PageLayoutProps) => (
  <div
    style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--color-background)',
    }}
  >
    <Sidebar />
    <main
      style={{
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {(title || actions) && (
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '64px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-outline-variant)',
          }}
        >
          {title && (
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--color-on-surface)',
                margin: 0,
              }}
            >
              {title}
            </h1>
          )}
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {actions}
            </div>
          )}
        </header>
      )}
      <div
        style={{
          padding: '32px',
          width: '100%',
          maxWidth,
          margin: '0 auto',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        {children}
      </div>
    </main>
  </div>
);
