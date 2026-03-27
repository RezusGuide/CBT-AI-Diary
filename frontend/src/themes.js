// src/themes.js

export const EMOTION_THEMES = {
    // Веселые
    joy: {
        id: 'joy',
        label: 'Радостно',
        colors: { primary: '#f6ad55', secondary: '#ed8936' }, // Оранжевый градиент
        animation: 'anim-joy 4s ease-in-out infinite alternate'
    },
    happy: {
        id: 'happy',
        label: 'Счастливо',
        colors: { primary: '#68d391', secondary: '#38a169' }, // Зеленый градиент
        animation: 'anim-happy 6s ease-in-out infinite alternate'
    },
    excited: {
        id: 'excited',
        label: 'Восторженно',
        colors: { primary: '#f687b3', secondary: '#d53f8c' }, // Розовый градиент
        animation: 'anim-excited 1.5s ease-in-out infinite alternate'
    },
    satisfied: {
        id: 'satisfied',
        label: 'Удовлетворённо',
        colors: { primary: '#4fd1c5', secondary: '#319795' }, // Бирюзовый градиент
        animation: 'anim-satisfied 8s ease-in-out infinite alternate'
    },

    // Грустные
    sad: {
        id: 'sad',
        label: 'Грустно',
        colors: { primary: '#63b3ed', secondary: '#2b6cb0' }, // Синий градиент
        animation: 'anim-sad 5s linear infinite'
    },
    depressed: {
        id: 'depressed',
        label: 'Депрессивно',
        colors: { primary: '#718096', secondary: '#2d3748' }, // Темно-серый градиент
        animation: 'anim-depressed 10s ease infinite alternate'
    },
    disappointed: {
        id: 'disappointed',
        label: 'Разочарованно',
        colors: { primary: '#cbd5e0', secondary: '#a0aec0' }, // Светло-серый градиент
        animation: 'anim-disappointed 4s ease-in-out infinite alternate'
    },
    guilty: {
        id: 'guilty',
        label: 'Виновато',
        colors: { primary: '#4299e1', secondary: '#805ad5' }, // Сине-фиолетовый (тревожный)
        animation: 'anim-guilty 2s step-end infinite alternate'
    },

    // Острые
    annoyed: {
        id: 'annoyed',
        label: 'Раздраженно',
        colors: { primary: '#fc8181', secondary: '#c53030' }, // Красноватый градиент
        animation: 'anim-annoyed 0.8s ease-in-out infinite alternate'
    },
    surprised: {
        id: 'surprised',
        label: 'Удивлённо',
        colors: { primary: '#9f7aea', secondary: '#f687b3' }, // Фиолетово-розовый "поп"
        animation: 'anim-surprised 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate'
    },
    down: {
        id: 'down',
        label: 'Подавлено',
        colors: { primary: '#a0aec0', secondary: '#4a5568' }, // Приглушенный серо-синий
        animation: 'anim-down 7s ease-in-out infinite alternate'
    }
};

export const DEFAULT_THEME = {
    id: 'default',
    label: 'Обычное',
    colors: { primary: '#8b5e3c', secondary: '#5c3a21' }, // Коричневатый градиент
    animation: 'anim-happy 6s ease-in-out infinite alternate'
};