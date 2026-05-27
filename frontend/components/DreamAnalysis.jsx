import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DreamAnalysis() {
    const [dreams, setDreams] = useState([]);
    const [newDream, setNewDream] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) fetchDreams();
    }, [user.id]);

    const fetchDreams = async () => {
        try {
            const res = await fetch(`/api/dreams/user/${user.id}`);
            if (res.ok) setDreams(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDream.trim()) return;

        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/dreams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, text: newDream })
            });

            if (res.ok) {
                setNewDream('');
                fetchDreams();
                toast.success("Сон сохранен и проанализирован ✨");
            }
        } catch (e) { toast.error("Ошибка AI анализа"); }
        finally { setIsAnalyzing(false); }
    };

    return (
        <div className="diary-container animate-in">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>Архив Сновидений</h1>
                <p style={{ color: 'var(--slate-500)' }}>Исследуйте символы вашего подсознания с помощью AI-анализа.</p>
            </header>

            <div className="glass-card" style={{ background: 'var(--p-100)', border: 'none', marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Что вам приснилось сегодня?</h3>
                <form onSubmit={handleCreate}>
                    <textarea
                        placeholder="Опишите сюжет, чувства и образы..."
                        value={newDream}
                        onChange={(e) => setNewDream(e.target.value)}
                        style={{ height: '120px', marginBottom: '1.5rem', background: 'var(--white)' }}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isAnalyzing}>
                        {isAnalyzing ? '🧠 Анализируем символы...' : 'Записать и получить интерпретацию'}
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {dreams.map(dream => (
                    <div key={dream.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ color: 'var(--slate-400)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                                {new Date(dream.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--slate-700)' }}>"{dream.text}"</p>
                        </div>
                        {dream.interpretation && (
                            <div className="ai-box" style={{ margin: '0 2rem 2rem' }}>
                                <div style={{ fontWeight: '800', color: '#92400E', marginBottom: '0.5rem', fontSize: '0.9rem' }}>✨ Психологическая интерпретация (AI)</div>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#744210', lineHeight: 1.7 }}>{dream.interpretation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
