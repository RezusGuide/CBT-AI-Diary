import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PsychologistProfile() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('fullName', user.fullName || '');
        formData.append('email', user.email || '');
        formData.append('aboutMe', user.aboutMe || '');
        if (file) formData.append('photo', file);

        fetch(`/api/users/${user.id}`, { method: 'PUT', body: formData })
            .then(res => res.json())
            .then(updated => {
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                toast.success("Ваш профиль специалиста обновлен 🩺");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="diary-container animate-in" style={{ maxWidth: '900px' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.2rem' }}>Кабинет Специалиста</h1>
                <p style={{ color: 'var(--slate-500)' }}>Настройте свой публичный профиль для доверия клиентов</p>
            </header>

            <div className="glass-card" style={{ padding: '3rem' }}>
                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '120px', height: '120px', borderRadius: '24px', 
                                background: 'var(--p-600)', overflow: 'hidden',
                                border: '4px solid white', boxShadow: 'var(--shadow-md)'
                            }}>
                                {user.photoUrl ? (
                                    <img src={`http://localhost:8080${user.photoUrl}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white' }}>🩺</div>
                                )}
                            </div>
                            <label style={{ 
                                position: 'absolute', bottom: '-10px', right: '-10px', 
                                background: 'var(--slate-800)', color: 'white', 
                                width: '40px', height: '40px', borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                            }}>
                                📷
                                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>ФИО СПЕЦИАЛИСТА</label>
                            <input value={user.fullName || ''} onChange={e => setUser({...user, fullName: e.target.value})} placeholder="Доктор Иван Иванов" />
                        </div>
                        <div className="form-group">
                            <label>ПУБЛИЧНЫЙ EMAIL</label>
                            <input value={user.email || ''} onChange={e => setUser({...user, email: e.target.value})} placeholder="pro@example.com" />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>О СЕБЕ И ПОДХОДЕ</label>
                            <textarea 
                                value={user.aboutMe || ''} 
                                onChange={e => setUser({...user, aboutMe: e.target.value})} 
                                placeholder="Опишите вашу квалификацию и методы работы..."
                                style={{ height: '120px' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.25rem' }} disabled={loading}>
                        {loading ? '⏳ Обновляем данные...' : 'Сохранить изменения профиля'}
                    </button>
                </form>
            </div>
        </div>
    );
}
