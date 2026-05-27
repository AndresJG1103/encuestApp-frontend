"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../../components/Sidebar';
import { getFormById, updateForm, Form } from '../../../../services/formService';
import { getSectionsByForm, createSection, deleteSection, Section, Item } from '../../../../services/sectionService';
import { createItem, deleteItem, updateItem } from '../../../../services/itemService';
import { uploadFile } from '../../../../services/mediaService';
import { useNotification } from '../../../../context/NotificationContext';

export default function FormEditorPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  const { notify, confirm } = useNotification();

  const [form, setForm] = useState<Form | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [formData, sectionsData] = await Promise.all([
        getFormById(formId),
        getSectionsByForm(formId)
      ]);
      setForm(formData);
      setSections(sectionsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFormDetails = async () => {
    if (!form) return;
    try {
      const titleInput = document.getElementById('form-title') as HTMLInputElement;
      const descInput = document.getElementById('form-desc') as HTMLTextAreaElement;
      await updateForm(formId, { 
        title: titleInput.value, 
        description: descInput.value 
      });
      notify('Cambios guardados correctamente', 'success');
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [formId]);

  const handleAddSection = async () => {
    try {
      await createSection(formId, { title: 'Nueva Sección', order: sections.length + 1 });
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteSection = async (id: string) => {
    const ok = await confirm('¿Eliminar esta sección y todos sus elementos?');
    if (!ok) return;
    try {
      await deleteSection(id);
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleAddItem = async (sectionId: string, type: string) => {
    try {
      const content = type === 'QUESTION' ? { text: 'Nueva Pregunta', questionType: 'SINGLE_CHOICE', options: [] } : { text: 'Nuevo Texto' };
      await createItem(sectionId, { type, order: 1, content });
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleUpdateItemContent = async (itemId: string, newContent: any) => {
    try {
      await updateItem(itemId, { content: newContent });
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleFileUpload = async (sectionId: string, file: File) => {
    try {
      const fileKey = await uploadFile(file);
      await createItem(sectionId, { 
        type: 'IMAGE', 
        order: 1, 
        content: { text: file.name, imageUrl: fileKey } 
      });
      notify('Archivo subido con éxito', 'success');
      fetchData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  if (loading) return <div>Cargando editor...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 32px', height: '64px', backgroundColor: 'var(--color-surface)', 
          borderBottom: '1px solid var(--color-outline-variant)',
          position: 'sticky', top: 0, zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => router.push('/forms')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface)' }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Editor: {form?.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button 
                onClick={() => setIsPreviewOpen(true)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', cursor: 'pointer', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', fontWeight: 600 }}
              >
                Vista Previa
              </button>
             <button 
                onClick={handleSaveFormDetails}
                style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Guardar Cambios
              </button>
          </div>
        </header>

        <div style={{ padding: '32px', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
          {error && <div style={{ color: 'var(--color-error)', marginBottom: '16px' }}>{error}</div>}

          {/* Form Info */}
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-outline-variant)', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-on-surface)' }}>Información General</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                id="form-title"
                type="text" defaultValue={form?.title} 
                style={{ fontSize: '20px', fontWeight: 700, border: 'none', borderBottom: '2px solid transparent', outline: 'none', width: '100%', backgroundColor: 'transparent', color: 'var(--color-on-surface)' }}
                placeholder="Título del Formulario"
              />
              <textarea 
                id="form-desc"
                defaultValue={form?.description} 
                style={{ border: 'none', resize: 'none', outline: 'none', width: '100%', color: 'var(--color-outline)', backgroundColor: 'transparent' }}
                placeholder="Añade una descripción..."
              />
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sections.map((section) => (
              <div key={section.id} style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '12px', border: '1px solid var(--color-outline-variant)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input 
                    type="text" defaultValue={section.title} 
                    style={{ fontWeight: 600, border: 'none', background: 'none', outline: 'none', width: '80%', color: 'var(--color-on-surface)' }}
                  />
                  <button onClick={() => handleDeleteSection(section.id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {section.items?.map((item) => (
                    <div key={item.id} style={{ padding: '20px', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', backgroundColor: 'var(--color-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.type}</span>
                        <button onClick={() => handleDeleteItem(item.id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-outline)' }}>Texto del elemento</label>
                        <input 
                          type="text" 
                          defaultValue={item.content.text}
                          onBlur={(e) => handleUpdateItemContent(item.id, { ...item.content, text: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                          placeholder="Escribe la pregunta o el texto aquí..."
                        />

                        {item.type === 'QUESTION' && (
                          <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>Opciones de respuesta</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <label style={{ fontSize: '12px', color: 'var(--color-outline)' }}>Puntos:</label>
                                <input 
                                  type="number" defaultValue={item.content.points || 0}
                                  onBlur={(e) => handleUpdateItemContent(item.id, { ...item.content, points: parseInt(e.target.value) })}
                                  style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                                />
                                <select 
                                  defaultValue={item.content.questionType}
                                  onChange={(e) => {
                                    const newType = e.target.value;
                                    const newContent: Record<string, any> = { ...item.content, questionType: newType };
                                    if (newType === 'BOOLEAN') {
                                      newContent.options = ['Verdadero', 'Falso'];
                                    }
                                    handleUpdateItemContent(item.id, newContent);
                                  }}
                                  style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                                >
                                  <option value="SINGLE_CHOICE">Selección Única</option>
                                  <option value="MULTIPLE_CHOICE">Selección Múltiple</option>
                                  <option value="OPEN_TEXT">Texto Abierto</option>
                                  <option value="BOOLEAN">Verdadero/Falso</option>
                                </select>
                              </div>
                            </div>

                            {item.content.questionType !== 'OPEN_TEXT' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {item.content.options?.map((opt: string, idx: number) => (
                                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button 
                                      onClick={() => {
                                        let currentCorrect = item.content.correctAnswers || [];
                                        let newCorrect = [];
                                        if (item.content.questionType === 'MULTIPLE_CHOICE') {
                                          newCorrect = currentCorrect.includes(opt) 
                                            ? currentCorrect.filter((c: string) => c !== opt)
                                            : [...currentCorrect, opt];
                                        } else {
                                          newCorrect = [opt];
                                        }
                                        handleUpdateItemContent(item.id, { ...item.content, correctAnswers: newCorrect });
                                      }}
                                      title="Marcar como correcta"
                                      style={{ 
                                        width: '20px', height: '20px', borderRadius: item.content.questionType === 'MULTIPLE_CHOICE' ? '4px' : '50%', 
                                        border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: (item.content.correctAnswers || []).includes(opt) ? 'var(--color-primary)' : 'transparent',
                                        cursor: 'pointer', padding: 0, flexShrink: 0
                                      }}
                                    >
                                      {(item.content.correctAnswers || []).includes(opt) && <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
                                    </button>
                                    <input 
                                      type="text" defaultValue={opt}
                                      onBlur={(e) => {
                                        const newOpts = [...(item.content.options || [])];
                                        const oldVal = newOpts[idx];
                                        newOpts[idx] = e.target.value;
                                        
                                        // Update correctAnswers if the value changed
                                        let newCorrect = (item.content.correctAnswers || []).map((c: string) => c === oldVal ? e.target.value : c);
                                        
                                        handleUpdateItemContent(item.id, { ...item.content, options: newOpts, correctAnswers: newCorrect });
                                      }}
                                      style={{ flex: 1, padding: '8px', fontSize: '14px', border: '1px solid transparent', borderBottom: '1px solid var(--color-outline-variant)', outline: 'none', background: 'none', color: 'var(--color-on-surface)' }}
                                    />
                                    {item.content.questionType !== 'BOOLEAN' && (
                                      <button onClick={() => {
                                        const newOpts = item.content.options.filter((_: any, i: number) => i !== idx);
                                        const removedOpt = item.content.options[idx];
                                        const newCorrect = (item.content.correctAnswers || []).filter((c: string) => c !== removedOpt);
                                        handleUpdateItemContent(item.id, { ...item.content, options: newOpts, correctAnswers: newCorrect });
                                      }} style={{ background: 'none', border: 'none', color: 'var(--color-outline)', cursor: 'pointer', fontSize: '18px' }}>×</button>
                                    )}
                                  </div>
                                ))}
                                {item.content.questionType !== 'BOOLEAN' && (
                                  <button 
                                    onClick={() => handleUpdateItemContent(item.id, { ...item.content, options: [...(item.content.options || []), `Opción ${(item.content.options?.length || 0) + 1}`] })}
                                    style={{ fontSize: '13px', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '8px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Añadir opción
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {item.type === 'IMAGE' && (
                          <div style={{ marginTop: '8px' }}>
                            {item.content.imageUrl ? (
                              <div style={{ position: 'relative', width: 'fit-content' }}>
                                <img 
                                  src={item.content.imageUrl.startsWith('http') ? item.content.imageUrl : `https://learnpulse-assets.s3.amazonaws.com/${item.content.imageUrl}`} 
                                  alt="Preview" 
                                  style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)' }} 
                                />
                                <button 
                                  onClick={() => handleUpdateItemContent(item.id, { ...item.content, imageUrl: null })}
                                  style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px', border: '2px dashed var(--color-outline-variant)', borderRadius: '12px', cursor: 'pointer', color: 'var(--color-outline)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>upload_file</span>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>Subir Imagen</span>
                                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(section.id, e.target.files[0])} />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', padding: '16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '12px', border: '1px dashed var(--color-outline-variant)' }}>
                    <button 
                      onClick={() => handleAddItem(section.id, 'QUESTION')} 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>add_circle</span> Pregunta
                    </button>
                    <button 
                      onClick={() => handleAddItem(section.id, 'TEXT')} 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>notes</span> Texto
                    </button>
                    <button 
                      onClick={() => handleAddItem(section.id, 'IMAGE')} 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary)' }}>image</span> Imagen
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddSection}
              style={{ padding: '16px', borderRadius: '12px', border: '2px dashed var(--color-outline-variant)', color: 'var(--color-outline)', cursor: 'pointer', fontWeight: 600, backgroundColor: 'transparent' }}
            >
              + Añadir Sección
            </button>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '800px', height: '100%', borderRadius: '24px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)', zIndex: 10 }}>
              <h2 style={{ margin: 0, color: 'var(--color-on-surface)' }}>Vista Previa</h2>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--color-on-surface)' }}>×</button>
            </header>
            
            <div style={{ padding: '40px', flex: 1 }}>
              <h1 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '40px' }}>{form?.title}</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {sections.map((section, sIdx) => (
                  <div key={section.id}>
                    <h3 style={{ borderBottom: '2px solid var(--color-primary-container)', paddingBottom: '8px', marginBottom: '24px', color: 'var(--color-on-surface)' }}>
                      Sección {sIdx + 1}: {section.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {section.items?.map((item) => (
                        <div key={item.id} style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)' }}>
                          {item.type === 'QUESTION' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-on-surface)' }}>{item.content.text}</p>
                              {item.content.questionType !== 'OPEN_TEXT' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {item.content.options?.map((opt: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)' }}>
                                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--color-outline)' }}></div>
                                      <span style={{ fontSize: '14px', color: 'var(--color-on-surface)' }}>{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.content.questionType === 'OPEN_TEXT' && (
                                <div style={{ height: '80px', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}></div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {item.content.text && <p style={{ margin: 0, color: 'var(--color-on-surface)' }}>{item.content.text}</p>}
                              {item.content.imageUrl && (
                                <img 
                                  src={item.content.imageUrl.startsWith('http') ? item.content.imageUrl : `https://learnpulse-assets.s3.amazonaws.com/${item.content.imageUrl}`} 
                                  alt="Content" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '16px' }} 
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer style={{ padding: '24px 32px', borderTop: '1px solid var(--color-outline-variant)', textAlign: 'center', backgroundColor: 'var(--color-surface-container-low)' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-outline)' }}>Fin de la vista previa</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
