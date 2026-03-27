import React, { useState, useEffect } from 'react';
import { EMOTION_THEMES } from '../src/themes';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ClientHome() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) { return {}; }
    });

    const [psychologists, setPsychologists] = useState([]);
    const [moodSelected, setMoodSelected] = useState(false);
    const [loading, setLoading] = useState(true);

    // Замени этот кусок в ClientHome.jsx

    useEffect(() => {
        if (user.id) {
            checkTodayMood();
        }
        loadPsychologists();
    }, [user.id]);

    const checkTodayMood = async () => {
        try {
            const res = await fetch(`/api/mood/today/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.mood && data.mood !== "") {
                    // Если сервер вернул настроение за сегодня - скрываем меню выбора
                    setMoodSelected(true);

                    // Устанавливаем глобальную тему (как мы делали в App.jsx)
                    localStorage.setItem(`mood_${user.id}_${new Date().toDateString()}`, data.mood);
                }
            }
        } catch (e) { console.error(e); }
    };

    const handleMoodClick = async (moodKey) => {
        // Отправляем настроение НА СЕРВЕР
        try {
            await fetch(`/api/mood/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: moodKey })
            });

            // Сохраняем локально для мгновенной смены темы
            localStorage.setItem(`mood_${user.id}_${new Date().toDateString()}`, moodKey);
            setMoodSelected(true);
            toast.success("Настроение сохранено");
            setTimeout(() => window.location.reload(), 500);

        } catch (e) {
            toast.error("Ошибка сети");
        }
    };

    const loadPsychologists = async () => {
        try {
            const res = await fetch('/api/users/psychologists');
            if (res.ok) {
                const data = await res.json();
                setPsychologists(data);
            } else {
                console.log("Не удалось загрузить список психологов");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };



    const handleStartChat = (psych) => {
        localStorage.setItem('chatTarget', JSON.stringify(psych));
        navigate('/chat');
        toast.success(`Чат с ${psych.fullName || psych.username} создан!`);
    };

    const resetMood = () => {
        const userId = user.id || 'guest';
        const dateKey = `mood_${userId}_${new Date().toDateString()}`;
        localStorage.removeItem(dateKey);
        setMoodSelected(false);
    };

    const handleSelectPsychologist = async (psychId) => {
        try {
            const res = await fetch(`/api/users/${user.id}/select-psychologist/${psychId}`, {
                method: 'POST'
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast.success("Специалист успешно выбран!");
            } else {
                toast.error("Не удалось выбрать специалиста");
            }
        } catch (e) {
            console.error(e);
            toast.error("Ошибка соединения с сервером");
        }
    };

    if (!moodSelected) {
        return (
            <div className="diary-container" style={{textAlign: 'center', marginTop: '50px'}}>
                <h1>Привет, {user.fullName || user.username || 'Друг'}! 👋</h1>
                <p style={{marginBottom: '30px', color: '#666'}}>Какое настроение преобладает сегодня?</p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center'}}>
                    {Object.keys(EMOTION_THEMES).map((key) => (
                        <button key={key} onClick={() => handleMoodClick(key)} style={{padding: '15px 30px', borderRadius: '50px', border: '1px solid #ccc', cursor: 'pointer', background: 'white'}}>
                            {EMOTION_THEMES[key].label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="diary-container">
            <div style={{textAlign: 'center', marginBottom: '40px'}}>
                <h2>Добро пожаловать!</h2>
                <button onClick={resetMood} style={{border: 'none', background: 'transparent', color: '#667eea', cursor: 'pointer', textDecoration: 'underline'}}>
                    Изменить настроение
                </button>
            </div>

            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>Наши специалисты</h3>

            {loading ? (
                <p style={{textAlign: 'center'}}>Загрузка специалистов...</p>
            ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px'}}>
                    {psychologists.length > 0 ? (
                        psychologists.map(psych => {
                            // Проверяем, является ли этот психолог нашим
                            const isMyPsychologist = user.psychologist && user.psychologist.id === psych.id;

                            return (
                                <div key={psych.id} style={{
                                    background: 'white',
                                    border: isMyPsychologist ? '2px solid #10b981' : '1px solid #eee',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                    position: 'relative' // Для бейджа
                                }}>

                                    {/* БЕЙДЖ "ВАШ ВЫБОР" */}
                                    {isMyPsychologist && (
                                        <div style={{position: 'absolute', top: '-10px', right: '-10px', background: '#10b981', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                                            Ваш выбор
                                        </div>
                                    )}

                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 15px',
                                        background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {psych.photoUrl ? (
                                            <img
                                                src={psych.photoUrl && psych.photoUrl.startsWith('http') ? psych.photoUrl : `http://localhost:8080${psych.photoUrl}`}
                                                alt={psych.username}
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                            />
                                        ) : (
                                            <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#64748b'}}>
                                                {(psych.fullName || psych.username).charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{margin: '0 0 5px 0'}}>{psych.fullName || psych.username}</h4>
                                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>
                                        {psych.specialization || "Психолог"}
                                    </p>

                                    {/* КНОПКИ ДЕЙСТВИЙ */}
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                        {!isMyPsychologist && (
                                            <button
                                                onClick={() => handleSelectPsychologist(psych.id)}
                                                className="btn-secondary"
                                                style={{width: '100%', padding: '10px'}}
                                            >
                                                🤝 Выбрать
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStartChat(psych)}
                                            className="btn-primary"
                                            style={{width: '100%', padding: '10px'}}
                                        >
                                            💬 Написать
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: '#999'}}>
                            <p>Психологи пока не зарегистрированы.</p>
                        </div>
                    )}
                </div>
            )}

            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div onClick={() => window.location.href='/diary'} style={{cursor: 'pointer', flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center'}}>
                    <div style={{fontSize: '2rem'}}>📖</div>
                    <h3>Дневник</h3>
                </div>
                <div onClick={() => window.location.href='/dreams'} style={{cursor: 'pointer', flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center'}}>
                    <div style={{fontSize: '2rem'}}>🌙</div>
                    <h3>Сны</h3>
                </div>
            </div>
        </div>
    );
}