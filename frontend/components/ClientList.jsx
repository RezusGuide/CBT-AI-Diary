import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const psychId = user.id;
        const url = `/api/psychologist/clients/my?psychologistId=${psychId}${search ? `&search=${search}` : ''}`;
        fetch(url).then(res => res.ok ? res.json() : []).then(data => setClients(data));
    }, [search, user.id]);

    return (
        <div className="animate-in">
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Мои Клиенты</h1>
                    <p style={{ color: 'var(--slate-500)' }}>Управление вашей базой активных сессий</p>
                </div>
                <div style={{ width: '300px' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Поиск по имени..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ background: 'var(--white)', border: '1px solid var(--slate-200)' }}
                    />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {clients.map(client => (
                    <div key={client.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            <div style={{ 
                                width: '64px', height: '64px', borderRadius: '16px', 
                                background: 'linear-gradient(135deg, var(--p-100) 0%, var(--white) 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', border: '1px solid var(--p-100)'
                            }}>
                                👤
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{client.fullName || client.username}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--slate-400)' }}>ID: #{client.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--slate-500)' }}>Email:</span>
                                <span style={{ fontWeight: '600' }}>{client.email || '—'}</span>
                            </div>
                            <Link 
                                to={`/psychologist/client/${client.id}`} 
                                className="btn-primary" 
                                style={{ width: '100%', padding: '10px' }}
                            >
                                Перейти в карту
                            </Link>
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--slate-400)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <p>У вас пока нет прикрепленных клиентов.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
