import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

export default function PsychologistCalendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', time: '' });

    // Правильно достаем ID психолога
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
                psychologistId: String(psychId), // Передаем как строку для безопасности парсинга
                title: newEvent.title,
                time: newEvent.time,
                date: dateString
            })
        });

        if (res.ok) {
            setNewEvent({ title: '', time: '' });
            fetchEvents();
        } else {
            alert("Ошибка при создании события");
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
        <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
            <div style={{flex: 1, minWidth: '300px'}}>
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={({ date, view }) => {
                        if (events.find(ev => new Date(ev.date).toDateString() === date.toDateString())) {
                            return <div className="event-dot" style={{height: '6px', width: '6px', backgroundColor: '#667eea', borderRadius: '50%', margin: '0 auto'}}></div>
                        }
                    }}
                />
            </div>

            <div style={{flex: 1, background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
                <h3>События на {date.toLocaleDateString()}</h3>

                <form onSubmit={handleAddEvent} style={{marginBottom: '20px', display: 'flex', gap: '15px'}}>
                    <input
                        placeholder="Время (14:00)"
                        value={newEvent.time}
                        onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                        style={{width: '120px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc'}}
                        required
                    />
                    <input
                        placeholder="Название события"
                        value={newEvent.title}
                        onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        style={{flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc'}}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{padding: '8px 15px'}}>+</button>
                </form>

                <div>
                    {selectedDateEvents.length === 0 && <p style={{color: '#999'}}>Нет событий.</p>}
                    {selectedDateEvents.map(ev => (
                        <div key={ev.id} style={{
                            padding: '10px', background: '#f5f7fa', marginBottom: '10px', borderRadius: '8px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <span style={{fontWeight: 'bold', color: '#667eea', marginRight: '10px'}}>{ev.time}</span>
                                {ev.title}
                            </div>
                            <button onClick={() => handleDelete(ev.id)} style={{border: 'none', background: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem'}}>✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}