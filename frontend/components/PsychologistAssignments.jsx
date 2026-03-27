import React, { useState, useEffect } from 'react';
import './App.css';
import toast from 'react-hot-toast';

export default function PsychologistAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null); // Состояние для редактирования
    const [formData, setFormData] = useState({ title: '', description: '', clientId: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const psychId = user.id;

    useEffect(() => {
        if (psychId) {
            fetchAssignments();
            fetchClients();
        }
    }, [psychId]);

    const fetchAssignments = async () => {
        const res = await fetch(`/api/assignments/psychologist/${psychId}`);
        if (res.ok) setAssignments(await res.json());
    };

    const fetchClients = async () => {
        const res = await fetch(`/api/psychologist/clients/my?psychologistId=${psychId}`);
        if (res.ok) setClients(await res.json());
    };

    // УНИВЕРСАЛЬНАЯ ФУНКЦИЯ СОХРАНЕНИЯ (Создание + Обновление)
    const handleSave = async (e) => {
        e.preventDefault();

        if (!editingId && !formData.clientId) {
            toast.error("Выберите клиента!");
            return;
        }

        const url = editingId ? `/api/assignments/${editingId}` : '/api/assignments';
        const method = editingId ? 'PUT' : 'POST';

        // Если редактируем, отправляем только текст. Если создаем - отправляем всё.
        const body = editingId
            ? { title: formData.title, description: formData.description }
            : { psychologistId: psychId, clientId: formData.clientId, title: formData.title, description: formData.description };

        try {
            const res = await fetch(url, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });

            if (res.ok) {
                resetForm();
                fetchAssignments();
                toast.success(editingId ? "Задание обновлено!" : "Задание отправлено клиенту!");
            } else {
                toast.error("Ошибка при сохранении");
            }
        } catch (err) {
            toast.error("Ошибка соединения");
        }
    };

    // ПЕРЕХОД В РЕЖИМ РЕДАКТИРОВАНИЯ
    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            clientId: item.client?.id || ''
        });
        setEditingId(item.id);
        setIsCreating(true);
        // Скроллим наверх к форме
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // УДАЛЕНИЕ ЗАДАНИЯ
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Задание удалено");
                fetchAssignments();
            } else {
                toast.error("Не удалось удалить задание");
            }
        } catch (err) {
            toast.error("Ошибка сети");
        }
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', description: '', clientId: '' });
    };

    return (
        <div className="diary-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Управление заданиями</h1>
                <button className="btn-primary" onClick={() => isCreating ? resetForm() : setIsCreating(true)}>
                    {isCreating ? '✖ Отмена' : '+ Назначить задание'}
                </button>
            </div>

            {/* ФОРМА (СОЗДАНИЕ / РЕДАКТИРОВАНИЕ) */}
            {isCreating && (
                <form onSubmit={handleSave} className="entry-item" style={{background: '#f0f9ff', marginBottom: '30px', border: '2px solid #bae6fd'}}>
                    <h3>{editingId ? 'Редактировать задание' : 'Новое задание'}</h3>

                    {/* Выбор клиента доступен только при создании */}
                    {!editingId && (
                        <select
                            value={formData.clientId}
                            onChange={e => setFormData({...formData, clientId: e.target.value})}
                            style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc'}}
                            required
                        >
                            <option value="">-- Выберите клиента --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName || c.username}</option>
                            ))}
                        </select>
                    )}

                    <input
                        placeholder="Заголовок (например: 'Дневник благодарности')"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        style={{marginBottom: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
                        required
                    />

                    <textarea
                        placeholder="Описание упражнения..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        style={{height: '100px', marginBottom: '15px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}}
                        required
                    />

                    <button type="submit" className="btn-primary">
                        {editingId ? '💾 Сохранить изменения' : '🚀 Отправить клиенту'}
                    </button>
                </form>
            )}

            {/* СПИСОК ВЫДАННЫХ ЗАДАНИЙ */}
            <div className="entry-list">
                {assignments.length === 0 && !isCreating && <p style={{color: '#999'}}>Вы еще не назначали заданий.</p>}

                {assignments.map(item => (
                    <div key={item.id} className="entry-item" style={{borderLeft: item.completed ? '5px solid #10b981' : '5px solid #f59e0b', position: 'relative'}}>

                        {/* КНОПКИ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ */}
                        <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px'}}>
                            <button onClick={() => handleEdit(item)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}} title="Редактировать">✏️</button>
                            <button onClick={() => handleDelete(item.id)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ef4444'}} title="Удалить">🗑️</button>
                        </div>

                        <div style={{display: 'flex', gap: '15px', marginBottom: '10px'}}>
                            <small style={{color: '#888'}}>{new Date(item.createdAt).toLocaleDateString()}</small>
                            <span className="status-badge" style={{background: item.completed ? '#d1fae5' : '#fef3c7', color: item.completed ? '#065f46' : '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem'}}>
                                {item.completed ? 'Выполнено' : 'В процессе'}
                            </span>
                        </div>

                        <h3 style={{marginTop: '5px', paddingRight: '60px'}}>{item.title}</h3>
                        <p style={{marginBottom: '10px'}}><strong>Для:</strong> {item.client?.fullName || item.client?.username}</p>
                        <p style={{fontStyle: 'italic', color: '#555', background: '#f8fafc', padding: '10px', borderRadius: '8px'}}>{item.description}</p>

                        {/* ОТВЕТ КЛИЕНТА (ЕСЛИ ВЫПОЛНЕНО) */}
                        {item.completed && item.clientAnswer && (
                            <div style={{marginTop: '15px', background: '#ecfdf5', border: '1px solid #10b981', padding: '15px', borderRadius: '8px'}}>
                                <strong>✍️ Отчет клиента:</strong>
                                <p style={{marginTop: '5px', whiteSpace: 'pre-wrap'}}>{item.clientAnswer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}