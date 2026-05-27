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
        <div>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Мои Клиенты</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Управление вашей базой активных сессий</p>
                </div>
                <div style={{ width: '300px' }}>
                    <input 
                        className="input-field"
                        type="text" 
                        placeholder="🔍 Поиск по имени..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
                {clients.map(client => (
                    <div key={client.id} className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                            <div style={{ 
                                width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', 
                                background: 'var(--bg-surface-2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', border: '1px solid var(--border-subtle)'
                            }}>
                                👤
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{client.fullName || client.username}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID: #{client.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                        <div className="divider" style={{ margin: 'var(--space-md) 0' }} />

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 'var(--space-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{client.email || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Телефон:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{client.phone || '—'}</span>
                            </div>
                        </div>

                        <Link 
                            to={`/psychologist/client/${client.id}`} 
                            className="btn-primary" 
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Открыть карту
                        </Link>
                    </div>
                ))}
                
                {clients.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>👥</div>
                        <p>У вас пока нет прикрепленных клиентов.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
