import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ClientAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [answer, setAnswer] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.id) fetchAssignments();
    }, [user.id]);

    const fetchAssignments = () => {
        fetch(`/api/assignments/client/${user.id}`).then(res => res.json()).then(data => setAssignments(data));
    };

    const handleComplete = (id) => {
        if (!answer.trim()) return toast.error("Пожалуйста, напишите ваш ответ");
        fetch(`/api/assignments/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer })
        }).then(() => {
            setSelectedId(null);
            setAnswer('');
            fetchAssignments();
            toast.success("Задание выполнено! Гордимся вами ✨");
        });
    };

    return (
        <div className="diary-container animate-in">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--p-600)' }}>Моя Программа</h1>
                <p style={{ color: 'var(--slate-500)' }}>Маленькие шаги ведут к большим изменениям</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {assignments.map(item => (
                    <div key={item.id} className="glass-card" style={{ 
                        borderLeft: item.isCompleted ? '6px solid var(--success)' : '6px solid var(--p-600)',
                        background: item.isCompleted ? '#F0FFF4' : 'var(--white)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div className={`status-badge ${item.isCompleted ? 'badge-success' : 'badge-warning'}`}>
                                {item.isCompleted ? 'Выполнено' : 'Активно'}
                            </div>
                            <small style={{ color: 'var(--slate-400)' }}>От: {item.psychologist.fullName || 'Ваш психолог'}</small>
                        </div>

                        <h3 style={{ marginBottom: '1rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '2rem' }}>{item.description}</p>

                        {!item.isCompleted && selectedId !== item.id && (
                            <button className="btn-primary" onClick={() => setSelectedId(item.id)}>Приступить к выполнению</button>
                        )}

                        {selectedId === item.id && (
                            <div className="animate-up" style={{ marginTop: '2rem' }}>
                                <textarea 
                                    placeholder="Ваши мысли по заданию..." 
                                    value={answer} 
                                    onChange={e => setAnswer(e.target.value)}
                                    style={{ height: '150px', marginBottom: '1.5rem', background: 'white' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => handleComplete(item.id)} className="btn-primary">Отправить специалисту</button>
                                    <button onClick={() => setSelectedId(null)} className="btn-secondary">Отмена</button>
                                </div>
                            </div>
                        )}

                        {item.isCompleted && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: '0.5rem' }}>ВАШ ОТВЕТ:</div>
                                <p style={{ margin: 0, color: 'var(--slate-600)', fontStyle: 'italic' }}>{item.clientAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
                {assignments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--slate-400)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                        <p>У вас пока нет назначенных заданий.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
