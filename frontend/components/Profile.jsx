import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', phone: '', aboutMe: '', email: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        setFormData({
            fullName: storedUser.fullName || '',
            phone: storedUser.phone || '',
            aboutMe: storedUser.aboutMe || '',
            email: storedUser.email || ''
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading("Загрузка фото...");

        try {
            const res = await fetch(`/api/users/${user.id}/avatar`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast.success("Фото обновлено!", { id: toastId });
            } else {
                toast.error("Ошибка загрузки", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка сервера", { id: toastId });
        }
    };

    const handleSave = async () => {
        const toastId = toast.loading("Saving...");

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            const savedUser = await res.json();
            localStorage.setItem('user', JSON.stringify(savedUser));
            setUser(savedUser);
            setFormData({
                fullName: savedUser.fullName || '',
                phone: savedUser.phone || '',
                aboutMe: savedUser.aboutMe || '',
                email: savedUser.email || ''
            });
            setIsEditing(false);
            toast.success("Saved", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Profile was not saved", { id: toastId });
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1>Личный кабинет</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Управляйте вашими данными и настройками профиля</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn-primary">✏️ Изменить</button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary">Отмена</button>
                        <button onClick={handleSave} className="btn-primary">Сохранить</button>
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="profile-banner"></div>
                <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
                    <div className="profile-avatar-large" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                        {user.photoUrl ? (
                            <img src={`${import.meta.env.VITE_API_BASE_URL || ''}${user.photoUrl}`} alt="Avatar" />
                        ) : (
                            <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</span>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    </div>

                    <div style={{ marginTop: 'var(--space-md)' }}>
                        {isEditing ? (
                            <input className="input-field" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ваше Имя" style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-sm)' }} />
                        ) : (
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-xs)' }}>{user.fullName || user.username || "Гость"}</h2>
                        )}
                        <span className="badge badge-violet">{user.role === 'PSYCHOLOGIST' ? 'Психолог' : 'Пользователь'}</span>
                    </div>

                    <div className="profile-info-grid">
                        <div className="info-field">
                            <label className="input-label">Логин</label>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{user.username}</div>
                        </div>
                        <div className="info-field">
                            <label className="input-label">Email</label>
                            {isEditing ? (
                                <input className="input-field" name="email" value={formData.email} onChange={handleChange} />
                            ) : (
                                <div style={{ fontSize: '14px', fontWeight: '500', color: user.email ? 'var(--text-primary)' : 'var(--text-muted)' }}>{user.email || "Не указан"}</div>
                            )}
                        </div>
                        <div className="info-field">
                            <label className="input-label">Телефон</label>
                            {isEditing ? (
                                <input className="input-field" name="phone" value={formData.phone} onChange={handleChange} />
                            ) : (
                                <div style={{ fontSize: '14px', fontWeight: '500', color: user.phone ? 'var(--text-primary)' : 'var(--text-muted)' }}>{user.phone || "Не указан"}</div>
                            )}
                        </div>
                    </div>
                    
                    {isEditing && (
                        <div style={{ marginTop: 'var(--space-md)' }}>
                            <label className="input-label">О себе</label>
                            <textarea className="input-field" name="aboutMe" value={formData.aboutMe} onChange={handleChange} rows="4" style={{ resize: 'none' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
