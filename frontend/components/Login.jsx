import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
                toast.success(`Добро пожаловать, ${data.fullName || data.username}!`, { duration: 2500 });
                
                if (data.role === 'PSYCHOLOGIST') {
                    navigate('/psychologist');
                } else {
                    navigate('/client-home');
                }
            } else {
                toast.error("Неверный логин или пароль");
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
            toast.error("Ошибка соединения с сервером");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo" style={{ fontSize: '3rem' }}>🌱</div>
                <h2 className="auth-title">Вход в систему</h2>
                <p className="auth-subtitle">С возвращением в ваш уголок спокойствия</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="input-label">Логин</label>
                        <input
                            className="input-field"
                            type="text"
                            name="username"
                            placeholder="Ваш username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label className="input-label">Пароль</label>
                        <input
                            className="input-field"
                            type="password"
                            name="password"
                            placeholder="Ваш пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Войти</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Нет аккаунта? </span>
                    <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Зарегистрироваться</Link>
                </div>
            </div>
            
            {/* Ambient background elements handled by .auth-page in CSS if needed, 
                but we can add them here as well for extra effect as per Step 3 */}
            <div className="app-layout" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            </div>
        </div>
    );
};

export default Login;
