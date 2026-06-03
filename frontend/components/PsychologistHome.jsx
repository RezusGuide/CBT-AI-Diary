import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PsychologistCalendar from './PsychologistCalendar';
import api from '../src/api/axiosInstance';
import { useLanguage } from '../src/i18n/LanguageContext';

export default function PsychologistHome() {
    const { t } = useLanguage();
    const [clients, setClients] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            api.get(`/api/psychologist/clients/my?psychologistId=${userId}`)
                .then(res => {
                    setClients(res.data.slice(0, 5));
                })
                .catch(e => {
                    console.error('Error fetching recent clients:', e);
                    setClients([]);
                });
        }
    }, [userId]);

    return (
        <div className="fade-in">
            <header style={{ marginBottom: 'var(--space-xl)' }}>
                <h1>{t('home_greeting')}, {user.fullName || t('profile_psychologist')}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {t('home_subtitle')}. {t('home_stat_tasks')}: {clients.length}.
                </p>
            </header>

            <div className="two-col-layout">
                {}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h2>{t('clients_recent')}</h2>
                        <Link to="/psychologist/clients" style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '14px' }}>
                            {t('clients_all')} →
                        </Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {clients.map(client => (
                            <div key={client.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: 'var(--radius-md)', 
                                    background: 'var(--bg-surface-2)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontSize: '18px' 
                                }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '15px' }}>{client.fullName || client.username}</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                        {t('clients_last_activity')}: {t('clients_yesterday')}
                                    </p>
                                </div>
                                <Link to={`/psychologist/client/${client.id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                                    {t('clients_open_card')}
                                </Link>
                            </div>
                        ))}
                        {clients.length === 0 && (
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', border: '1px dashed var(--border-subtle)' }}>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('clients_empty')}</p>
                            </div>
                        )}
                    </div>
                </section>

                {}
                <section>
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('nav_diary')}</h2>
                    <div className="card" style={{ padding: 'var(--space-md)' }}>
                        <PsychologistCalendar />
                    </div>
                </section>
            </div>
        </div>
    );
}
