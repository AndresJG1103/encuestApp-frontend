"use client";

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '8px',
        color: 'var(--color-on-surface-variant)',
        transition: 'all 0.2s ease',
        backgroundColor: 'var(--color-surface-container-low)'
      }}
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
};
