import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../src/api/axiosInstance';
import toast from 'react-hot-toast';
import { useLanguage } from '../src/i18n/LanguageContext';

export default function ClientList() {
    const { t } = useLanguage();
    const [clients, setClients] = useState([]);
    const [unassigned, setUnassigned] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('active'); 
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (activeTab === 'active') {
            fetchActiveClients();
        } else {
            fetchUnassigned();
        }
    }, [activeTab, search, userId]);

    const fetchActiveClients = () => {
        const url = `/api/psychologist/clients/my?psychologistId=${userId}${search ? `&search=${search}` : ''}`;
        api.get(url).then(res => setClients(res.data)).catch(() => setClients([]));
    };

    const fetchUnassigned = () => {
        api.get('/api/users/unassigned')
            .then(res => {
                const data = res.data;
                const filtered = search 
                    ? data.filter(c => (c.fullName || c.username).toLowerCase().includes(search.toLowerCase()))
                    : data;
                setUnassigned(filtered);
            }).catch(() => setUnassigned([]));
    };

    const handleConnect = async (clientId) => {
        try {
            await api.post(`/api/users/me/psychologist/${userId}?clientId=${clientId}`);
            toast.success(t('clients_connected_toast'));
            fetchUnassigned();
        } catch (err) { console.error(err); }
    };

    const displayList = activeTab === 'active' ? clients : unassigned;

    return (
        <div className="fade-in">
            <header style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                    <h1>{t('clients_title')}</h1>
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
                            {t('clients_current')} ({clients.length})
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
                            {t('clients_pending')}
                        </button>
                    </div>
                </div>
                <div style={{ minWidth: '250px', flex: '1', maxWidth: '400px' }}>
                    <input 
                        className="input-field"
                        type="text" 
                        placeholder={t('profile_search_ph')} 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="cards-grid">
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
                                <span style={{ color: 'var(--text-muted)' }}>{t('profile_email')}:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.email || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{t('profile_phone')}:</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.phone || '—'}</span>
                            </div>
                        </div>

                        {activeTab === 'active' ? (
                            <Link 
                                to={`/psychologist/client/${item.id}`} 
                                className="btn-primary" 
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {t('clients_open_card')}
                            </Link>
                        ) : (
                            <button 
                                onClick={() => handleConnect(item.id)}
                                className="btn-primary" 
                                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                            >
                                {t('clients_connect')}
                            </button>
                        )}
                    </div>
                ))}
                
                {displayList.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>
                            {activeTab === 'active' ? '👥' : '✨'}
                        </div>
                        <p>{activeTab === 'active' ? t('clients_empty') : t('clients_pending_empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
