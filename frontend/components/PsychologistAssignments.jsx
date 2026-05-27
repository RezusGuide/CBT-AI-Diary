import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PsychologistAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', clientId: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchAssignments();
        fetchClients();
    }, []);

    const fetchAssignments = () => {
        fetch(`/api/assignments/psychologist/${user.id}`).then(res => res.json()).then(data => setAssignments(data));
    };

    const fetchClients = () => {
        fetch(`/api/psychologist/clients/my?psychologistId=${user.id}`).then(res => res.json()).then(data => setClients(data));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        fetch('/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, psychologistId: user.id })
        }).then(() => {
            setIsCreating(false);
            setFormData({ title: '', description: '', clientId: '' });
            fetchAssignments();
            toast.success("Задание успешно назначено 🎯");
        });
    };

    return (
        <div className="animate-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Программа терапии</h1>
                    <p style={{ color: 'var(--slate-500)' }}>Назначение и контроль выполнения заданий</p>
                </div>
                <button className="btn-primary" onClick={() => setIsCreating(true)}>+ Назначить задание</button>
            </header>

            {isCreating && (
                <div className="glass-card animate-up" style={{ marginBottom: '3rem', background: 'var(--p-100)', border: 'none' }}>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <input placeholder="Название (напр. Техника 5-4-3-2-1)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <select value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} required>
                                <option value="">Выберите получателя...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.username}</option>)}
                            </select>
                        </div>
                        <textarea placeholder="Опишите инструкции для клиента..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ height: '120px', marginBottom: '1.5rem', background: 'white' }} required />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn-primary">Отправить клиенту</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {assignments.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className={`status-badge ${item.isCompleted ? 'badge-success' : 'badge-warning'}`}>
                                {item.isCompleted ? 'Выполнено' : 'В процессе'}
                            </div>
                            <small style={{ color: 'var(--slate-400)' }}>{new Date(item.createdAt).toLocaleDateString()}</small>
                        </div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
                        <p style={{ color: 'var(--slate-600)', margin: '0 0 20px 0', fontSize: '0.95rem' }}>{item.description}</p>
                        
                        {item.clientAnswer && (
                            <div className="ai-box" style={{ background: 'var(--p-100)', border: 'none', margin: 0 }}>
                                <div style={{ fontWeight: '800', color: 'var(--p-600)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>ОТВЕТ КЛИЕНТА:</div>
                                <p style={{ margin: 0, color: 'var(--slate-800)', fontSize: '0.95rem' }}>{item.clientAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
