import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PsychologistSidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = user.fullName || user.username || 'Доктор';

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span style={{ fontSize: '1.8rem' }}>🩺</span>
                <div style={{ lineHeight: 1 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>CBT Specialist</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Practice Management</div>
                </div>
            </div>

            <nav className="nav-links" style={{ flex: 1 }}>
                <Link to="/psychologist" className={`nav-item ${isActive('/psychologist') ? 'active' : ''}`}>
                    <span>📊</span> Рабочий стол
                </Link>
                <Link to="/psychologist/clients" className={`nav-item ${isActive('/psychologist/clients') ? 'active' : ''}`}>
                    <span>👥</span> Мои клиенты
                </Link>
                <Link to="/psychologist/notes" className={`nav-item ${isActive('/psychologist/notes') ? 'active' : ''}`}>
                    <span>📝</span> Заметки
                </Link>
                <Link to="/psychologist/assignments" className={`nav-item ${isActive('/psychologist/assignments') ? 'active' : ''}`}>
                    <span>🎯</span> Назначить задание
                </Link>
                <Link to="/psychologist/chat" className={`nav-item ${isActive('/psychologist/chat') ? 'active' : ''}`}>
                    <span>💬</span> Чат сессии
                </Link>
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--primary-soft)', paddingTop: '1.5rem' }}>
                <Link to="/psychologist/profile" className="nav-item">
                    <div className="avatar-circle" style={{ width: '24px', height: '24px', background: 'var(--primary)', fontSize: '0.7rem' }}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    {displayName}
                </Link>
                <button onClick={() => {localStorage.clear(); window.location.href='/login'}} className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#E53E3E' }}>
                    <span>🚪</span> Выйти
                </button>
            </div>
        </aside>
    );
};

export default PsychologistSidebar;
