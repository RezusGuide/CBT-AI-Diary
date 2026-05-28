import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

const PsychologistProfile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '', specialization: '', experience: '', aboutMe: '', phone: '',
        certificateUrls: '',
        socialLinks: ''
    });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        fetchUser(stored.id);
    }, []);

    const fetchUser = async (id) => {
        try {
            const res = await fetch(API_URL(`/api/users/${id}`));
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    fullName: data.fullName || '',
                    specialization: data.specialization || '',
                    experience: data.experience || '',
                    aboutMe: data.aboutMe || '',
                    phone: data.phone || '',
                    certificateUrls: data.certificateUrls || '',
                    socialLinks: data.socialLinks || ''
                });
                setAvatarSrc(data.profilePicture);
            }
        } catch (err) { console.error(err); }
    };

    const resizeImage = (file, maxW, maxH) => {
        return new Promise(resolve => {
          const img = new Image();
          const url = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(maxW / img.width, maxH / img.height, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        });
    };
      
    const toBase64 = (blob) => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Обработка фото...");
        try {
            const resized = await resizeImage(file, 300, 300);
            const base64 = await toBase64(resized);

            const res = await fetch(API_URL(`/api/users/${user.id}/profile-picture`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profilePicture: base64 })
            });

            if (res.ok) {
                setAvatarSrc(base64);
                // Update local storage user object
                const updated = { ...user, profilePicture: base64 };
                localStorage.setItem('user', JSON.stringify(updated));
                toast.success("Фото обновлено!", { id: toastId });
            } else {
                toast.error("Ошибка сохранения", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка сервера", { id: toastId });
        }
    };

    const handleSave = async () => {
        const toastId = toast.loading("Saving...");

        try {
            const res = await fetch(API_URL(`/api/users/${user.id}`), {
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
            setIsEditing(false);
            toast.success("Profile saved", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Profile was not saved", { id: toastId });
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1>Профиль специалиста</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Управляйте вашей профессиональной информацией</p>
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
                <div className="profile-banner" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)' }}></div>
                <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>{(user.fullName || user.username || "П").charAt(0)}</span>
                            )}
                        </div>
                        <label htmlFor="avatar-upload-psych" style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--accent-primary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, border: '2px solid var(--bg-base)', zIndex: 2
                        }}>📷</label>
                        <input id="avatar-upload-psych" type="file" accept="image/*"
                            style={{ display: 'none' }} onChange={handleAvatarChange} />
                    </div>

                    <div style={{ marginTop: 'var(--space-md)' }}>
                        {isEditing ? (
                            <input className="input-field" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-sm)' }} />
                        ) : (
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-xs)' }}>{user.fullName || user.username}</h2>
                        )}
                        <span className="badge badge-sky">Психолог</span>
                    </div>

                    <div className="profile-info-grid">
                        <div className="info-field">
                            <label className="input-label">Специализация</label>
                            {isEditing ? (
                                <input className="input-field" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                            ) : (
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{user.specialization || '—'}</div>
                            )}
                        </div>
                        <div className="info-field">
                            <label className="input-label">Опыт работы</label>
                            {isEditing ? (
                                <input className="input-field" type="number" min="0" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                            ) : (
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{user.experience ? `${user.experience} лет` : '—'}</div>
                            )}
                        </div>
                        <div className="info-field">
                            <label className="input-label">Телефон</label>
                            {isEditing ? (
                                <input className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            ) : (
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{user.phone || '—'}</div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-md)' }}>
                        <label className="input-label">О себе</label>
                        {isEditing ? (
                            <textarea className="input-field" value={formData.aboutMe} onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })} rows="4" style={{ resize: 'none' }} />
                        ) : (
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{user.aboutMe || 'Информация отсутствует'}</div>
                        )}
                    </div>

                    <div style={{ marginTop: 'var(--space-md)' }}>
                        <label className="input-label">Сертификаты</label>
                        {isEditing ? (
                            <textarea className="input-field" placeholder="Ссылки через запятую" value={formData.certificateUrls} onChange={(e) => setFormData({ ...formData, certificateUrls: e.target.value })} rows="2" style={{ resize: 'none' }} />
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {user.certificateUrls ? user.certificateUrls.split(',').map((url, i) => (
                                    <a key={`cert-${i}`} href={url} target="_blank" rel="noreferrer" className="badge badge-violet" style={{ textDecoration: 'none' }}>🔗 Сертификат {i + 1}</a>
                                )) : <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Нет сертификатов</span>}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: 'var(--space-md)' }}>
                        <label className="input-label">Соцсети</label>
                        {isEditing ? (
                            <input className="input-field" placeholder="Instagram, Telegram..." value={formData.socialLinks} onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })} />
                        ) : (
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user.socialLinks || "Не указаны"}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PsychologistProfile;
