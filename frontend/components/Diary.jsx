import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

export default function DiaryHome() {
    const [entries, setEntries] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [showForm, setShowForm] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) fetchEntries();
    }, [user.id]);

    const fetchEntries = async () => {
        try {
            const res = await fetch(API_URL(`/api/diary/user/${user.id}`));
            if (res.ok) {
                const data = await res.json();
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setEntries(sorted);
            }
        } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;

        const res = await fetch(API_URL('/api/diary'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, text: newText })
        });

        if (res.ok) {
            setNewText('');
            setShowForm(false);
            fetchEntries();
            toast.success("Запись сохранена!");
        } else {
            const errorText = await res.text();
            toast.error(errorText || "Ошибка сохранения");
        }
    };

    const startEdit = (entry) => {
        setEditingId(entry.id);
        setEditText(entry.text || entry.content);
    };

    const handleUpdate = async (id) => {
        const res = await fetch(API_URL(`/api/diary/${id}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: editText })
        });

        if (res.ok) {
            setEditingId(null);
            fetchEntries();
            toast.success("Запись дополнена");
        }
    };

    const handleDelete = async (id) => {
        const res = await fetch(API_URL(`/api/diary/${id}`), { method: 'DELETE' });

        if (res.ok) {
            if (editingId === id) setEditingId(null);
            fetchEntries();
            toast.success("Запись удалена");
        } else {
            toast.error("Не удалось удалить запись");
        }
    };

    const todayStr = new Date().toLocaleDateString();
    const hasTodayEntry = entries.some(entry => new Date(entry.createdAt).toLocaleDateString() === todayStr);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1>Мой Дневник</h1>
                {!hasTodayEntry && !showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>Новая запись</button>
                )}
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <h3 className="card-header">Главная мысль дня</h3>
                    <form onSubmit={handleCreate}>
                        <textarea
                            className="input-field"
                            placeholder="Опишите свои чувства и события за сегодня..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            style={{ height: '120px', marginBottom: 'var(--space-md)', resize: 'none' }}
                            required
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Сохранить запись</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            {hasTodayEntry && !editingId && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', borderColor: 'var(--color-world)', background: 'rgba(52, 211, 153, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>✅</span>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--color-world)' }}>Запись на сегодня создана</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Вы можете дополнить её или отредактировать в списке ниже.</p>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {entries.length === 0 && !showForm && (
                    <div style={{ 
                        height: '200px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'var(--bg-surface-2)',
                        border: '2px dashed var(--border-medium)',
                        borderRadius: 'var(--radius-xl)',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: 'var(--space-sm)' }}>📖</div>
                        <p>Здесь пока нет записей. Самое время начать!</p>
                    </div>
                )}

                {entries.map(entry => (
                    <div key={entry.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="badge badge-violet">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                <span style={{ fontSize: '18px' }}>✨</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => startEdit(entry)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>✏️</button>
                                <button onClick={() => handleDelete(entry.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: '#f87171' }}>🗑️</button>
                            </div>
                        </div>

                        {editingId === entry.id ? (
                            <div>
                                <textarea
                                    className="input-field"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    style={{ height: '150px', marginBottom: 'var(--space-md)', resize: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleUpdate(entry.id)} className="btn-primary">Сохранить</button>
                                    <button onClick={() => setEditingId(null)} className="btn-secondary">Отмена</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Запись от {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    whiteSpace: 'pre-wrap',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    marginBottom: 'var(--space-md)'
                                }}>
                                    {entry.text || entry.content}
                                </p>
                                <div className="divider" style={{ margin: 'var(--space-sm) 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>#дневник</span>
                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>#осознанность</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>~2 мин чтения</span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
