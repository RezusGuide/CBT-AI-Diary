import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'CLIENT' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Регистрация успешна! Теперь вы можете войти.");
                navigate('/login');
            } else {
                toast.error("Ошибка при регистрации");
            }
        } catch (error) { toast.error("Ошибка соединения"); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo" style={{ fontSize: '3rem' }}>🌱</div>
                <h2 className="auth-title">Присоединиться</h2>
                <p className="auth-subtitle">Начните свой путь к осознанности</p>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="input-label">Роль в системе</label>
                        <select
                            className="input-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="CLIENT">Я — Клиент</option>
                            <option value="PSYCHOLOGIST">Я — Специалист (Психолог)</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label className="input-label">Логин</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Придумайте username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label className="input-label">Пароль</label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Создать мой кабинет</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Уже есть аккаунт? </span>
                    <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Войти</Link>
                </div>
            </div>
        </div>
    );
}
