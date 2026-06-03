import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import API_URL from '../src/api';
import { useLanguage } from '../src/i18n/LanguageContext';
import LangSwitcher from './LangSwitcher';

const PsychologistSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { t } = useLanguage();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.fullName || user.username || 'Доктор';

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
                <div className="sidebar-brand-icon">🩺</div>
                <div>
                    <div className="sidebar-brand-name">MindSpace</div>
                    <div className="sidebar-brand-sub">Professional Panel</div>
                </div>
            </div>

            <Link to="/psychologist/profile" className="sidebar-user" onClick={handleNavClick}>
                <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}>
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="User" />
                    ) : user.photoUrl ? (
                        <img src={API_URL(user.photoUrl)} alt="User" />
                    ) : (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div className="user-name">{displayName}</div>
                    <div className="user-role">{t('profile_psychologist')}</div>
                </div>
            </Link>

            <nav className="nav-section">
                <Link to="/psychologist" className={`nav-item ${isActive('/psychologist') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">🏠</span> <span className="nav-label">{t('nav_home')}</span>
                </Link>
                <Link to="/psychologist/clients" className={`nav-item ${isActive('/psychologist/clients') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">👥</span> <span className="nav-label">{t('nav_clients')}</span>
                </Link>
                <Link to="/psychologist/notes" className={`nav-item ${isActive('/psychologist/notes') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">📝</span> <span className="nav-label">{t('nav_notes')}</span>
                </Link>
                <Link to="/psychologist/assignments" className={`nav-item ${isActive('/psychologist/assignments') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">🎯</span> <span className="nav-label">{t('nav_tasks')}</span>
                </Link>
                <Link to="/psychologist/chat" className={`nav-item ${isActive('/psychologist/chat') ? 'active' : ''}`} onClick={handleNavClick}>
                    <span className="nav-icon">💬</span> <span className="nav-label">{t('nav_chat')}</span>
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

export default PsychologistSidebar;
