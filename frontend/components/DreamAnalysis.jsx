import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DreamAnalysis() {
    const [dreams, setDreams] = useState([]);
    const [newDream, setNewDream] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [showForm, setShowForm] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) fetchDreams();
    }, [user.id]);

    const fetchDreams = async () => {
        try {
            const res = await fetch(`/api/dreams/user/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setDreams(sorted);
            }
        } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDream.trim()) return;

        const res = await fetch('/api/dreams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, text: newDream })
        });

        if (res.ok) {
            setNewDream('');
            setShowForm(false);
            fetchDreams();
            toast.success("Сон сохранен 🌙");
        } else {
            const message = await res.text();
            toast.error(message || "Не удалось сохранить сон");
        }
    };

    const startEdit = (dream) => {
        setEditingId(dream.id);
        setEditContent(dream.content || dream.text);
    };

    const handleUpdate = async (id) => {
        const res = await fetch(`/api/dreams/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: editContent })
        });

        if (res.ok) {
            setEditingId(null);
            fetchDreams();
            toast.success("Запись сна обновлена");
        }
    };

    const handleDelete = async (id) => {
        const res = await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchDreams();
            toast.success("Сон удален");
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ position: 'relative', marginBottom: 'var(--space-xl)' }}>
                <div style={{ 
                    position: 'absolute', 
                    top: '-20px', 
                    left: '-20px', 
                    right: '-20px', 
                    height: '100px', 
                    background: 'rgba(56, 189, 248, 0.08)', 
                    zIndex: -1,
                    borderRadius: 'var(--radius-xl)'
                }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-md)' }}>
                    <h1>Дневник Снов</h1>
                    {!showForm && (
                        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>
                            Записать сон
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', borderLeft: '4px solid var(--color-dreams)' }}>
                    <h3 className="card-header">Новое сновидение</h3>
                    <form onSubmit={handleCreate}>
                        <textarea
                            className="input-field"
                            placeholder="Опишите, что вам приснилось..."
                            value={newDream}
                            onChange={(e) => setNewDream(e.target.value)}
                            style={{ height: '120px', marginBottom: 'var(--space-md)', resize: 'none' }}
                            required
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>Сохранить сон</button>
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {dreams.length === 0 && !showForm && (
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
                        <div style={{ fontSize: '40px', marginBottom: 'var(--space-sm)' }}>🌙</div>
                        <p>Вы еще не записывали свои сны.</p>
                    </div>
                )}

                {dreams.map(dream => (
                    <div key={dream.id} className="card" style={{ borderLeft: '4px solid var(--color-dreams)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="badge badge-sky">{new Date(dream.createdAt).toLocaleDateString()}</span>
                                <span style={{ fontSize: '18px' }}>🌙</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => startEdit(dream)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>✏️</button>
                                <button onClick={() => handleDelete(dream.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: '#f87171' }}>🗑️</button>
                            </div>
                        </div>

                        {editingId === dream.id ? (
                            <div>
                                <textarea
                                    className="input-field"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    style={{ height: '150px', marginBottom: 'var(--space-md)', resize: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleUpdate(dream.id)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>Сохранить</button>
                                    <button onClick={() => setEditingId(null)} className="btn-secondary">Отмена</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Сон в {new Date(dream.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    whiteSpace: 'pre-wrap',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    marginBottom: 'var(--space-md)'
                                }}>
                                    {dream.content || dream.text}
                                </p>
                                <div className="divider" style={{ margin: 'var(--space-sm) 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <span className="badge badge-sky">#сновидение</span>
                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>#подсознание</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <span>Настроение перед сном:</span>
                                        <span style={{ color: 'var(--color-dreams)' }}>Спокойное 🧘</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
