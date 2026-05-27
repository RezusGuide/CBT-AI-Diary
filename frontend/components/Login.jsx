import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('user', JSON.stringify(user));
                toast.success(`Рады видеть вас снова, ${user.fullName || user.username}!`);
                
                if (user.role === 'PSYCHOLOGIST') navigate('/psychologist');
                else navigate('/client-home');
            } else {
                toast.error("Неверный логин или пароль");
            }
        } catch (error) { toast.error("Ошибка соединения с сервером"); }
    };

    return (
        <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 0 }}>
            <div className="diary-container animate-up" style={{ maxWidth: '420px', width: '100%', padding: '3.5rem 2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Вход в систему</h2>
                    <p style={{ color: 'var(--slate-500)', marginTop: '0.5rem' }}>Продолжите работу над собой</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--slate-600)' }}>ЛОГИН</label>
                        <input
                            type="text"
                            placeholder="Ваш username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--slate-600)' }}>ПАРОЛЬ</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Войти в кабинет</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                    Впервые у нас? <Link to="/register" style={{ color: 'var(--p-600)', fontWeight: '700', textDecoration: 'none' }}>Создать аккаунт</Link>
                </div>
            </div>
        </div>
    );
}
