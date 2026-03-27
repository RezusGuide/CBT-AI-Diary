import React from 'react';

const BackgroundElements = ({ themeId }) => {
    // 1. По умолчанию
    let themeClass = "bg-magic"; // Красивый фиолетовый для гостей

    // 2. Логика распределения ВСЕХ 11 настроений

    // ГРУППА: ГРУСТЬ / ТЕМНОТА (Дождь)
    if (['sad', 'depressed', 'disappointed', 'guilty', 'down', 'rainy'].includes(themeId)) {
        themeClass = "bg-rain";
    }

    // ГРУППА: РАДОСТЬ / ЭНЕРГИЯ (Теплый градиент)
    if (['joy', 'happy', 'excited', 'satisfied', 'sunny'].includes(themeId)) {
        themeClass = "bg-joy";
    }

    // ГРУППА: СПОКОЙСТВИЕ (Зеленый)
    if (['calm', 'relaxed', 'nature'].includes(themeId)) {
        themeClass = "bg-calm";
    }

    // ГРУППА: СТРЕСС / ЗЛОСТЬ (Красный)
    if (['annoyed', 'angry', 'stressed'].includes(themeId)) {
        themeClass = "bg-stress";
    }

    // ГРУППА: УДИВЛЕНИЕ (Фиолетовый)
    if (['surprised', 'wonder', 'magic'].includes(themeId)) {
        themeClass = "bg-magic";
    }

    return (
        <div className={`atmosphere-container ${themeClass}`}>
            {/* Эффект дождя только для грустных */}
            {themeClass === 'bg-rain' && <div className="rain"></div>}

            {/* Эффект пузырей для радости */}
            {themeClass === 'bg-joy' && (
                <>
                    <div style={{position:'absolute', top:'10%', left:'10%', width:'150px', height:'150px', background:'rgba(255,255,255,0.3)', borderRadius:'50%', filter:'blur(40px)'}}></div>
                    <div style={{position:'absolute', bottom:'20%', right:'10%', width:'200px', height:'200px', background:'rgba(255,255,255,0.2)', borderRadius:'50%', filter:'blur(50px)'}}></div>
                </>
            )}
        </div>
    );
};

export default BackgroundElements;