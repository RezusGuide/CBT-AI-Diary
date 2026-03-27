import React, { useState, useEffect } from 'react';
import './App.css';

export default function PsychologistNotes() {
    const [notes, setNotes] = useState([]);
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', clientId: '' });
    const [editingId, setEditingId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const psychologistId = user.id;

    useEffect(() => {
        if (psychologistId) {
            fetchNotes();
            fetchClients();
        }
    }, [psychologistId]);

    const fetchNotes = async () => {
        const res = await fetch(`/api/psychologist-tools/notes?psychologistId=${psychologistId}`);
        if (res.ok) setNotes(await res.json());
    };

    const fetchClients = async () => {
        const res = await fetch(`/api/psychologist/clients/my?psychologistId=${psychologistId}`);
        if (res.ok) setClients(await res.json());
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingId ? `/api/psychologist-tools/notes/${editingId}` : '/api/psychologist-tools/notes';
        const method = editingId ? 'PUT' : 'POST';

        const body = editingId
            ? { title: formData.title, content: formData.content }
            : { ...formData, psychologistId: psychologistId };

        await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', content: '', clientId: '' });
        fetchNotes();
    };

    const handleEdit = (note) => {
        setFormData({ title: note.title, content: note.content, clientId: note.client?.id || '' });
        setEditingId(note.id);
        setIsCreating(true);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Удалить заметку?")) return;
        await fetch(`/api/psychologist-tools/notes/${id}`, { method: 'DELETE' });
        fetchNotes();
    };

    return (
        <div className="diary-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Приватные заметки</h1>
                <button className="btn-primary" onClick={() => { setIsCreating(!isCreating); setEditingId(null); setFormData({title:'', content:'', clientId:''}); }}>
                    {isCreating ? 'Отмена' : '+ Создать заметку'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSave} style={{background: '#e0e7ff', padding: '20px', borderRadius: '10px', marginBottom: '30px'}}>
                    <h3>{editingId ? 'Редактировать заметку' : 'Новая заметка'}</h3>

                    {!editingId && (
                        <select
                            value={formData.clientId}
                            onChange={e => setFormData({...formData, clientId: e.target.value})}
                            required
                            style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px'}}
                        >
                            <option value="">-- Выберите клиента --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName || c.username}</option>
                            ))}
                        </select>
                    )}

                    <input
                        placeholder="Заголовок (например: 'Наблюдения по снам')"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none'}}
                    />

                    <textarea
                        placeholder="Текст заметки..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        required
                        style={{width: '100%', height: '150px', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none'}}
                    />

                    <button type="submit" className="btn-primary">Сохранить</button>
                </form>
            )}

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                {notes.length === 0 && <p>Заметок пока нет.</p>}
                {notes.map(note => (
                    <div key={note.id} style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderTop: '4px solid #667eea'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <small style={{color: '#888'}}>{new Date(note.createdAt).toLocaleDateString()}</small>
                            <div>
                                <button onClick={() => handleEdit(note)} style={{border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px'}}>✏️</button>
                                <button onClick={() => handleDelete(note.id)} style={{border: 'none', background: 'none', cursor: 'pointer', color: 'red'}}>🗑️</button>
                            </div>
                        </div>

                        <h3 style={{marginTop: '5px', marginBottom: '5px'}}>{note.title}</h3>
                        <div style={{color: '#667eea', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px'}}>
                            Клиент: {note.client?.fullName || note.client?.username}
                        </div>

                        <p style={{whiteSpace: 'pre-wrap', color: '#444'}}>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}