import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import API_URL from '../src/api';
import { useTheme } from '../src/context/ThemeContext';

const ClientLayout = ({ children }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [user, setUser] = useState({});

    useEffect(() => {
        const onResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(true);
        };
        window.addEventListener('resize', onResize);
        
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    const avatarSrc = user.profilePicture || (user.photoUrl ? API_URL(user.photoUrl) : null);

    return (
        <div className="app-layout">
            {!isMobile && (
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            )}

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                {isMobile && (
                    <div className="top-bar">
                        <div style={{ flex: 1 }}>
                            <div className="top-bar-title">MindSpace</div>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 18, marginRight: 15, display: 'flex', alignItems: 'center'
                            }}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button onClick={() => navigate('/profile')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center'
                        }}>
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, fontWeight: 700, color: '#fff',
                                }}>
                                    {(user.fullName || user.username || "?")[0].toUpperCase()}
                                </div>
                            )}
                        </button>
                    </div>
                )}

                <main className="main-content" style={{
                    paddingBottom: isMobile ? '80px' : undefined,
                    height: isMobile ? 'auto' : '100vh',
                }}>
                    {!isMobile && (
                        <button
                            className="desktop-toggle"
                            onClick={() => setSidebarOpen(o => !o)}
                            aria-label="Toggle sidebar"
                            style={{
                                position: 'fixed',
                                top: 20,
                                left: sidebarOpen ? 240 : 74,
                                zIndex: 100,
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                width: 32, height: 32,
                                display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0,
                                color: 'var(--text-secondary)',
                                fontSize: 16,
                                transition: 'left 0.25s ease',
                            }}
                        >
                            {sidebarOpen ? '✕' : '☰'}
                        </button>
                    )}

                    {children}
                </main>
            </div>

            {isMobile && <BottomNav />}
        </div>
    );
};

export default ClientLayout;
