import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="app-layout" style={{ 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, var(--p-100) 0%, var(--white) 100%)',
            marginLeft: 0 
        }}>
            <div className="diary-container animate-up" style={{ 
                maxWidth: '600px', 
                textAlign: 'center', 
                padding: '4rem 3rem' 
            }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>🌿</div>
                <h1 style={{ 
                    fontSize: '2.8rem', 
                    fontWeight: '800', 
                    color: 'var(--p-600)',
                    marginBottom: '1rem',
                    letterSpacing: '-1px'
                }}>
                    CBT Diary SaaS
                </h1>
                <p style={{ 
                    fontSize: '1.15rem', 
                    color: 'var(--slate-600)', 
                    marginBottom: '3rem',
                    lineHeight: '1.7' 
                }}>
                    Ваше профессиональное пространство для ментального благополучия. 
                    Инструменты КПТ и поддержка экспертов в одном защищенном приложении.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn-primary"
                        style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                    >
                        Войти в кабинет
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="btn-primary"
                        style={{ 
                            padding: '1rem 3rem', 
                            fontSize: '1.1rem',
                            background: 'var(--white)',
                            color: 'var(--p-600)',
                            border: '2px solid var(--p-600)'
                        }}
                    >
                        Регистрация
                    </button>
                </div>
                
                <div style={{ 
                    marginTop: '4rem', 
                    paddingTop: '2rem', 
                    borderTop: '1px solid var(--p-100)',
                    color: 'var(--slate-400)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    Безопасно • Конфиденциально • Профессионально
                </div>
            </div>
        </div>
    );
}
