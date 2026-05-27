import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'CLIENT' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
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
        <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 0 }}>
            <div className="diary-container animate-up" style={{ maxWidth: '480px', width: '100%', padding: '3.5rem 2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Присоединиться</h2>
                    <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Начните свой путь к осознанности</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--slate-600)' }}>РОЛЬ В СИСТЕМЕ</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ 
                                cursor: 'pointer', 
                                border: '2px solid var(--p-100)',
                                background: 'var(--p-100)',
                                color: 'var(--slate-800)',
                                fontWeight: '600'
                            }}
                        >
                            <option value="CLIENT">Я — Клиент</option>
                            <option value="PSYCHOLOGIST">Я — Специалист (Психолог)</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--slate-600)' }}>ЛОГИН</label>
                        <input
                            type="text"
                            placeholder="Придумайте username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--slate-600)' }}>ПАРОЛЬ</label>
                        <input
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Создать мой кабинет</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                    Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--p-600)', fontWeight: '700', textDecoration: 'none' }}>Войти</Link>
                </div>
            </div>
        </div>
    );
}
