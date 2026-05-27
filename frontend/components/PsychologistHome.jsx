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
        <div className="animate-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>Добро пожаловать, {user.fullName || 'Доктор'}!</h1>
                <p style={{ color: 'var(--slate-500)', fontSize: '1.1rem' }}>Ваша практика сегодня: у вас {clients.length} активных сессий в обзоре.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                {/* CLIENT OVERVIEW */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.4rem' }}>Недавние клиенты</h2>
                        <Link to="/psychologist/clients" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Все клиенты →</Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {clients.map(client => (
                            <div key={client.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0 }}>{client.fullName || client.username}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>Последняя активность: Вчера</p>
                                </div>
                                <Link to={`/psychologist/client/${client.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    Открыть карту
                                </Link>
                            </div>
                        ))}
                        {clients.length === 0 && <p style={{ color: 'var(--slate-400)' }}>У вас пока нет прикрепленных клиентов.</p>}
                    </div>
                </section>

                {/* QUICK CALENDAR / TASKS */}
                <section>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Расписание сессий</h2>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <PsychologistCalendar />
                    </div>
                </section>
            </div>
        </div>
    );
}
