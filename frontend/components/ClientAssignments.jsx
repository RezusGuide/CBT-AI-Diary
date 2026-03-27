import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ClientAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Состояние для активного задания (которое сейчас делаем)
    const [activeTask, setActiveTask] = useState(null);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/assignments/user/${user.id}`);

            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                setAssignments([]);
            }

        } catch (error) {
            console.error("Ошибка загрузки:", error);
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    };

    // Нажатие кнопки "Начать"
    const handleStart = (task) => {
        setActiveTask(task);
        setAnswer(''); // Очищаем поле ответа
    };

    // Нажатие кнопки "Отмена"
    const handleCancel = () => {
        setActiveTask(null);
        setAnswer('');
    };

    // Отправка ответа на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim()) {
            toast.error("Напишите ответ или отчет о выполнении!");
            return;
        }

        try {
            // Эндпоинт берем из твоего AssignmentController: @PutMapping("/{id}/complete")
            const res = await fetch(`/api/assignments/${activeTask.id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: answer }) // Ключ "answer" ожидается на бэкенде
            });

            if (res.ok) {
                toast.success("Задание выполнено! Отлично!");
                setActiveTask(null);
                loadAssignments(); // Обновляем список, чтобы увидеть зеленую галочку
            } else {
                toast.error("Ошибка отправки ответа");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка сети");
        }
    };

    if (loading) return <div className="diary-container">Загрузка...</div>;

    return (
        <div className="diary-container" style={{maxWidth: '800px'}}>
            <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#2c3e50'}}>Ваши Задания</h1>

            {/* РЕЖИМ ВЫПОЛНЕНИЯ ЗАДАНИЯ */}
            {activeTask ? (
                <div className="entry-item" style={{background: '#f0f9ff', border: '2px solid #667eea'}}>
                    <button onClick={handleCancel} style={{float: 'right', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>✖</button>
                    <h2 style={{marginTop: 0}}>{activeTask.title}</h2>
                    <p style={{background: 'white', padding: '15px', borderRadius: '8px', fontStyle: 'italic', borderLeft: '4px solid #ddd'}}>
                        {activeTask.description}
                    </p>

                    <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Ваш отчет / Ответ:</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Напишите, как прошло выполнение задания, или ответьте на вопросы..."
                            style={{width: '100%', height: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '15px'}}
                            required
                        />
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button type="submit" className="btn-primary">✅ Отправить на проверку</button>
                            <button type="button" onClick={handleCancel} className="btn-secondary">Отмена</button>
                        </div>
                    </form>
                </div>
            ) : (
                // СПИСОК ЗАДАНИЙ
                <div className="assignments-list">
                    {assignments.length > 0 ? (
                        assignments.map((task) => (
                            <div key={task.id} className="entry-item" style={{
                                borderLeft: task.completed ? '5px solid #48bb78' : '5px solid #667eea',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'
                            }}>
                                <div style={{flex: 1}}>
                                    <h3 style={{margin: '0 0 5px 0', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#000'}}>
                                        {task.title}
                                    </h3>
                                    <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{task.description}</p>

                                    {/* Если есть ответ клиента, показываем его */}
                                    {task.clientAnswer && (
                                        <div style={{marginTop: '10px', fontSize: '0.85rem', color: '#48bb78'}}>
                                            <strong>Ваш ответ:</strong> {task.clientAnswer}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {task.completed ? (
                                        <span style={{color: '#48bb78', fontWeight: 'bold', padding: '5px 10px', background: '#d1fae5', borderRadius: '15px'}}>
                                            Выполнено ✅
                                        </span>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            style={{padding: '8px 20px', fontSize: '0.9rem'}}
                                            onClick={() => handleStart(task)} // ВОТ ТУТ МЫ ДОБАВИЛИ ОБРАБОТЧИК
                                        >
                                            Начать
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
                            <div style={{fontSize: '4rem', marginBottom: '10px'}}>📝</div>
                            <h3>Заданий пока нет</h3>
                            <p>Ваш психолог еще не назначил вам упражнения.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClientAssignments;