"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
  confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmState({ message, resolve });
    });
  }, []);

  const handleConfirmAction = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}
      
      {/* Toasts Container */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{ 
            padding: '16px 24px', borderRadius: '12px', color: 'white', fontWeight: 600, fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', minWidth: '300px',
            backgroundColor: n.type === 'success' ? '#10b981' : n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#3b82f6',
            display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <span className="material-symbols-outlined">
              {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : n.type === 'warning' ? 'warning' : 'info'}
            </span>
            {n.message}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmState && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '32px', borderRadius: '20px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: '1px solid var(--color-outline-variant)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Confirmación</h3>
            <p style={{ margin: '0 0 32px 0', color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>{confirmState.message}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleConfirmAction(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleConfirmAction(true)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
