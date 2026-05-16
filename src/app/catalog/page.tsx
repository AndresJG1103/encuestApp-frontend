import React from 'react';

export default function Catalog() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-surface)', fontFamily: 'var(--font-sans)' }}>
      {/* TopNavBar Shell */}
      <header style={{
        backgroundColor: 'var(--color-surface-container-lowest)', borderBottom: '1px solid var(--color-outline-variant)',
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 40, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: '64px', padding: '0 24px', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary-container)' }}>LMS Enterprise</span>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--color-primary-container)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Catálogo</a>
            <a href="#" style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500, fontSize: '14px', textDecoration: 'none' }}>Ruta de Carrera</a>
            <a href="#" style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500, fontSize: '14px', textDecoration: 'none' }}>Recursos</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline-variant)' }}>search</span>
            <input type="text" placeholder="Buscar cursos..." style={{
              padding: '8px 16px 8px 40px', backgroundColor: 'var(--color-surface-container-low)', border: 'none',
              borderRadius: '8px', fontSize: '14px', width: '256px', outline: 'none'
            }} />
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined">notifications</span>
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: 'var(--color-error)', borderRadius: '50%' }}></span>
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-outline-variant)' }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk38dpzWaPB4PaLyHcumxMCY9z3SSxEkdg91hkCNQ4ty515z3ghELZ3xibtir40k0_RUnJP5-OEj_iYnhXGozg5_kxaydIFWbQU8ygI6psXmkiv2QHTYsI8MYvHZ5G39dHvAqh8Y2bkfAUBEA3w0dNtf8rUxYUTMbU5mMCWburrMUrRz37F7geUeBRV9g3qZ6n_jMeSIkVLXfkA6_2K03oSqojhunDODsHu5aKyutncuyjeeuolylTbPHrLADJxIujwczkAtAE9I8" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      {/* SideNavBar Shell */}
      <aside style={{
        backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-outline-variant)',
        position: 'fixed', left: 0, top: 0, height: '100vh', width: '280px', display: 'flex', flexDirection: 'column',
        padding: '32px 16px', boxSizing: 'border-box', zIndex: 30, paddingTop: '96px'
      }}>
        <div style={{ marginBottom: '32px', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '16px' }}>school</span>
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-primary-container)' }}>Portal de Capacitación</h2>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, margin: 0, marginLeft: '44px', color: 'var(--color-outline)' }}>Área de Empleados</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--color-surface-container-lowest)', color: 'var(--color-primary-container)', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid var(--color-outline-variant)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined">school</span> Mis Cursos
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-on-surface-variant)', padding: '12px 16px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined">history</span> Historial
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-on-surface-variant)', padding: '12px 16px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined">verified</span> Certificaciones
          </a>
        </nav>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-outline-variant)', marginTop: 'auto' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-on-surface-variant)', padding: '12px 16px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined">settings</span> Ajustes
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-error)', padding: '12px 16px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main style={{ marginLeft: '280px', paddingTop: '64px', minHeight: '100vh', width: '100%', boxSizing: 'border-box', padding: '40px 24px', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>Capacitación Continua</span>
              <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: 'var(--color-on-background)', letterSpacing: '-0.02em' }}>Mi Aprendizaje Corporativo</h1>
              <p style={{ fontSize: '16px', color: 'var(--color-on-surface-variant)', margin: '8px 0 0' }}>Gestiona tu crecimiento profesional con cursos diseñados para tu rol.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--color-surface-container-lowest)', padding: '4px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid var(--color-outline-variant)' }}>
              <button style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Vista General</button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Explorar Todo</button>
            </div>
          </div>

          {/* Dashboard Stats Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--color-primary)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '192px', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '128px', height: '128px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <p style={{ color: 'var(--color-primary-fixed-dim)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>PROGRESO TOTAL</p>
                <h2 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>84% Completado</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '84%', height: '100%', backgroundColor: 'white', borderRadius: '9999px' }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>12/15 Cursos</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-outline-variant)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 4px 0' }}>HORAS INVERTIDAS</p>
                <h3 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: 'var(--color-on-background)' }}>128h</h3>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-outline-variant)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-tertiary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 4px 0' }}>CERTIFICADOS</p>
                <h3 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: 'var(--color-on-background)' }}>8</h3>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Section: EN CURSO */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '9999px' }}></div>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: 'var(--color-on-background)' }}>En curso</h2>
                  <span style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontSize: '12px', fontWeight: 700, padding: '4px 8px', borderRadius: '9999px' }}>2</span>
                </div>
                <button style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Ver todos <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '192px', position: 'relative' }}>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMAzuVZZIaUbx464jKBxDn_B5bw7mzYqzx4osAwVle9qjeJVC3LvCcmkVti0mp67P8m_StWJXTmVy7L2eDFRbaMhr_ENFuIlCy7sEXzCYoM8kMC-J3c7jnY22CvyIMVasGu0ochrsrmYANy2WaqcpJ1JElPl4bM6ERut-A_wPItX0V2gIem1grko_8wicm-wW_Js_kKBu05HScrSC2Qp4I4Wuq0_L60CZAQe4MSfYKJDDQPIfq29ulqg1-MNo-h0tOeifgQ4hhLxM" alt="Liderazgo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Habilidades Directivas</span>
                    </div>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-background)' }}>Liderazgo de Equipos en Remoto</h3>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)' }}>more_vert</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> 12h 30m</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>play_circle</span> 8 Módulos</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>Progreso</span>
                        <span style={{ color: 'var(--color-primary)' }}>65%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: '65%', borderRadius: '9999px' }}></div>
                      </div>
                      <button style={{ width: '100%', marginTop: '24px', padding: '12px', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Continuar Curso</button>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '192px', position: 'relative' }}>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkqfHvoqIAO3jj8zg3vmjaadMd96-xTkprMFs9BRrWD2S04YohsESr4Uo9JmovUUpqNMs6LbucMm6wCQ0a-nYpIVQ6LSMKc1B6atIjBfuO0Y57iGkPU-_Ro9smkpd4wtYixDeqo_4ChVuhKl64pp5uI0EDPMsT-Xrsn86sLwu9jNsnlekrnCtlZeCRXcKdWA_smu5nUyPbWbda1r2XTGLXgPTLVxgoDUJR3td-p2u1boPyYU3yuZWfMhxqYgt8fKWF78lJuD2Js6I" alt="Data" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tecnología</span>
                    </div>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--color-on-background)' }}>Visualización de Datos con BI</h3>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)' }}>more_vert</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span> 18h 00m</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>play_circle</span> 12 Módulos</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>Progreso</span>
                        <span style={{ color: 'var(--color-primary)' }}>20%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: '20%', borderRadius: '9999px' }}></div>
                      </div>
                      <button style={{ width: '100%', marginTop: '24px', padding: '12px', backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Continuar Curso</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 50 }}>
        <button style={{ width: '56px', height: '56px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>question_answer</span>
        </button>
      </div>

    </div>
  );
}
