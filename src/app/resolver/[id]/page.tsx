"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { getFormById, Form } from '../../../services/formService';
import { Section, Item } from '../../../services/sectionService';
import { getItemsBySection } from '../../../services/itemService';
import { getSessionById, submitAnswer, completeSession } from '../../../services/responseService';
import { useNotification } from '../../../context/NotificationContext';

export default function ResolverPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const params = useParams();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const initResolver = async () => {
      try {
        const session = await getSessionById(sessionId);
        const formData = await getFormById(session.formId);

        const sectionsData: Section[] = (formData as any).sections ?? [];
        setForm(formData);
        setSections(sectionsData);

        const totalQ = sectionsData.reduce(
          (sum, s) => sum + (s.items?.filter(i => i.type === 'QUESTION').length ?? 0),
          0,
        );
        setTotalQuestions(totalQ);

        const firstItems = sectionsData[0]?.items
          ?? (sectionsData[0] ? await getItemsBySection(sectionsData[0].id) : []);
        setCurrentItems(firstItems);
      } catch (err: any) {
        notify(err.message, 'error');
        router.push('/my-tasks');
      } finally {
        setLoading(false);
      }
    };
    initResolver();
  }, [sessionId]);

  const handleAnswerChange = (itemId: string, value: any, type: string) => {
    if (type === 'MULTIPLE_CHOICE') {
      const current = (answers[itemId] as string[]) || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers(prev => ({ ...prev, [itemId]: updated }));
    } else {
      setAnswers(prev => ({ ...prev, [itemId]: value }));
    }
  };

  const handleNext = async () => {
    setSubmitting(true);
    try {
      // Save all answers of current section
      for (const item of currentItems) {
        if (answers[item.id] !== undefined) {
          let payload: any = {};
          const qType = item.content.questionType;
          
          if (qType === 'SINGLE_CHOICE' || qType === 'BOOLEAN') {
            payload = { selected: [answers[item.id]] };
          } else if (qType === 'MULTIPLE_CHOICE') {
            payload = { selected: answers[item.id] };
          } else if (qType === 'OPEN_TEXT') {
            payload = { text: answers[item.id] };
          } else {
            payload = { value: answers[item.id] };
          }

          await submitAnswer(sessionId, item.id, payload);
        }
      }

      if (currentSectionIndex < sections.length - 1) {
        const nextIndex = currentSectionIndex + 1;
        const nextSection = sections[nextIndex];
        const nextItems = nextSection.items ?? await getItemsBySection(nextSection.id);
        setCurrentItems(nextItems);
        setCurrentSectionIndex(nextIndex);
        window.scrollTo(0, 0);
      } else {
        setIsConfirmOpen(true);
      }
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      await completeSession(sessionId);
      notify('¡Formulario completado!', 'success');
      router.push(`/resolver/${sessionId}/result`);
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando formulario...</div>;

  const currentSection = sections[currentSectionIndex];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-surface)' }}>
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>{form?.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {sections.map((_, idx) => (
              <div key={idx} style={{ 
                width: '32px', height: '4px', borderRadius: '2px',
                backgroundColor: idx <= currentSectionIndex ? 'var(--color-primary)' : 'var(--color-outline-variant)'
              }} />
            ))}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-outline)', marginTop: '12px' }}>
            Sección {currentSectionIndex + 1} de {sections.length}: {currentSection?.title}
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {currentItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {item.type === 'QUESTION' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--color-on-surface)' }}>{item.content.text}</p>
                  
                  {item.content.questionType === 'SINGLE_CHOICE' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {item.content.options?.map((opt: any, i: number) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', cursor: 'pointer', backgroundColor: 'var(--color-surface)' }}>
                          <input 
                            type="radio" name={item.id} value={opt} 
                            checked={answers[item.id] === opt}
                            onChange={() => handleAnswerChange(item.id, opt, 'SINGLE_CHOICE')}
                          />
                          <span style={{ color: 'var(--color-on-surface)' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {item.content.questionType === 'MULTIPLE_CHOICE' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {item.content.options?.map((opt: any, i: number) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', cursor: 'pointer', backgroundColor: 'var(--color-surface)' }}>
                          <input 
                            type="checkbox" value={opt} 
                            checked={((answers[item.id] as string[]) || []).includes(opt)}
                            onChange={() => handleAnswerChange(item.id, opt, 'MULTIPLE_CHOICE')}
                          />
                          <span style={{ color: 'var(--color-on-surface)' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {item.content.questionType === 'BOOLEAN' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {item.content.options?.map((opt: any, i: number) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', cursor: 'pointer', backgroundColor: 'var(--color-surface)' }}>
                          <input 
                            type="radio" name={item.id} value={opt} 
                            checked={answers[item.id] === opt}
                            onChange={() => handleAnswerChange(item.id, opt, 'BOOLEAN')}
                          />
                          <span style={{ color: 'var(--color-on-surface)' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {item.content.questionType === 'OPEN_TEXT' && (
                    <textarea 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', minHeight: '100px', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)', outline: 'none' }}
                      placeholder="Escribe tu respuesta aquí..."
                      value={answers[item.id] || ''}
                      onChange={(e) => handleAnswerChange(item.id, e.target.value, 'OPEN_TEXT')}
                    />
                  )}
                </div>
              ) : (
                <div>
                  {item.content.text && <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>{item.content.text}</p>}
                  {item.content.imageUrl && <img src={item.content.imageUrl} alt="Content" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '16px', border: '1px solid var(--color-outline-variant)' }} />}
                </div>
              )}
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleNext}
            disabled={submitting}
            style={{ 
              padding: '16px 48px', borderRadius: '12px', border: 'none', 
              backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 700, fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Guardando...' : currentSectionIndex === sections.length - 1 ? 'Finalizar' : 'Siguiente Sección'}
          </button>
        </footer>
      </main>

      {/* Final Confirmation Modal */}
      {isConfirmOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '32px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-on-surface)' }}>¿Enviar respuestas?</h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Has respondido <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{Object.keys(answers).length}</span> de <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{totalQuestions}</span> preguntas de este formulario.
              <br/><br/>
              Al enviar, ya no podrás regresar ni modificar tus respuestas. ¿Deseas finalizar ahora?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIsConfirmOpen(false)}
                disabled={submitting}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'transparent', color: 'var(--color-on-surface)', fontWeight: 600, cursor: 'pointer' }}
              >
                Seguir revisando
              </button>
              <button 
                onClick={handleFinalSubmit}
                disabled={submitting}
                style={{ 
                  flex: 1, padding: '14px', borderRadius: '12px', border: 'none', 
                  backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {submitting ? 'Enviando...' : 'Sí, enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
