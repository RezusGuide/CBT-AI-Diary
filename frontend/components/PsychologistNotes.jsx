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
        <div className="animate-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Личные заметки</h1>
                    <p style={{ color: 'var(--slate-500)' }}>Конфиденциальные записи о прогрессе сессий</p>
                </div>
                <button className="btn-primary" onClick={() => setIsCreating(true)}>+ Новая заметка</button>
            </header>

            {isCreating && (
                <div className="glass-card animate-up" style={{ marginBottom: '3rem', background: 'var(--p-100)', border: 'none' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <input 
                                placeholder="Заголовок (напр. Сессия №5)" 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <select 
                                value={formData.clientId}
                                onChange={e => setFormData({...formData, clientId: e.target.value})}
                                required
                            >
                                <option value="">Выберите клиента...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.username}</option>)}
                            </select>
                        </div>
                        <textarea 
                            placeholder="Напишите ваши наблюдения..." 
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            style={{ height: '200px', marginBottom: '1.5rem', background: 'white' }}
                            required
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn-primary">Сохранить заметку</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {notes.map(note => (
                    <div key={note.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{note.title}</h3>
                                <small style={{ color: 'var(--p-600)', fontWeight: '700' }}>Клиент: {note.client?.fullName || '—'}</small>
                            </div>
                            <small style={{ color: 'var(--slate-400)' }}>{new Date(note.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
