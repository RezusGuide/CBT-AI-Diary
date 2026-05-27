import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: 'var(--space-md)' }}>🌿</div>
                <h1 className="auth-title" style={{ fontSize: '2.8rem', marginBottom: 'var(--space-sm)' }}>
                    CBT AI Diary
                </h1>
                <p className="auth-subtitle" style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xl)', lineHeight: '1.7' }}>
                    Ваше профессиональное пространство для ментального благополучия. 
                    Инструменты КПТ и поддержка экспертов в одном защищенном приложении.
                </p>
                
                <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn-primary"
                        style={{ padding: '12px 32px', fontSize: '1.1rem' }}
                    >
                        Войти в кабинет
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="btn-secondary"
                        style={{ padding: '12px 32px', fontSize: '1.1rem' }}
                    >
                        Регистрация
                    </button>
                </div>
                
                <div style={{ 
                    marginTop: 'var(--space-2xl)', 
                    paddingTop: 'var(--space-lg)', 
                    borderTop: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    Безопасно • Конфиденциально • Профессионально
                </div>
            </div>
            
            <div className="app-layout" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            </div>
        </div>
    );
}
