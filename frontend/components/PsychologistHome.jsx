import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import PsychologistCalendar from './PsychologistCalendar';

export default function PsychologistHome() {
    const [clients, setClients] = useState([]);

    // Получаем данные из объекта user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.fullName || user.username || 'Доктор';

    useEffect(() => {
        if (user.id) {
            // Загружаем только клиентов этого психолога
            fetch(`/api/psychologist/clients/my?psychologistId=${user.id}`)
                .then(res => res.json())
                .then(data => setClients(data.slice(0, 5)))
                .catch(err => console.error("Ошибка загрузки клиентов:", err));
        }
    }, [user.id]);

    return (
        <div className="diary-container" style={{maxWidth: '100%'}}>
            <div style={{marginBottom: '20px'}}>
                <h1>Здравствуйте, {username}! 👋</h1>
                <div style={{marginBottom: '40px'}}>
                    <h2>Мое расписание</h2>
                    <PsychologistCalendar/>
                </div>
            </div>

            <div style={{marginTop: '40px'}}>
                <h3>Ваши последние клиенты</h3>
                <div className="entry-list">
                    {clients.length === 0 && <p style={{color: '#999'}}>У вас пока нет прикрепленных клиентов.</p>}
                    {clients.map(client => (
                        <div key={client.id} className="entry-item"
                             style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <div className="avatar-circle" style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    background: '#667eea', overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                }}>
                                    {client.photoUrl ? (
                                        <img src={`http://localhost:8080${client.photoUrl}`} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    ) : (
                                        (client.fullName || client.username).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <strong>{client.fullName || client.username}</strong> <br/>
                                    <small style={{color: '#777'}}>{client.email}</small>
                                </div>
                            </div>
                            <Link to={`/psychologist/client/${client.id}`}>
                                <button className="btn-secondary" style={{padding: '8px 15px', fontSize: '0.85rem'}}>
                                    Открыть карту
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}