import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const moodToScore = (mood) => {
    const scores = { "Депрессивно": 1, "Подавлено": 2, "Грустно": 3, "Раздраженно": 4, "Удовлетворённо": 6, "Радостно": 8, "Счастливо": 9, "Восторженно": 10 };
    return scores[mood] || 5;
};

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('diary');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Загрузка данных клиента
        fetch(`/api/users/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Client not found');
                return res.json();
            })
            .then(data => setClient(data))
            .catch(err => {
                console.error(err);
                toast.error("Ошибка загрузки профиля");
            })
            .finally(() => setLoading(false));

        // 2. Загрузка настроения
        fetch(`/api/psychologist/client/${id}/mood-history`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data)) {
                    const formatted = data.map(item => ({
                        date: new Date(item.date).toLocaleDateString(),
                        score: moodToScore(item.mood),
                        moodName: item.mood
                    }));
                    setMoodHistory(formatted);
                }
            })
            .catch(() => {});
    }, [id]);

    useEffect(() => {
        // 3. Загрузка записей (дневник или сны)
        const endpoint = activeTab === 'diary' ? `/api/diary/user/${id}` : `/api/dreams/user/${id}`;
        fetch(endpoint)
            .then(res => res.ok ? res.json() : [])
            .then(data => setRecords(Array.isArray(data) ? data : []))
            .catch(() => setRecords([]));
    }, [id, activeTab]);

    const handleStartChat = () => {
        if (!client) return;
        localStorage.setItem('chatTarget', JSON.stringify(client));
        navigate('/psychologist/chat');
    };

    if (loading) return <div className="diary-container">⏳ Загрузка досье...</div>;
    if (!client) return <div className="diary-container">❌ Клиент не найден</div>;

    return (
        <div className="diary-container" style={{maxWidth: '1000px'}}>
            {/* ШАПКА ПРОФИЛЯ */}
            <div style={{display: 'flex', gap: '30px', marginBottom: '30px', alignItems: 'center', flexWrap: 'wrap'}}>
                <div className="avatar-circle" style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: '#667eea', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    {client.photoUrl ? (
                        <img src={`http://localhost:8080${client.photoUrl}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="avatar" />
                    ) : (
                        <span style={{fontSize: '2rem', color: 'white'}}>{client.username?.charAt(0).toUpperCase()}</span>
                    )}
                </div>

                <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
                        <h1 style={{margin: 0}}>{client.fullName || client.username}</h1>
                        <button onClick={handleStartChat} className="btn-primary" style={{padding: '10px 20px'}}>
                            💬 Написать сообщение
                        </button>
                    </div>
                    <p style={{color: '#666', margin: '5px 0'}}>@{client.username}</p>
                    <div style={{marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem'}}>
                        <div>📧 {client.email || 'Нет Email'}</div>
                        <div>📞 {client.phone || 'Нет телефона'}</div>
                    </div>
                </div>
            </div>

            {/* ГРАФИК */}
            <div style={{height: '350px', background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #eee'}}>
                <h3>Динамика настроения</h3>
                {moodHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="90%" minWidth={300} minHeight={250}>
                        <LineChart data={moodHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p style={{color: '#999', textAlign: 'center', marginTop: '50px'}}>Нет данных для графика</p>
                )}
            </div>

            {/* ВКЛАДКИ */}
            <div style={{marginBottom: '20px'}}>
                <button
                    className={activeTab === 'diary' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveTab('diary')}
                    style={{marginRight: '10px'}}
                >
                    📖 Дневник
                </button>
                <button
                    className={activeTab === 'dreams' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveTab('dreams')}
                >
                    🌙 Сны
                </button>
            </div>

            {/* СПИСОК ЗАПИСЕЙ */}
            <div className="entry-list">
                {records.length === 0 && <p style={{color: '#999'}}>Записей пока нет.</p>}

                {records.map(rec => (
                    <div key={rec.id} className="entry-item">
                        <small style={{color: '#888'}}>{new Date(rec.createdAt).toLocaleString()}</small>
                        {/* Поддержка разных имен полей */}
                        <p style={{marginTop: '10px', whiteSpace: 'pre-wrap'}}>{rec.text || rec.content}</p>

                        {(rec.aiAnalysis || rec.interpretation) && (
                            <div style={{background: '#f0f9ff', padding: '15px', marginTop: '10px', borderRadius: '8px', borderLeft: '4px solid #667eea'}}>
                                <strong>💡 AI Анализ:</strong> {rec.aiAnalysis || rec.interpretation}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}