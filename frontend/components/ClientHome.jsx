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
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [moodSelected, setMoodSelected] = useState(false);

    useEffect(() => {
        if (user.id) checkTodayMood();
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
            window.location.reload();
        } catch (e) { toast.error("Ошибка сети"); }
    };

    if (!moodSelected) {
        return (
            <div className="animate-up" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Доброе утро, {user.fullName || user.username}! 👋</h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', marginBottom: '3.5rem' }}>Как ваше состояние в этот момент?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
                    {MOOD_OPTIONS.map((mood) => (
                        <div key={mood.key} className="glass-card" style={{ cursor: 'pointer', padding: '2rem 1rem', textAlign: 'center' }} onClick={() => handleMoodClick(mood.key)}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{mood.emoji}</div>
                            <div style={{ fontWeight: '700', color: 'var(--slate-800)' }}>{mood.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-up">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Ваш Путь к Спокойствию</h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem' }}>Сегодня {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem' }}>📖 Дневник осознанности</h2>
                    <p style={{ color: 'var(--slate-600)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                        Запишите мысли, которые возникли у вас сегодня. Это первый шаг к когнитивной переработке.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/diary')}>Начать запись</button>
                </div>

                <div className="glass-card" style={{ background: 'var(--accent-cream)', border: 'none' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#744210' }}>🎯 Текущее задание</h3>
                    <p style={{ fontSize: '0.95rem', color: '#92400E' }}>Проверьте рекомендации от вашего специалиста на сегодня.</p>
                    <button className="btn-primary" style={{ background: 'var(--slate-800)', marginTop: '2rem', width: '100%' }} onClick={() => navigate('/client-assignments')}>Открыть задания</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '3rem' }}>✨</div>
                    <div>
                        <h3 style={{ margin: 0 }}>Внутренний мир</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '5px 0 15px' }}>Ваш сад спокойствия и роста.</p>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => navigate('/inner-world')}>Войти</button>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '3rem' }}>🔮</div>
                    <div>
                        <h3 style={{ margin: 0 }}>Анализ снов</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '5px 0 15px' }}>Разберитесь в образах подсознания.</p>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => navigate('/dreams')}>Начать</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
