import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DailyAdvice() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Все');

    useEffect(() => {
        if (user.id) fetchAdvice();
    }, [user.id]);

    const fetchAdvice = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ai-advice/daily/${user.id}`);
            if (!res.ok) {
                toast.error('Could not generate advice');
                return;
            }
            setAdvice(await res.json());
        } catch (error) {
            console.error(error);
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Все', 'Ментальное', 'Физическое', 'Отношения', 'Карьера'];

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1>AI Daily Guide</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Персональные рекомендации на основе вашего состояния</p>
                </div>
                <button onClick={fetchAdvice} className="btn-primary" disabled={loading}>
                    {loading ? 'Thinking...' : 'Обновить'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {loading && !advice ? (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                            <p>Генерация персональных советов...</p>
                        </div>
                    ) : advice ? (
                        <>
                            <div className="card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: 'var(--radius-full)', 
                                        background: 'var(--accent-primary-glow)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>✨</div>
                                    <h3 style={{ margin: 0 }}>Рекомендация на день</h3>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                                    Ваше настроение сегодня: <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{advice.todayMood || 'не выбрано'}</span>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                                    {advice.advice}
                                </div>
                                <div className="divider" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="badge badge-violet">Психология</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-accent)', cursor: 'pointer' }}>Сохранить</span>
                                </div>
                            </div>

                            {advice.tasks && advice.tasks.length > 0 && (
                                <div className="card">
                                    <h3 className="card-header">Практические задания</h3>
                                    <ul style={{ listStyle: 'none' }}>
                                        {advice.tasks.map((task, index) => (
                                            <li key={index} style={{ 
                                                display: 'flex', 
                                                gap: '12px', 
                                                marginBottom: 'var(--space-sm)',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                <span style={{ color: 'var(--accent-primary)' }}>•</span>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {advice.source === 'local' && (
                                <div className="card" style={{ background: 'rgba(249, 115, 22, 0.05)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', margin: 0 }}>
                                        ⚠️ Режим локальной работы. Подключите OpenAI API для более глубокого анализа.
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                            <p>Нет доступных советов. Нажмите "Обновить", чтобы сгенерировать их.</p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div className="card">
                        <h3 className="card-header">Категории</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {categories.map(cat => (
                                <span 
                                    key={cat}
                                    className={`badge ${activeCategory === cat ? 'badge-violet' : ''}`}
                                    style={{ 
                                        cursor: 'pointer',
                                        background: activeCategory === cat ? 'var(--accent-primary)' : 'var(--bg-overlay)',
                                        color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                                        border: '1px solid var(--border-subtle)'
                                    }}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ background: 'var(--bg-surface-2)' }}>
                        <h3 className="card-header">Полезно знать</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            AI анализирует ваши последние записи в дневнике и текущее настроение, чтобы подобрать наиболее актуальные практики КПТ.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
