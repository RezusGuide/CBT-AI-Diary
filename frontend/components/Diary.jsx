import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DiaryHome() {
    const [entries, setEntries] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) fetchEntries();
    }, [user.id]);

    const fetchEntries = async () => {
        try {
            const res = await fetch(`/api/diary/user/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setEntries(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;

        const res = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, text: newText })
        });

        if (res.ok) {
            setNewText('');
            fetchEntries();
            toast.success("Запись сохранена ✨");
        }
    };

    const todayStr = new Date().toLocaleDateString();
    const hasTodayEntry = entries.some(e => new Date(e.createdAt).toLocaleDateString() === todayStr);

    return (
        <div className="diary-container animate-up">
            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.2rem' }}>Мой Дневник</h1>
                <p style={{ color: 'var(--slate-600)' }}>Осознанность начинается с честности перед самим собой.</p>
            </header>

            {!hasTodayEntry ? (
                <div className="glass-card" style={{ background: 'var(--p-100)', border: 'none' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Как прошел ваш день?</h3>
                    <form onSubmit={handleCreate}>
                        <textarea
                            placeholder="Опишите свои мысли и чувства..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            style={{ height: '150px', marginBottom: '1.5rem', background: 'var(--white)' }}
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Сохранить запись</button>
                    </form>
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', border: '2px solid var(--success)', background: '#F0FFF4' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <h3 style={{ color: '#22543D', margin: 0 }}>Запись на сегодня готова</h3>
                    <p style={{ color: '#2F855A', fontSize: '0.9rem', marginTop: '0.5rem' }}>Вы можете просмотреть или дополнить её ниже.</p>
                </div>
            )}

            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>История записей</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {entries.map(entry => (
                        <div key={entry.id} className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--p-100)', paddingBottom: '1rem' }}>
                                <span style={{ fontWeight: '700', color: 'var(--p-600)' }}>{new Date(entry.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--slate-800)' }}>{entry.text || entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
