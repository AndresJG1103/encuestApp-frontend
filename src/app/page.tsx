"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardMetrics, DashboardMetrics } from '../services/analyticsService';
import { Sidebar } from '../components/Sidebar';

export default function Home() {
  const { logout } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar las métricas');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 32px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-outline-variant)',
          position: 'sticky', top: 0, zIndex: 30
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative', maxWidth: '448px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline-variant)' }}>search</span>
              <input type="text" placeholder="Search sub-accounts..." style={{
                width: '100%', backgroundColor: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline-variant)', borderRadius: '8px',
                padding: '8px 16px 8px 40px', outline: 'none', color: 'var(--color-on-surface)',
                fontSize: '14px'
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        <div style={{ padding: '24px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: 'var(--color-on-surface)' }}>Global Metrics Overview</h2>
            <button style={{ 
              backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary)',
              padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              Export Report
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Active Partners */}
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-surface-variant)' }}>Active Partners</h3>
                <div style={{ width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined">handshake</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                  {loading ? '...' : metrics?.activeEmployees || 0}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 0', fontSize: '14px', color: 'var(--color-surface-tint)' }}>
                  Active Employees
                </p>
              </div>
            </div>

            {/* Total Revenue */}
            <div style={{ backgroundColor: 'var(--color-primary-container)', border: '1px solid var(--color-primary-container)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '160px', height: '160px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', filter: 'blur(24px)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-primary)' }}>Total Revenue</h3>
                <div style={{ width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined">payments</span>
                </div>
              </div>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: 'var(--color-on-primary)' }}>
                  {loading ? '...' : metrics?.totalRevenue || '$0'}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 0', fontSize: '14px', color: 'var(--color-primary-fixed-dim)' }}>
                  Current Revenue
                </p>
              </div>
            </div>

            {/* System Health */}
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-surface-variant)' }}>System Health</h3>
                <div style={{ width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined">dns</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
                  {loading ? '...' : metrics?.systemHealth || '0%'}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 0', fontSize: '14px', color: 'var(--color-outline)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                  {metrics?.systemHealth === '99.9%' ? 'All systems operational' : 'Checking status...'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-surface)' }}>Recent Partner Activity</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-primary-container)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 24px' }}>Partner Name</th>
                    <th style={{ padding: '16px 24px' }}>Region</th>
                    <th style={{ padding: '16px 24px' }}>Last Sync</th>
                    <th style={{ padding: '16px 24px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-outline)' }}>
                        Cargando actividad reciente...
                      </td>
                    </tr>
                  ) : metrics?.recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-outline)' }}>
                        No hay actividad reciente para mostrar.
                      </td>
                    </tr>
                  ) : (
                    metrics?.recentActivity.map((activity) => (
                      <tr key={activity.id} style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '32px', height: '32px', borderRadius: '4px', 
                              backgroundColor: 'var(--color-secondary-container)', 
                              color: 'var(--color-on-secondary-container)', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              fontWeight: 'bold', fontSize: '12px' 
                            }}>
                              {activity.userName.charAt(0)}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', fontSize: '16px' }}>{activity.userName}</p>
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-outline)' }}>User</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                          {activity.formTitle}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                          {new Date(activity.startedAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ 
                            display: 'inline-flex', padding: '2px 10px', borderRadius: '9999px', 
                            fontSize: '12px', fontWeight: 500, 
                            backgroundColor: activity.status === 'COMPLETED' ? 'var(--color-secondary-container)' : 'var(--color-surface-variant)', 
                            color: activity.status === 'COMPLETED' ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)' 
                          }}>
                            {activity.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
