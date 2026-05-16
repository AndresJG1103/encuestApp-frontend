"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { getUsers, User, PaginatedResult, toggleUserStatus } from '../../services/userService';

export default function EmployeesPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResult<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers({ page, limit: 10, search });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      alert(err.message || 'Error al cambiar el estado del usuario');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 32px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-outline-variant)',
          position: 'sticky', top: 0, zIndex: 30
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Gestión de Empleados</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '300px' }}>
              <span className="material-symbols-outlined" style={{ 
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--color-outline)', fontSize: '20px' 
              }}>search</span>
              <input 
                type="text" 
                placeholder="Buscar por nombre o email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid var(--color-outline-variant)', borderRadius: '8px',
                  padding: '8px 16px 8px 40px', outline: 'none', color: 'var(--color-on-surface)',
                  fontSize: '14px'
                }} 
              />
            </form>
            <button 
              onClick={() => router.push('/employees/new')}
              style={{ 
                backgroundColor: 'var(--color-primary)', color: 'white',
                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
              Nuevo Empleado
            </button>
          </div>
        </header>

        <div style={{ padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 24px' }}>Empleado</th>
                  <th style={{ padding: '16px 24px' }}>Documento</th>
                  <th style={{ padding: '16px 24px' }}>Roles</th>
                  <th style={{ padding: '16px 24px' }}>Estado</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>
                      Cargando empleados...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-error)' }}>
                      {error}
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>
                      No se encontraron empleados.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--color-outline-variant)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            backgroundColor: 'var(--color-primary-container)', 
                            color: 'var(--color-on-primary-container)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontWeight: 'bold', fontSize: '14px' 
                          }}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-on-surface)' }}>{user.firstName} {user.lastName}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-outline)' }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                        {user.identityDocument}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {user.userTenants?.map((ut, idx) => (
                            <span key={idx} style={{ 
                              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                              backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)'
                            }}>
                              {ut.role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                          backgroundColor: user.isActive ? '#ecfdf5' : '#fef2f2',
                          color: user.isActive ? '#059669' : '#dc2626'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => router.push(`/employees/edit/${user.id}`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.isActive ? 'Deshabilitar' : 'Habilitar'}
                          style={{ 
                            background: 'none', border: 'none', cursor: 'pointer', 
                            color: user.isActive ? 'var(--color-warning)' : 'var(--color-primary)', 
                            padding: '4px' 
                          }}
                        >
                          <span className="material-symbols-outlined">
                            {user.isActive ? 'block' : 'check_circle'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {/* Pagination */}
            {data && data.meta.lastPage > 1 && (
              <div style={{ 
                padding: '16px 24px', 
                borderTop: '1px solid var(--color-outline-variant)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: 'var(--color-surface-container-low)' 
              }}>
                <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
                  Mostrando <span style={{ fontWeight: 600 }}>{(data.meta.page - 1) * data.meta.limit + 1}</span> - <span style={{ fontWeight: 600 }}>{Math.min(data.meta.page * data.meta.limit, data.meta.total)}</span> de <span style={{ fontWeight: 600 }}>{data.meta.total}</span> empleados
                </p>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    style={{ 
                      padding: '8px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)',
                      backgroundColor: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer',
                      opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>first_page</span>
                  </button>
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{ 
                      padding: '8px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)',
                      backgroundColor: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer',
                      opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, data.meta.lastPage) }, (_, i) => {
                    let pageNum;
                    if (data.meta.lastPage <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= data.meta.lastPage - 2) {
                      pageNum = data.meta.lastPage - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    const isCurrent = page === pageNum;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{ 
                          minWidth: '40px', height: '40px', borderRadius: '8px', 
                          border: isCurrent ? 'none' : '1px solid var(--color-outline-variant)',
                          backgroundColor: isCurrent ? 'var(--color-primary)' : 'white',
                          color: isCurrent ? 'white' : 'var(--color-on-surface)',
                          cursor: 'pointer', fontWeight: isCurrent ? 600 : 400,
                          fontSize: '14px'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button 
                    disabled={page === data.meta.lastPage}
                    onClick={() => setPage(p => p + 1)}
                    style={{ 
                      padding: '8px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)',
                      backgroundColor: 'white', cursor: page === data.meta.lastPage ? 'not-allowed' : 'pointer',
                      opacity: page === data.meta.lastPage ? 0.5 : 1, display: 'flex', alignItems: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                  </button>
                  <button 
                    disabled={page === data.meta.lastPage}
                    onClick={() => setPage(data.meta.lastPage)}
                    style={{ 
                      padding: '8px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)',
                      backgroundColor: 'white', cursor: page === data.meta.lastPage ? 'not-allowed' : 'pointer',
                      opacity: page === data.meta.lastPage ? 0.5 : 1, display: 'flex', alignItems: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>last_page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
