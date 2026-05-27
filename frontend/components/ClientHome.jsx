import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    const [moodSelected, setMoodSelected] = useState(false);
    const [stats, setStats] = useState({ diary: 0, dreams: 0, tasks: 0, aiAdvice: 0 });

    useEffect(() => {
        if (user.id) {
            checkTodayMood();
            fetchStats();
        }
    }, [user.id]);

    const checkTodayMood = async () => {
        try {
            const res = await fetch(`/api/mood/today/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.mood && data.mood !== "") setMoodSelected(true);
            }
        } catch (e) { console.error(e); }
    };

    const fetchStats = async () => {
        // Placeholder for stats fetching
        // In a real app, we would fetch these from the backend
        setStats({
            diary: 12,
            dreams: 5,
            tasks: 3,
            aiAdvice: 8
        });
    };

    const handleMoodClick = async (moodKey) => {
        try {
            await fetch(`/api/mood/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: moodKey })
            });
            localStorage.setItem(`mood_${user.id}_${new Date().toDateString()}`, moodKey);
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

    return (
        <div>
            <header style={{ marginBottom: 'var(--space-xl)' }}>
                <h1>Добрый день, {user.fullName || user.username} 👋</h1>
                <p style={{ color: 'var(--text-muted)' }}>Сегодня {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: 'var(--space-xl)' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-diary)' }}>{stats.diary}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Записей</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-dreams)' }}>{stats.dreams}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Снов</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-tasks)' }}>{stats.tasks}</div>
                    <div className="input-label" style={{ marginBottom: 0 }}>Заданий</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-ai)' }}>{stats.aiAdvice}</div>
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
