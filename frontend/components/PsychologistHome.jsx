import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PsychologistCalendar from './PsychologistCalendar';

export default function PsychologistHome() {
    const [clients, setClients] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) {
            fetch(`/api/psychologist/clients/my?psychologistId=${user.id}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => setClients(data.slice(0, 5)));
        }
    }, [user.id]);

    return (
        <div>
            <header style={{ marginBottom: 'var(--space-xl)' }}>
                <h1>Добро пожаловать, {user.fullName || 'Доктор'}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>Ваша практика сегодня: у вас {clients.length} активных сессий в обзоре.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)' }}>
                {/* CLIENT OVERVIEW */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h2>Недавние клиенты</h2>
                        <Link to="/psychologist/clients" style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '14px' }}>Все клиенты →</Link>
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
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Последняя активность: Вчера</p>
                                </div>
                                <Link to={`/psychologist/client/${client.id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                                    Открыть карту
                                </Link>
                            </div>
                        ))}
                        {clients.length === 0 && (
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', border: '1px dashed var(--border-subtle)' }}>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>У вас пока нет прикрепленных клиентов.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* QUICK CALENDAR / TASKS */}
                <section>
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>Расписание</h2>
                    <div className="card" style={{ padding: 'var(--space-md)' }}>
                        <PsychologistCalendar />
                    </div>
                </section>
            </div>
        </div>
    );
}
