import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from './PhaserGame';

export default function InnerWorld() {
    const [status, setStatus] = useState({ daysLogged: 0, requiredDays: 5, isUnlocked: false });
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false); // <--- Состояние: в игре ли юзер?

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) fetchStatus();
        else setLoading(false);
    }, [user.id]);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`/api/gamification/status/${user.id}`);
            if (res.ok) setStatus(await res.json());
        } catch (e) { console.error("Ошибка проверки статуса", e); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="diary-container" style={{textAlign: 'center'}}>⏳ Синхронизация...</div>;

    // ЕСЛИ ИГРОК НАЖАЛ "ВОЙТИ" - ПОКАЗЫВАЕМ ТОЛЬКО ИГРУ
    if (isPlaying) {
        return (
            <div>
                <button
                    onClick={() => setIsPlaying(false)}
                    className="btn-secondary"
                    style={{marginLeft: '20px', marginTop: '20px'}}
                >
                    ⬅ Вернуться в меню
                </button>
                <PhaserGame />
            </div>
        );
    }

    const progressPercent = Math.min((status.daysLogged / status.requiredDays) * 100, 100);

    return (
        <div className="diary-container" style={{maxWidth: '700px', textAlign: 'center', padding: '50px 20px'}}>
            <div style={{fontSize: '5rem', marginBottom: '20px'}}>🌱</div>
            <h1 style={{color: '#2c3e50', marginBottom: '15px'}}>Ваш Внутренний Мир</h1>

            {!status.isUnlocked ? (
                <div style={{background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
                    <p style={{color: '#64748b', fontSize: '1.1rem', marginBottom: '30px'}}>
                        Ваш сад еще формируется. Продолжайте вести дневник.
                    </p>
                    <div style={{marginBottom: '10px', fontWeight: 'bold', color: '#475569'}}>
                        Собрано энергии: {status.daysLogged} / {status.requiredDays}
                    </div>
                    <div style={{width: '100%', height: '20px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '30px'}}>
                        <div style={{width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)', transition: 'width 1s ease-in-out'}}></div>
                    </div>
                    <button onClick={() => navigate('/diary')} className="btn-primary" style={{padding: '10px 30px', fontSize: '1.1rem'}}>Перейти в дневник ✍️</button>
                </div>
            ) : (
                <div style={{background: '#ecfdf5', padding: '40px 30px', borderRadius: '16px', border: '2px solid #10b981', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)'}}>
                    <h2 style={{color: '#065f46', marginTop: 0}}>Сад готов!</h2>
                    <p style={{color: '#047857', fontSize: '1.1rem', marginBottom: '30px'}}>
                        Войдите, чтобы ухаживать за растениями и восстанавливать гармонию.
                    </p>
                    <button
                        onClick={() => setIsPlaying(true)} // <--- Запускаем игру
                        className="btn-primary"
                        style={{padding: '15px 40px', fontSize: '1.2rem', background: '#10b981', border: 'none', borderRadius: '50px', boxShadow: '0 4px 15px rgba(16,185,129,0.4)'}}
                    >
                        Войти в свой мир ✨
                    </button>
                </div>
            )}
        </div>
    );
}