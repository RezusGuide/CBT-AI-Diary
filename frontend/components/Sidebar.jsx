import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API_URL from '../src/api';
import { useLanguage } from '../src/i18n/LanguageContext';
import LangSwitcher from './LangSwitcher';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { t } = useLanguage();
    const [user, setUser] = useState({});
    const [displayName, setDisplayName] = useState(t('loading'));
    const [avatarLetter, setAvatarLetter] = useState('?');

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(storedUser);
            const name = storedUser.fullName || storedUser.username || 'Гость';
            setDisplayName(name === 'Гость' ? t('profile_user') : name);
            setAvatarLetter(name.charAt(0).toUpperCase());
        } catch (e) {
            setDisplayName(t('profile_user'));
        }
    }, [t]);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleNavClick = () => {
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    return (
        <aside className={`sidebar${sidebarOpen ? '' : ' collapsed'}`}>
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">✨</div>
                <div>
                    <div className="sidebar-brand-name">MindSpace</div>
                    <div className="sidebar-brand-sub">Mental Wellness</div>
                </div>
            </div>

            <Link to="/profile" className="sidebar-user" onClick={handleNavClick}>
                <div className="user-avatar">
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="User" />
                    ) : user.photoUrl ? (
                        <img
                            src={API_URL(user.photoUrl)}
                            alt="User"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <span>{avatarLetter}</span>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div className="user-name">{displayName}</div>
                    <div className="user-role">{t('profile_user')}</div>
                </div>
            </Link>

            <nav className="nav-section">
                <Link to="/client-home" className={`nav-item ${isActive('/client-home') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">🏠</span> <span className="nav-label">{t('nav_home')}</span>
                </Link>
                <Link to="/diary" className={`nav-item ${isActive('/diary') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">📖</span> <span className="nav-label">{t('nav_diary')}</span>
                </Link>
                <Link to="/dreams" className={`nav-item ${isActive('/dreams') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">🌙</span> <span className="nav-label">{t('nav_dreams')}</span>
                </Link>
                <Link to="/ai-advice" className={`nav-item ${isActive('/ai-advice') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">🤖</span> <span className="nav-label">{t('nav_ai')}</span>
                </Link>
                <Link to="/ai-chat" className={`nav-item ${isActive('/ai-chat') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">✨</span> <span className="nav-label">{t('ai_chat_title')}</span>
                </Link>
                <Link to="/inner-world" className={`nav-item ${isActive('/inner-world') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">✨</span> <span className="nav-label">{t('nav_world')}</span>
                </Link>
                <Link to="/chat" className={`nav-item ${isActive('/chat') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">💬</span> <span className="nav-label">{t('nav_chat')}</span>
                </Link>
                <Link to="/client-assignments" className={`nav-item ${isActive('/client-assignments') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">📝</span> <span className="nav-label">{t('nav_tasks')}</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <LangSwitcher collapsed={!sidebarOpen} />
                <div className="divider" style={{ margin: '8px 0' }} />
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span> <span className="logout-label">{t('nav_logout')}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
