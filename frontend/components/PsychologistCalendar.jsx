import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast from 'react-hot-toast';

export default function PsychologistCalendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', time: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const psychId = user.id;

    useEffect(() => {
        if (psychId) fetchEvents();
    }, [psychId]);

    const fetchEvents = async () => {
        const res = await fetch(`/api/psychologist-tools/events?psychologistId=${psychId}`);
        if (res.ok) setEvents(await res.json());
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];

        const res = await fetch('/api/psychologist-tools/events', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                psychologistId: String(psychId),
                title: newEvent.title,
                time: newEvent.time,
                date: dateString
            })
        });

        if (res.ok) {
            setNewEvent({ title: '', time: '' });
            fetchEvents();
        } else {
            toast.error("Ошибка при создании события");
        }
    };

    const handleDelete = async (id) => {
        await fetch(`/api/psychologist-tools/events/${id}`, { method: 'DELETE' });
        fetchEvents();
    };

    const selectedDateEvents = events.filter(ev =>
        new Date(ev.date).toDateString() === date.toDateString()
    );

    return (
        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="custom-calendar"
                    tileContent={({ date, view }) => {
                        if (events.find(ev => new Date(ev.date).toDateString() === date.toDateString())) {
                            return <div style={{ height: '4px', width: '4px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%', margin: '2px auto 0' }}></div>
                        }
                    }}
                />
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
                <h3 style={{ fontSize: '15px', marginBottom: 'var(--space-md)' }}>События на {date.toLocaleDateString()}</h3>

                <form onSubmit={handleAddEvent} style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            className="input-field"
                            placeholder="14:00"
                            value={newEvent.time}
                            onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                            style={{ width: '80px' }}
                            required
                        />
                        <input
                            className="input-field"
                            placeholder="Название события"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>+ Добавить</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDateEvents.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '13px' }}>Нет запланированных событий.</p>}
                    {selectedDateEvents.map(ev => (
                        <div key={ev.id} style={{
                            padding: '10px 14px', 
                            background: 'var(--bg-surface-2)', 
                            borderRadius: 'var(--radius-md)',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <div>
                                <span style={{ fontWeight: '700', color: 'var(--accent-primary)', marginRight: '10px', fontSize: '13px' }}>{ev.time}</span>
                                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ev.title}</span>
                            </div>
                            <button onClick={() => handleDelete(ev.id)} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
