import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const MOODS = [
    "Грустно", "Радостно", "Подавлено", "Восторженно",
    "Разочарованно", "Удивлённо", "Депрессивно",
    "Удовлетворённо", "Раздраженно", "Счастливо", "Виновато"
];

export default function MoodCheck() {
    const [selectedMood, setSelectedMood] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const handleConfirm = async () => {
        if (!selectedMood) return;

        try {
            const res = await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, mood: selectedMood })
            });


            if (res.ok) {
                localStorage.setItem('todayMood', selectedMood);
                navigate('/client-home');
            }

            else if (res.status === 400) {

                localStorage.setItem('todayMood', selectedMood);
                navigate('/client-home');
            }
            else {
                alert("Произошла ошибка сервера");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            navigate('/client-home');
        }
    };

    return (
        <div className="welcome-wrapper">
            <div className="welcome-container" style={{maxWidth: '800px'}}>
                <h1>Здравствуйте, {username}</h1>
                <h2 style={{fontWeight: 'normal', color: '#666'}}>Как вы себя чувствуете сегодня?</h2>

                <div className="mood-grid">
                    {MOODS.map(mood => (
                        <button
                            key={mood}
                            className={`mood-btn ${selectedMood === mood ? 'selected' : ''}`}
                            onClick={() => setSelectedMood(mood)}
                        >
                            {mood}
                        </button>
                    ))}
                </div>

                <button
                    className="btn-primary"
                    disabled={!selectedMood}
                    onClick={handleConfirm}
                    style={{marginTop: '20px', width: '200px'}}
                >
                    Подтвердить
                </button>
            </div>
        </div>
    );
}