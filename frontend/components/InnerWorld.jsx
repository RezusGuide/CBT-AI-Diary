import React, { useState, useEffect } from 'react';
import PhaserGame from './PhaserGame';
import API_URL from '../src/api';

export default function InnerWorld() {
    const [status, setStatus] = useState({ daysLogged: 0, requiredDays: 5, isUnlocked: false });
    const [showGame, setShowGame] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) {
            fetch(API_URL(`/api/gamification/status/${user.id}`))
                .then(res => res.json())
                .then(data => {
                    // Normalize data from backend
                    setStatus({
                        daysLogged: data.daysLogged || 0,
                        requiredDays: data.requiredDays || 5,
                        isUnlocked: data.isUnlocked || false
                    });
                })
                .catch(e => console.error(e));
        }
    }, [user.id]);

    if (showGame) {
        return <PhaserGame onExit={() => setShowGame(false)} />;
    }

    const daysLeft = Math.max(0, status.requiredDays - status.daysLogged);

    // Plural helper for Russian:
    function pluralDays(n) {
        if (n % 10 === 1 && n % 100 !== 11) return 'запись';
        if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'записи';
        return 'записей';
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <header style={{ marginBottom: 'var(--space-2xl)' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}>🍃</div>
                <h1 style={{ color: 'var(--color-world)' }}>Ваш Внутренний Сад</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Это пространство — метафора вашего ментального состояния. Ухаживайте за ним, ведя дневник, и наблюдайте, как он расцветает.
                </p>
            </header>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: 'var(--space-2xl)', border: '1px solid var(--border-subtle)' }}>
                {status.isUnlocked ? (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✨</div>
                        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Сад открыт</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                            Сегодня в вашем мире спокойная погода. Готовы прогуляться?
                        </p>
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', padding: 'var(--space-md)', fontSize: '1.1rem', background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                            onClick={() => setShowGame(true)}
                        >
                            Войти в свой мир ✨
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔒</div>
                        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Мир пока скрыт</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Для доступа к саду нужно сделать еще <strong>{daysLeft}</strong> {pluralDays(daysLeft)} в дневнике.
                        </p>
                        
                        {/* PROGRESS BAR */}
                        <div style={{ height: '12px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ 
                                width: `${Math.min(100, (status.daysLogged / status.requiredDays) * 100)}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, #34d399, #10b981)',
                                transition: 'width 1s ease'
                            }} />
                        </div>
                        <div className="input-label" style={{ textAlign: 'center' }}>
                            {status.daysLogged} / {status.requiredDays} ЗАПИСЕЙ
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'var(--space-2xl)', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "Сад — это отражение души. Сорняки — это тревоги, а цветы — ваша осознанность."
            </div>
        </div>
    );
}
