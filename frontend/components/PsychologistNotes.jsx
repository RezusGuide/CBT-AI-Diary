import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PsychologistNotes() {
    const [notes, setNotes] = useState([]);
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', clientId: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchNotes();
        fetchClients();
    }, []);

    const fetchNotes = () => {
        fetch(`/api/notes/psychologist/${user.id}`).then(res => res.json()).then(data => setNotes(data));
    };

    const fetchClients = () => {
        fetch(`/api/psychologist/clients/my?psychologistId=${user.id}`).then(res => res.json()).then(data => setClients(data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, psychologistId: user.id })
        }).then(() => {
            setIsCreating(false);
            setFormData({ title: '', content: '', clientId: '' });
            fetchNotes();
            toast.success("Заметка сохранена");
        });
    };

    return (
        <div>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Личные заметки</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Конфиденциальные записи о прогрессе сессий</p>
                </div>
                <button className="btn-primary" onClick={() => setIsCreating(true)}>+ Новая заметка</button>
            </header>

            {isCreating && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', background: 'var(--bg-surface-2)' }}>
                    <h3 className="card-header">Создать заметку</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                            <div>
                                <label className="input-label">Заголовок</label>
                                <input 
                                    className="input-field"
                                    placeholder="Напр. Сессия №5" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label">Клиент</label>
                                <select 
                                    className="input-field"
                                    value={formData.clientId}
                                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                                    required
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="">Выберите клиента...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.username}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <label className="input-label">Содержание</label>
                            <textarea 
                                className="input-field"
                                placeholder="Напишите ваши наблюдения..." 
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                style={{ height: '150px', resize: 'none' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Сохранить</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
                {notes.map(note => (
                    <div key={note.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{note.title}</h3>
                                <div className="badge badge-violet" style={{ marginTop: '6px' }}>Клиент: {note.client?.fullName || '—'}</div>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{note.content}</p>
                    </div>
                ))}
                
                {notes.length === 0 && !isCreating && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📝</div>
                        <p>Список заметок пока пуст.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
