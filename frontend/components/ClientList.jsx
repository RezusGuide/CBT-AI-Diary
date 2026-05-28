import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../src/api';
import toast from 'react-hot-toast';

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [unassigned, setUnassigned] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'discover'
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (activeTab === 'active') {
            fetchActiveClients();
        } else {
            fetchUnassigned();
        }
    }, [activeTab, search, user.id]);

    const fetchActiveClients = () => {
        const psychId = user.id;
        const url = `/api/psychologist/clients/my?psychologistId=${psychId}${search ? `&search=${search}` : ''}`;
        fetch(API_URL(url)).then(res => res.ok ? res.json() : []).then(data => setClients(data));
    };

    const fetchUnassigned = () => {
        fetch(API_URL('/api/users/unassigned'))
            .then(res => res.json())
            .then(data => {
                const filtered = search 
                    ? data.filter(c => (c.fullName || c.username).toLowerCase().includes(search.toLowerCase()))
                    : data;
                setUnassigned(filtered);
            });
    };

    const handleConnect = async (clientId) => {
        try {
            const res = await fetch(API_URL(`/api/users/me/psychologist/${user.id}?clientId=${clientId}`), {
                method: 'POST'
            });
            if (res.ok) {
                toast.success("Клиент добавлен в вашу базу");
                fetchUnassigned();
            }
        } catch (err) { console.error(err); }
    };

    const displayList = activeTab === 'active' ? clients : unassigned;

    return (
        <div>
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Мои Клиенты</h1>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <button 
                            onClick={() => setActiveTab('active')}
                            style={{ 
                                background: 'none', border: 'none', padding: '0 0 8px', cursor: 'pointer',
                                color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === 'active' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                fontWeight: activeTab === 'active' ? '600' : '400', fontSize: '14px'
                            }}
                        >
                            Активные сессии ({clients.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('discover')}
                            style={{ 
                                background: 'none', border: 'none', padding: '0 0 8px', cursor: 'pointer',
                                color: activeTab === 'discover' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === 'discover' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                fontWeight: activeTab === 'discover' ? '600' : '400', fontSize: '14px'
                            }}
                        >
                            Новые заявки
                        </button>
                    </div>
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
                {displayList.map(item => (
                    <div key={item.id} className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                            <div style={{ 
                                width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', 
                                background: 'var(--bg-surface-2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', border: '1px solid var(--border-subtle)',
                                overflow: 'hidden'
                            }}>
                                {item.profilePicture 
                                    ? <img src={item.profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
                                    : <span>👤</span>
                                }
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{item.fullName || item.username}</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID: #{item.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                        <div className="divider" style={{ margin: 'var(--space-md) 0' }} />

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 'var(--space-sm)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.email || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Телефон:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.phone || '—'}</span>
                            </div>
                        </div>

                        {activeTab === 'active' ? (
                            <Link 
                                to={`/psychologist/client/${item.id}`} 
                                className="btn-primary" 
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Открыть карту
                            </Link>
                        ) : (
                            <button 
                                onClick={() => handleConnect(item.id)}
                                className="btn-primary" 
                                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                            >
                                Принять в работу
                            </button>
                        )}
                    </div>
                ))}
                
                {displayList.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>
                            {activeTab === 'active' ? '👥' : '✨'}
                        </div>
                        <p>{activeTab === 'active' ? 'У вас пока нет прикрепленных клиентов.' : 'Новых заявок пока нет.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
