import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../src/game/MainScene';
import toast from 'react-hot-toast';

export default function PhaserGame({ onExit }) {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-container',
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false }
            },
            scene: [MainScene]
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', width: '800px', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>Ваш Внутренний Мир</h3>
                    <small style={{ color: 'var(--slate-400)' }}>Используйте стрелки для прогулки. Пробел, чтобы убрать сорняки.</small>
                </div>
                <button className="btn-secondary" onClick={onExit} style={{ padding: '8px 20px' }}>Вернуться в кабинет</button>
            </div>

            <div 
                id="phaser-container" 
                style={{ 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    boxShadow: '0 20px 50px rgba(108, 99, 255, 0.2)',
                    border: '8px solid var(--white)'
                }}
            />
        </div>
    );
}
