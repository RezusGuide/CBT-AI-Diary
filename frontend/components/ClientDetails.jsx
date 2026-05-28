import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

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
    const [diaryRecords, setDiaryRecords] = useState([]);
    const [dreamRecords, setDreamRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('diary');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [generatingSummary, setGeneratingSummary] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchJson = async (url) => {
            const response = await fetch(API_URL(url));
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        };

        const loadClientDetails = async () => {
            setLoading(true);
            setError('');

            try {
                const [clientData, moodsData, diaryData, dreamsData] = await Promise.all([
                    fetchJson(`/api/users/${id}`),
                    fetchJson(`/api/psychologist/client/${id}/mood-history`),
                    fetchJson(`/api/diary/user/${id}`),
                    fetchJson(`/api/dreams/user/${id}`)
                ]);

                if (!isMounted) return;

                const formattedMoodHistory = moodsData.map(item => ({
                    ...item,
                    score: moodToScore(item.mood)
                }));

                setClient(clientData);
                setMoodHistory(formattedMoodHistory);
                setDiaryRecords(diaryData);
                setDreamRecords(dreamsData);
                setRecords(activeTab === 'dreams' ? dreamsData : diaryData);
            } catch (e) {
                console.error('Client details loading failed:', e);
                if (isMounted) {
                    setError('Не удалось загрузить досье клиента.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadClientDetails();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        setRecords(activeTab === 'dreams' ? dreamRecords : diaryRecords);
    }, [activeTab, diaryRecords, dreamRecords]);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        try {
            const res = await fetch(API_URL(`/api/psychologist/client/${id}/summary`));
            if (res.ok) {
                const text = await res.text();
                setAiSummary(text);
                toast.success("Сводка сформирована");
            } else {
                toast.error("Ошибка при генерации сводки");
            }
        } catch (e) { toast.error("Ошибка сети"); }
        finally { setGeneratingSummary(false); }
    };

    const handleStartChat = () => {
        if (!client) return;
        localStorage.setItem('chatTarget', JSON.stringify(client));
        navigate('/psychologist/chat');
    };

    if (error) return <div className="card" style={{ margin: '20px', color: '#f87171' }}>{error}</div>;
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Загрузка досье...</div>;
    if (!client) return <div className="card" style={{ margin: '20px' }}>❌ Клиент не найден</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                        <h1>{client.fullName || client.username}</h1>
                        <span className="badge badge-amber">Активный клиент</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>ID клиента: #{client.id.toString().padStart(4, '0')} • {client.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleGenerateSummary} className="btn-secondary" disabled={generatingSummary}>
                        {generatingSummary ? '⏳ Генерирую...' : '✨ AI Сводка'}
                    </button>
                    <button onClick={handleStartChat} className="btn-primary">
                        💬 Написать
                    </button>
                </div>
            </div>

            {aiSummary && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', borderLeft: '4px solid var(--accent-primary)', background: 'var(--accent-primary-glow)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                        ✨ Клиническая сводка (AI)
                    </h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
                        {aiSummary}
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <h3 className="card-header">Динамика настроения</h3>
                <div style={{ height: '300px', width: '100%', marginTop: 'var(--space-md)' }}>
                    {moodHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                                <XAxis dataKey="date" stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
                                <YAxis domain={[0, 10]} stroke="var(--text-muted)" style={{ fontSize: '11px' }} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--accent-primary)' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Нет данных для графика</div>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', gap: '10px' }}>
                <button
                    className={activeTab === 'diary' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveTab('diary')}
                    style={{ background: activeTab === 'diary' ? 'var(--color-diary)' : '' }}
                >
                    📖 Дневник
                </button>
                <button
                    className={activeTab === 'dreams' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setActiveTab('dreams')}
                    style={{ background: activeTab === 'dreams' ? 'var(--color-dreams)' : '' }}
                >
                    🌙 Сны
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {records.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)' }}>Записей пока нет.</p>}

                {records.map(rec => (
                    <div key={rec.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                            <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)' }}>{new Date(rec.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{rec.text || rec.content}</p>

                        {(rec.aiAnalysis || rec.interpretation) && (
                            <div style={{ background: 'var(--bg-surface-2)', padding: '15px', marginTop: '15px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)' }}>
                                <div className="input-label" style={{ color: 'var(--accent-primary)' }}>💡 AI Анализ:</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{rec.aiAnalysis || rec.interpretation}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
