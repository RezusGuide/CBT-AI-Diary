import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';

export default function InnerWorld() {
    const [status, setStatus] = useState({ daysLogged: 0, entriesToUnlock: 3, isUnlocked: false });
    const [showGame, setShowGame] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) {
            fetch(`/api/gamification/status/${user.id}`)
                .then(res => res.json())
                .then(data => setStatus(data));
        }
    }, [user.id]);

    if (showGame) {
        return <PhaserGame onExit={() => setShowGame(false)} />;
    }

    return (
        <div className="diary-container animate-in" style={{ textAlign: 'center', background: 'linear-gradient(to bottom, var(--white), var(--p-100))' }}>
            <header style={{ marginBottom: '4rem' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🍃</div>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--p-600)' }}>Ваш Внутренний Сад</h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Это пространство — метафора вашего ментального состояния. Ухаживайте за ним, ведя дневник, и наблюдайте, как он расцветает.
                </p>
            </header>

            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
                {status.isUnlocked ? (
                    <div className="animate-up">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Сад открыт</h2>
                        <p style={{ color: 'var(--slate-500)', marginBottom: '2.5rem' }}>
                            Сегодня в вашем мире спокойная погода. Готовы прогуляться?
                        </p>
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                            onClick={() => setShowGame(true)}
                        >
                            Войти в свой мир ✨
                        </button>
                    </div>
                ) : (
                    <div className="animate-up">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h2 style={{ marginBottom: '1rem' }}>Мир пока скрыт</h2>
                        <p style={{ color: 'var(--slate-500)', marginBottom: '2rem' }}>
                            Для доступа к саду нужно сделать еще <strong>{status.entriesToUnlock - status.daysLogged}</strong> записи в дневнике.
                        </p>
                        
                        {/* PROGRESS BAR */}
                        <div style={{ height: '12px', background: 'var(--p-100)', borderRadius: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
                            <div style={{ 
                                width: `${(status.daysLogged / status.entriesToUnlock) * 100}%`, 
                                height: '100%', 
                                background: 'var(--p-600)',
                                transition: 'width 1s ease'
                            }} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)', fontWeight: '700' }}>
                            {status.daysLogged} / {status.entriesToUnlock} ДНЕЙ
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '4rem', color: 'var(--slate-400)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "Сад — это отражение души. Сорняки — это тревоги, а цветы — ваша осознанность."
            </div>
        </div>
    );
}
