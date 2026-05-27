import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('diary');
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState('');
    const [generatingSummary, setGeneratingSummary] = useState(false);

    useEffect(() => {
        fetch(`/api/users/${id}`).then(res => res.json()).then(data => setClient(data)).finally(() => setLoading(false));
        fetch(`/api/psychologist/client/${id}/mood-history`).then(res => res.json()).then(data => {
            const formatted = data.map(item => ({
                date: new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                score: moodToScore(item.mood),
                moodName: item.mood
            }));
            setMoodHistory(formatted);
        });
    }, [id]);

    useEffect(() => {
        const endpoint = activeTab === 'diary' ? `/api/diary/user/${id}` : `/api/dreams/user/${id}`;
        fetch(endpoint).then(res => res.json()).then(data => setRecords(data));
    }, [id, activeTab]);

    const moodToScore = (m) => {
        const map = { 'happy': 5, 'joy': 4, 'calm': 3, 'sad': 2, 'annoyed': 1 };
        return map[m] || 3;
    };

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        try {
            const res = await fetch(`/api/psychologist/client/${id}/summary`);
            if (res.ok) setAiSummary(await res.text());
        } catch (e) { toast.error("Ошибка AI"); }
        finally { setGeneratingSummary(false); }
    };

    if (loading) return <div className="main-content">⏳ Загрузка досье...</div>;

    return (
        <div className="animate-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--p-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800' }}>
                        {client.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ margin: 0 }}>{client.fullName || client.username}</h1>
                        <p style={{ margin: '4px 0 0', color: 'var(--slate-500)' }}>Клиент системы • {client.email}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={handleGenerateSummary} disabled={generatingSummary}>
                        {generatingSummary ? '⏳ Генерирую...' : '✨ AI Сводка'}
                    </button>
                    <button className="btn-primary" onClick={() => { localStorage.setItem('chatTarget', JSON.stringify(client)); navigate('/psychologist/chat'); }}>
                        💬 Начать сессию
                    </button>
                </div>
            </header>

            {aiSummary && (
                <div className="ai-summary-box animate-up" style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>🤖 Клинический анализ (AI)</h3>
                    <p style={{ margin: 0, lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Тренд настроения</h2>
                    <div className="glass-card" style={{ height: '350px', padding: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis hide domain={[0, 6]} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Line type="monotone" dataKey="score" stroke="var(--p-600)" strokeWidth={4} dot={{ r: 6, fill: 'var(--p-600)', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button className={`nav-item ${activeTab === 'diary' ? 'active' : ''}`} onClick={() => setActiveTab('diary')} style={{ border: 'none', background: 'transparent' }}>Дневник</button>
                        <button className={`nav-item ${activeTab === 'dreams' ? 'active' : ''}`} onClick={() => setActiveTab('dreams')} style={{ border: 'none', background: 'transparent' }}>Сны</button>
                    </div>
                    <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {records.map(rec => (
                            <div key={rec.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                <small style={{ color: 'var(--slate-400)' }}>{new Date(rec.createdAt).toLocaleDateString()}</small>
                                <p style={{ margin: '10px 0 0', fontSize: '0.95rem', lineHeight: 1.6 }}>{rec.text || rec.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
