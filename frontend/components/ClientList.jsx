import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Добавили useNavigate

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate(); // Инициализируем навигацию

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const psychId = user.id;

    useEffect(() => {
        if (psychId) fetchClients();
    }, [psychId, search]);

    const fetchClients = async () => {
        const url = `/api/psychologist/clients/my?psychologistId=${psychId}${search ? `&search=${search}` : ''}`;
        const res = await fetch(url);
        if(res.ok) setClients(await res.json());
    };

    return (
        <div className="diary-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2>Мои клиенты</h2>
                <div style={{color: '#666'}}>Всего: {clients.length}</div>
            </div>

            <input
                type="text"
                placeholder="Поиск по имени или логину..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{padding: '12px', width: '100%', marginBottom: '25px', borderRadius: '10px', border: '1px solid #ddd'}}
            />

            <div className="entry-list">
                {clients.length === 0 && <p style={{textAlign: 'center', color: '#999'}}>Клиенты не найдены.</p>}

                {/* Исправленный цикл отображения */}
                {clients.map(client => (
                    <div key={client.id} className="entry-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <div style={{width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {client.photoUrl ? (
                                    <img src={`http://localhost:8080${client.photoUrl}`} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="avatar" />
                                ) : (
                                    <span>{(client.fullName || client.username).charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <strong>{client.fullName || client.username}</strong>
                        </div>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <button
                                onClick={() => {
                                    localStorage.setItem('chatTarget', JSON.stringify(client));
                                    navigate('/psychologist/chat');
                                }}
                                className="btn-secondary"
                                style={{padding: '8px 15px'}}
                            >
                                💬 Чат
                            </button>
                            <Link to={`/psychologist/client/${client.id}`}>
                                <button className="btn-primary" style={{padding: '8px 15px'}}>Открыть карту</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}