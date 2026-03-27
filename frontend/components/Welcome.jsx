import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Welcome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем: если пользователь уже есть - не показываем этот экран, а сразу кидаем внутрь
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'PSYCHOLOGIST') {
                    navigate('/psychologist');
                } else {
                    navigate('/client-home');
                }
            } catch (e) {
                // Если данные битые - удаляем их
                localStorage.removeItem('user');
            }
        }
    }, [navigate]);

    return (
        <div className="welcome-wrapper">
            <div className="welcome-container">
                <h1>Добро пожаловать в PsyHelp</h1>
                <p>Твое безопасное пространство для ментального здоровья.</p>

                <div className="welcome-buttons">
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{padding: '15px 40px'}}>
                        Войти
                    </button>
                    <button onClick={() => navigate('/register')} className="btn-secondary" style={{padding: '15px 40px'}}>
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;