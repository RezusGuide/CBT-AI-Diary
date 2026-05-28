import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API_URL from '../src/api';

const MOOD_OPTIONS = [
    { key: 'happy', label: 'Радостно', emoji: '🌟' },
    { key: 'joy', label: 'Энергично', emoji: '⚡' },
    { key: 'calm', label: 'Спокойно', emoji: '🧘' },
    { key: 'sad', label: 'Грустно', emoji: '☁️' },
    { key: 'annoyed', label: 'Раздражение', emoji: '🔥' }
];

export default function ClientHome() {
    const navigate = useNavigate();
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    
    // BUG 4 FIX: Initialize mood state synchronously from localStorage to avoid flash
    const TODAY = new Date().toISOString().split('T')[0];
    const MOOD_KEY = `mood_${user.id}_${TODAY}`;
    
    const [selectedMood, setSelectedMood] = useState(() => {
        return localStorage.getItem(MOOD_KEY);
    });
    const [moodSelected, setMoodSelected] = useState(() => {
        return localStorage.getItem(MOOD_KEY) !== null;
    });

    const [stats, setStats] = useState({ diaryCount: 0, sleepCount: 0, taskCount: 0, adviceCount: 0 });

    useEffect(() => {
        if (user.id) {
            checkTodayMood();
            fetchStats();
        }
    }, [user.id]);

    const checkTodayMood = async () => {
        try {
            const res = await fetch(API_URL(`/api/mood/today/${user.id}`));
            if (res.ok) {
                const data = await res.json();
                if (data.mood && data.mood !== "") {
                    localStorage.setItem(MOOD_KEY, data.mood);
                    setSelectedMood(data.mood);
                    setMoodSelected(true);
                }
            }
        } catch (e) { console.error(e); }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(API_URL(`/api/dashboard/stats?userId=${user.id}`));
            if (res.ok) {
                setStats(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const handleMoodClick = async (moodKey) => {
        try {
            await fetch(API_URL(`/api/mood/${user.id}`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: moodKey })
            });
            localStorage.setItem(MOOD_KEY, moodKey);
            setSelectedMood(moodKey);
            setMoodSelected(true);
            toast.success("Настроение сохранено ✨");
        } catch (e) { toast.error("Ошибка сети"); }
    };

    if (!moodSelected) {
        return (
            <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Доброе утро, {user.fullName || user.username}! 👋</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3.5rem' }}>Как ваше состояние в этот момент?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
                    {MOOD_OPTIONS.map((mood) => (
                        <div key={mood.key} className="card" style={{ cursor: 'pointer', padding: '2rem 1rem', textAlign: 'center' }} onClick={() => handleMoodClick(mood.key)}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{mood.emoji}</div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{mood.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentMoodObj = MOOD_OPTIONS.find(m => m.key === selectedMood);

    return (
        <div>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Добрый день, {user.fullName || user.username} 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Сегодня {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                {currentMoodObj && (
                    <div className="card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{currentMoodObj.emoji}</span>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ваше состояние</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{currentMoodObj.label}</div>
                        </div>
                        <button 
                            onClick={() => setMoodSelected(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', marginLeft: '10px' }}
                        >
                            Изменить
                        </button>
                    </div>
                )}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: 'var(--space-xl)' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-diary)' }}>{stats.diaryCount}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Записей</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-dreams)' }}>{stats.sleepCount}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Снов</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-tasks)' }}>{stats.taskCount}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Заданий</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-ai)' }}>{stats.adviceCount}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Советов</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
                <div className="card">
                    <h2 style={{ marginBottom: 'var(--space-sm)' }}>📖 Дневник осознанности</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                        Запишите мысли, которые возникли у вас сегодня. Это первый шаг к когнитивной переработке.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/diary')}>Начать запись</button>
                </div>

                <div className="card" style={{ background: 'var(--bg-surface-2)' }}>
                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>🎯 Текущее задание</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Проверьте рекомендации от вашего специалиста на сегодня.</p>
                    <button className="btn-primary" style={{ marginTop: 'var(--space-md)', width: '100%' }} onClick={() => navigate('/client-assignments')}>Открыть задания</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>✨</div>
                    <div>
                        <h3 style={{ margin: 0 }}>Внутренний мир</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 12px' }}>Ваш сад спокойствия и роста.</p>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/inner-world')}>Войти</button>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>🌙</div>
                    <div>
                        <h3 style={{ margin: 0 }}>Анализ снов</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 12px' }}>Разберитесь в образах подсознания.</p>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/dreams')}>Начать</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
