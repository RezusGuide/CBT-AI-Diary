import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

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
        fetch(API_URL(`/api/assignments/psychologist/${user.id}`)).then(res => res.json()).then(data => setAssignments(data));
    };

    const fetchClients = () => {
        fetch(API_URL(`/api/psychologist/clients/my?psychologistId=${user.id}`)).then(res => res.json()).then(data => setClients(data));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        fetch(API_URL('/api/assignments'), {
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
        <div>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Программа терапии</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Назначение и контроль выполнения заданий</p>
                </div>
                <button className="btn-primary" onClick={() => setIsCreating(true)}>+ Назначить задание</button>
            </header>

            {isCreating && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', background: 'var(--bg-surface-2)' }}>
                    <h3 className="card-header">Новое задание</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                            <div>
                                <label className="input-label">Название</label>
                                <input className="input-field" placeholder="Напр. Техника 5-4-3-2-1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="input-label">Получатель</label>
                                <select className="input-field" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} required style={{ cursor: 'pointer' }}>
                                    <option value="">Выберите клиента...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.username}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <label className="input-label">Инструкции</label>
                            <textarea className="input-field" placeholder="Опишите инструкции для клиента..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ height: '120px', resize: 'none' }} required />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Отправить клиенту</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Отмена</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {assignments.map(item => (
                    <div key={item.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <span className={`badge ${item.isCompleted ? 'badge-emerald' : 'badge-amber'}`}>
                                {item.isCompleted ? 'Выполнено' : 'В процессе'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '14px', lineHeight: 1.6 }}>{item.description}</p>
                        
                        {item.clientAnswer && (
                            <div style={{ background: 'var(--bg-surface-2)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-tasks)' }}>
                                <div className="input-label" style={{ color: 'var(--color-tasks)', marginBottom: '8px' }}>ОТВЕТ КЛИЕНТА:</div>
                                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', fontStyle: 'italic' }}>{item.clientAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
                
                {assignments.length === 0 && !isCreating && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', border: '1px dashed var(--border-subtle)' }}>
                        <div style={{ fontSize: '40px', marginBottom: 'var(--space-sm)' }}>🎯</div>
                        <p style={{ color: 'var(--text-muted)' }}>Назначенных заданий пока нет.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
