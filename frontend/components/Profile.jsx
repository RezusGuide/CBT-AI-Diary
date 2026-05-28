import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../src/api';

const PsychologistSelector = ({ currentPsychologist, onSelect, onRemove, userId }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleSearch = async (q) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    try {
      const res = await fetch(API_URL(`/api/users/psychologists/search?query=${encodeURIComponent(q)}`));
      if (res.ok) setResults(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleChoose = async (psych) => {
    try {
      const res = await fetch(API_URL(`/api/users/me/psychologist/${psych.id}?clientId=${userId}`), {
        method: 'POST'
      });
      if (res.ok) {
        onSelect(psych);
        setSearchOpen(false);
        toast.success("Психолог выбран!");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-header">🧠 Мой психолог</div>

      {currentPsychologist ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {currentPsychologist.profilePicture
            ? <img src={currentPsychologist.profilePicture}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} alt="psych" />
            : <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: '#fff'
              }}>{(currentPsychologist.fullName || currentPsychologist.username || "?")[0]}</div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{currentPsychologist.fullName || currentPsychologist.username}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Психолог</div>
          </div>
          <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}
            onClick={() => setSelectedPreview(currentPsychologist)}>
            Профиль
          </button>
          <button onClick={onRemove} style={{
            background: 'rgba(248,113,113,0.1)', color: '#f87171',
            border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)',
            padding: '6px 14px', fontSize: 12, cursor: 'pointer'
          }}>
            Отвязать
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            Вы ещё не выбрали психолога.
          </p>
          <button className="btn-primary" onClick={() => setSearchOpen(true)}>
            + Найти психолога
          </button>
        </div>
      )}

      {/* Search modal */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: 460, maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Найти психолога</h3>
              <button onClick={() => setSearchOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: 20, cursor: 'pointer'
              }}>×</button>
            </div>
            <input
              className="input-field"
              placeholder="Поиск по имени..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              autoFocus
              style={{ marginBottom: 16 }}
            />
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {results.length === 0 && query.length >= 2 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
                  Психологи не найдены
                </div>
              )}
              {results.map(psych => (
                <div key={psych.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: '1px solid var(--border-subtle)'
                }}>
                  {psych.profilePicture
                    ? <img src={psych.profilePicture}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} alt="psych" />
                    : <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0
                      }}>{(psych.fullName || psych.username || "?")[0]}</div>
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{psych.fullName || psych.username}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Психолог</div>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: 12, padding: '5px 12px' }}
                    onClick={() => setSelectedPreview(psych)}>
                    Профиль
                  </button>
                  <button className="btn-primary" style={{ fontSize: 12, padding: '5px 12px' }}
                    onClick={() => handleChoose(psych)}>
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Psychologist profile preview modal */}
      {selectedPreview && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="card" style={{ width: 380 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {selectedPreview.profilePicture
                ? <img src={selectedPreview.profilePicture}
                    style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} alt="preview" />
                : <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 auto 12px'
                  }}>{(selectedPreview.fullName || selectedPreview.username || "?")[0]}</div>
              }
              <h2 style={{ margin: 0 }}>{selectedPreview.fullName || selectedPreview.username}</h2>
              <span className="badge badge-violet" style={{ marginTop: 6 }}>Психолог</span>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>{selectedPreview.specialization}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Опыт: {selectedPreview.experience} лет</p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-secondary" style={{ flex: 1 }}
                onClick={() => setSelectedPreview(null)}>Закрыть</button>
              {!currentPsychologist && (
                <button className="btn-primary" style={{ flex: 1 }}
                  onClick={() => { setSelectedPreview(null); handleChoose(selectedPreview); }}>
                  Выбрать
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', phone: '', aboutMe: '', email: ''
    });
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [myPsychologist, setMyPsychologist] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        fetchUser(storedUser.id);
    }, []);

    const fetchUser = async (id) => {
        try {
            const res = await fetch(API_URL(`/api/users/${id}`));
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    aboutMe: data.aboutMe || '',
                    email: data.email || ''
                });
                setAvatarSrc(data.profilePicture);
                setMyPsychologist(data.psychologist);
            }
        } catch (err) { console.error(err); }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            if (!res.ok) throw new Error(await res.text());

            const savedUser = await res.json();
            localStorage.setItem('user', JSON.stringify(savedUser));
            setUser(savedUser);
            setIsEditing(false);
            toast.success("Saved", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Profile was not saved", { id: toastId });
        }
    };

    const handleRemovePsychologist = async () => {
        try {
            const res = await fetch(API_URL(`/api/users/me/psychologist?clientId=${user.id}`), {
                method: 'DELETE'
            });
            if (res.ok) {
                setMyPsychologist(null);
                toast.success("Психолог отвязан");
            }
        } catch (err) { console.error(err); }
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
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div className="profile-avatar-large">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : "?")}</span>
                            )}
                        </div>
                        <label htmlFor="avatar-upload" style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--accent-primary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, border: '2px solid var(--bg-base)', zIndex: 2
                        }}>📷</label>
                        <input id="avatar-upload" type="file" accept="image/*"
                            style={{ display: 'none' }} onChange={handleAvatarChange} />
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

            {user.role === 'CLIENT' && (
                <PsychologistSelector
                    userId={user.id}
                    currentPsychologist={myPsychologist}
                    onSelect={(p) => setMyPsychologist(p)}
                    onRemove={handleRemovePsychologist}
                />
            )}
        </div>
    );
};

export default Profile;
