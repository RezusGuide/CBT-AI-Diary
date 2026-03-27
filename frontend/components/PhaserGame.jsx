import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../src/game/MainScene';
import toast from 'react-hot-toast'; // Обязательно импортируем тосты

export default function PhaserGame() {
    const gameRef = useRef(null);

    useEffect(() => {
        // Конфигурация движка
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

        const game = new Phaser.Game(config);
        gameRef.current = game;

        // ЛОВИМ СИГНАЛЫ ИЗ ИГРЫ
        const handleWeedPulled = () => {
            // Массив поддерживающих фраз
            const affirmations = [
                "С каждым убранным сорняком становится легче 🌱",
                "Отличная работа! Вы расчищаете место для нового ☀️",
                "Маленький шаг к спокойствию сделан 🧘‍♂️",
                "Внутренний сад становится чище ✨"
            ];
            const randomMsg = affirmations[Math.floor(Math.random() * affirmations.length)];
            toast.success(randomMsg, { duration: 3000, icon: '🌻' });
        };

        // Подписываемся на событие
        window.addEventListener('weed-pulled', handleWeedPulled);

        // Очистка при закрытии окна
        return () => {
            if (gameRef.current) gameRef.current.destroy(true);
            window.removeEventListener('weed-pulled', handleWeedPulled);
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <p style={{color: '#64748b', marginBottom: '10px'}}>
                Управление: <b>WASD</b> или <b>Стрелочки</b>. Очистка сорняков: подойдите и нажмите <b>Пробел</b>.
            </p>
            <div
                id="phaser-container"
                style={{ borderRadius: '12px', overflow: 'hidden', border: '4px solid #10b981', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            >
            </div>
        </div>
    );
}