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
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--space-xl)' }}>
                <h1>Моя Программа</h1>
                <p style={{ color: 'var(--text-muted)' }}>Маленькие шаги ведут к большим изменениям</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {assignments.map(item => (
                    <div key={item.id} className="card" style={{ 
                        borderLeft: item.isCompleted ? '4px solid var(--color-world)' : '4px solid var(--color-tasks)',
                        opacity: item.isCompleted ? 0.8 : 1
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <span className={`badge ${item.isCompleted ? 'badge-emerald' : 'badge-amber'}`}>
                                {item.isCompleted ? 'Выполнено' : 'Активно'}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                От: <span style={{ color: 'var(--text-accent)' }}>{item.psychologist.fullName || 'Ваш психолог'}</span>
                            </span>
                        </div>

                        <h3 style={{ marginBottom: 'var(--space-sm)', textDecoration: item.isCompleted ? 'line-through' : 'none' }}>
                            {item.title}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                            {item.description}
                        </p>

                        {!item.isCompleted && selectedId !== item.id && (
                            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #6ee7b7, #34d399)' }} onClick={() => setSelectedId(item.id)}>
                                Приступить к выполнению
                            </button>
                        )}

                        {selectedId === item.id && (
                            <div style={{ marginTop: 'var(--space-md)', background: 'var(--bg-surface-2)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                                <label className="input-label">Ваш ответ</label>
                                <textarea 
                                    className="input-field"
                                    placeholder="Ваши мысли по заданию..." 
                                    value={answer} 
                                    onChange={e => setAnswer(e.target.value)}
                                    style={{ height: '120px', marginBottom: 'var(--space-md)', resize: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleComplete(item.id)} className="btn-primary" style={{ background: 'linear-gradient(135deg, #6ee7b7, #34d399)' }}>Отправить специалисту</button>
                                    <button onClick={() => setSelectedId(null)} className="btn-secondary">Отмена</button>
                                </div>
                            </div>
                        )}

                        {item.isCompleted && (
                            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)' }}>
                                <div className="input-label">Ваш ответ:</div>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{item.clientAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
                
                {assignments.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', border: '2px dashed var(--border-subtle)' }}>
                        <div style={{ fontSize: '40px', marginBottom: 'var(--space-sm)' }}>🎯</div>
                        <p style={{ color: 'var(--text-muted)' }}>У вас пока нет назначенных заданий.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
