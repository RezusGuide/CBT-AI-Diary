import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CLIENT'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            if (response.ok) {
                alert("Регистрация успешна! Теперь войдите.");
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert("Ошибка: " + (errorData.error || "Ошибка сервера"));
            }
        } catch (error) {
            console.error(error);
            alert("Сервер недоступен");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>

                    <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px'}}>
                        <label style={{cursor: 'pointer'}}>
                            <input
                                type="radio"
                                name="role"
                                value="CLIENT"
                                checked={formData.role === 'CLIENT'}
                                onChange={handleChange}
                            /> Я Клиент
                        </label>
                        <label style={{cursor: 'pointer'}}>
                            <input
                                type="radio"
                                name="role"
                                value="PSYCHOLOGIST"
                                checked={formData.role === 'PSYCHOLOGIST'}
                                onChange={handleChange}
                            /> Я Психолог
                        </label>
                    </div>

                    <input type="text" name="username" placeholder="Имя пользователя" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Повторите пароль" onChange={handleChange} required />

                    <button type="submit" className="btn-primary">Создать аккаунт</button>
                </form>
                <div className="auth-links">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    );
}