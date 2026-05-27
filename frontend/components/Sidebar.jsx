import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [user, setUser] = useState({});
    const [displayName, setDisplayName] = useState('...');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        setDisplayName(storedUser.fullName || storedUser.username || 'Гость');
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span style={{ fontSize: '2.2rem' }}>🧠</span>
                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1.1 }}>CBT Diary</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '4px' }}>Wellness Companion</div>
                </div>
            </div>

            <nav className="nav-links" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link to="/client-home" className={`nav-item ${isActive('/client-home') ? 'active' : ''}`}>
                    <span>🏠</span> Обзор
                </Link>
                <Link to="/diary" className={`nav-item ${isActive('/diary') ? 'active' : ''}`}>
                    <span>📖</span> Мой дневник
                </Link>
                <Link to="/dreams" className={`nav-item ${isActive('/dreams') ? 'active' : ''}`}>
                    <span>🌙</span> Анализ снов
                </Link>
                <Link to="/inner-world" className={`nav-item ${isActive('/inner-world') ? 'active' : ''}`}>
                    <span>✨</span> Внутренний мир
                </Link>
                <Link to="/chat" className={`nav-item ${isActive('/chat') ? 'active' : ''}`}>
                    <span>💬</span> Беседы
                </Link>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--slate-200)', paddingTop: '1.5rem' }}>
                    <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                        <span>👤</span> Профиль
                    </Link>
                    <button onClick={handleLogout} className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#E53E3E' }}>
                        <span>🚪</span> Выход
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
