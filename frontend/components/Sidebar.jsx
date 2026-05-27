import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [user, setUser] = useState({});
    const [displayName, setDisplayName] = useState('Загрузка...');
    const [avatarLetter, setAvatarLetter] = useState('?');

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(storedUser);
            const name = storedUser.fullName || storedUser.username || 'Гость';
            setDisplayName(name);
            setAvatarLetter(name.charAt(0).toUpperCase());
        } catch (e) {
            setDisplayName('Гость');
        }
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">✨</div>
                <div>
                    <div className="sidebar-brand-name">CBT AI Diary</div>
                    <div className="sidebar-brand-sub">Mental Wellness</div>
                </div>
            </div>

            <Link to="/profile" className="sidebar-user">
                <div className="user-avatar">
                    {user.photoUrl ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL || ''}${user.photoUrl}`}
                            alt="User"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <span>{avatarLetter}</span>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div className="user-name">{displayName}</div>
                    <div className="user-role">Клиент</div>
                </div>
            </Link>

            <nav className="nav-section">
                <Link to="/client-home" className={`nav-item ${isActive('/client-home') ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span> <span>Главная</span>
                </Link>
                <Link to="/diary" className={`nav-item ${isActive('/diary') ? 'active' : ''}`}>
                    <span className="nav-icon">📖</span> <span>Дневник</span>
                </Link>
                <Link to="/dreams" className={`nav-item ${isActive('/dreams') ? 'active' : ''}`}>
                    <span className="nav-icon">🌙</span> <span>Сны</span>
                </Link>
                <Link to="/ai-advice" className={`nav-item ${isActive('/ai-advice') ? 'active' : ''}`}>
                    <span className="nav-icon">🤖</span> <span>AI Советы</span>
                </Link>
                <Link to="/inner-world" className={`nav-item ${isActive('/inner-world') ? 'active' : ''}`}>
                    <span className="nav-icon">✨</span> <span>Мир</span>
                </Link>
                <Link to="/chat" className={`nav-item ${isActive('/chat') ? 'active' : ''}`}>
                    <span className="nav-icon">💬</span> <span>Чат</span>
                </Link>
                <Link to="/client-assignments" className={`nav-item ${isActive('/client-assignments') ? 'active' : ''}`}>
                    <span className="nav-icon">📝</span> <span>Задания</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span> <span>Выйти</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
