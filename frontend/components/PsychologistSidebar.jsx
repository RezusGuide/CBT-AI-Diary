import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import API_URL from '../src/api';

const PsychologistSidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.fullName || user.username || 'Доктор';

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">🩺</div>
                <div>
                    <div className="sidebar-brand-name">CBT AI Diary</div>
                    <div className="sidebar-brand-sub">Professional Panel</div>
                </div>
            </div>

            <Link to="/psychologist/profile" className="sidebar-user">
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
                    <div className="user-role">Психолог</div>
                </div>
            </Link>

            <nav className="nav-section">
                <Link to="/psychologist" className={`nav-item ${isActive('/psychologist') ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span> <span>Рабочий стол</span>
                </Link>
                <Link to="/psychologist/clients" className={`nav-item ${isActive('/psychologist/clients') ? 'active' : ''}`}>
                    <span className="nav-icon">👥</span> <span>Мои клиенты</span>
                </Link>
                <Link to="/psychologist/notes" className={`nav-item ${isActive('/psychologist/notes') ? 'active' : ''}`}>
                    <span className="nav-icon">📝</span> <span>Заметки</span>
                </Link>
                <Link to="/psychologist/assignments" className={`nav-item ${isActive('/psychologist/assignments') ? 'active' : ''}`}>
                    <span className="nav-icon">🎯</span> <span>Задания</span>
                </Link>
                <Link to="/psychologist/chat" className={`nav-item ${isActive('/psychologist/chat') ? 'active' : ''}`}>
                    <span className="nav-icon">💬</span> <span>Чат</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span> <span>Выход</span>
                </button>
            </div>
        </div>
    );
};

export default PsychologistSidebar;
