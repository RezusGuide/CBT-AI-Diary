import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const PsychologistProfile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '', specialization: '', experience: '', aboutMe: '', phone: '',
        certificateUrls: '',
        socialLinks: ''
    });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(stored);
        setFormData({
            fullName: stored.fullName || '',
            specialization: stored.specialization || '',
            experience: stored.experience || '',
            aboutMe: stored.aboutMe || '',
            phone: stored.phone || '',
            certificateUrls: stored.certificateUrls || '',
            socialLinks: stored.socialLinks || ''
        });
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('file', file);

        const toastId = toast.loading("Загрузка фото...");
        try {
            const res = await fetch(`/api/users/${user.id}/avatar`, { method: 'POST', body: data });
            if (res.ok) {
                const updated = await res.json();
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                toast.success("Фото обновлено!", { id: toastId });
            }
        } catch (e) { toast.error("Ошибка", { id: toastId }); }
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
                specialization: savedUser.specialization || '',
                experience: savedUser.experience || '',
                aboutMe: savedUser.aboutMe || '',
                phone: savedUser.phone || '',
                certificateUrls: savedUser.certificateUrls || '',
                socialLinks: savedUser.socialLinks || ''
            });
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
                    <div className="profile-avatar-large" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>
                        {user.photoUrl ? (
                            <img src={`${import.meta.env.VITE_API_BASE_URL || ''}${user.photoUrl}`} alt="Avatar" />
                        ) : (
                            <span>{(user.fullName || "П").charAt(0)}</span>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
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
