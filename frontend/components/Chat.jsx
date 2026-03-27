import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState({});

    // Ссылка для авто-скролла вниз
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);

        if (storedUser.id) {
            initChatSystem(storedUser.id);
        }
    }, []);

    // Авто-скролл к последнему сообщению при обновлении списка
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const initChatSystem = async (userId) => {
        // 1. Проверяем, нужно ли создать новый чат (переход с карточки клиента)
        const chatTarget = JSON.parse(localStorage.getItem('chatTarget'));

        if (chatTarget) {
            localStorage.removeItem('chatTarget'); // Чистим, чтобы не создавать вечно

            try {
                // Создаем или получаем чат
                const res = await fetch(`/api/chat/create?userId=${userId}&targetId=${chatTarget.id}`, {
                    method: 'POST'
                });
                if (res.ok) {
                    const newChat = await res.json();
                    setSelectedChat(newChat);
                    loadMessages(newChat.id);
                }
            } catch (e) {
                console.error("Ошибка создания чата", e);
            }
        }

        // 2. Загружаем список чатов
        loadChats(userId);
    };

    const loadChats = async (userId) => {
        try {
            const res = await fetch(`/api/chat/user/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (e) { console.error(e); }
    };

    const loadMessages = async (chatId) => {
        if (!chatId) return;
        try {
            const res = await fetch(`/api/chat/${chatId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            } else {
                setMessages([]);
            }
        } catch (e) {
            setMessages([]);
        }
    };

    // --- ФУНКЦИЯ ОТПРАВКИ СООБЩЕНИЯ ---
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !user.id) return;

        const tempMsg = {
            chatId: selectedChat.id,
            senderId: user.id,
            content: newMessage,
            timestamp: new Date()
        };

        try {
            const res = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempMsg)
            });

            if (res.ok) {
                const savedMsg = await res.json();
                setMessages(prev => [...prev, savedMsg]);
                setNewMessage('');
            } else {
                toast.error("Ошибка отправки");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ошибка соединения");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const getChatName = (chat) => {
        if (!chat || !user.id) return "Чат";
        const partner = chat.participant1.id === user.id ? chat.participant2 : chat.participant1;
        return partner.fullName || partner.username;
    };

    const getChatAvatar = (chat) => {
        if (!chat || !user.id) return null;
        const partner = chat.participant1.id === user.id ? chat.participant2 : chat.participant1;
        return partner.photoUrl;
    };

    return (
        <div className="diary-container" style={{maxWidth: '1000px', padding: '0', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
            <div className="chat-layout-container" style={{flex: 1, display: 'flex', height: '100%'}}>

                {/* --- ЛЕВАЯ КОЛОНКА (САЙДБАР С КОНТАКТАМИ) --- */}
                <div className="chat-sidebar" style={{
                    width: '300px',
                    minWidth: '250px',
                    display: 'flex',
                    flexDirection: 'column', // ВАЖНО: Выстраиваем сверху вниз
                    overflowY: 'auto', // Добавляем скролл, если контактов много
                    borderRight: '1px solid #e2e8f0',
                    background: '#f8fafc'
                }}>
                    {chats.length === 0 && <div style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>Нет активных чатов</div>}

                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => { setSelectedChat(chat); loadMessages(chat.id); }}
                            style={{
                                padding: '15px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer',
                                background: selectedChat?.id === chat.id ? '#e0f2fe' : 'transparent',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                transition: 'background 0.2s'
                            }}
                        >
                            {/* Аватарка */}
                            <div className="avatar-circle" style={{
                                width: '45px', height: '45px', minWidth: '45px',
                                borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden'
                            }}>
                                {getChatAvatar(chat) ? (
                                    <img src={`http://localhost:8080${getChatAvatar(chat)}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="avatar"/>
                                ) : (
                                    <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '1.2rem'}}>👤</div>
                                )}
                            </div>

                            {/* Текстовый блок */}
                            <div style={{flex: 1, minWidth: 0}}>
                                <div style={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '0.95rem',
                                    color: '#1e293b'
                                }}>
                                    {getChatName(chat)}
                                </div>
                                <div style={{fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    {chat.lastMessage || "Нажмите, чтобы открыть"}
                                </div>
                            </div>

                            {/* Время */}
                            <div style={{fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', alignSelf: 'flex-start'}}>
                                {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- ПРАВАЯ КОЛОНКА (ОКНО ЧАТА) --- */}
                <div className="chat-main" style={{flex: 1, display: 'flex', flexDirection: 'column', background: 'white'}}>
                    {selectedChat ? (
                        <>
                            {/* Шапка чата */}
                            <div style={{padding: '15px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: '#0f172a'}}>
                                {getChatName(selectedChat)}
                            </div>

                            {/* Сообщения */}
                            <div className="messages-area" style={{flex: 1, padding: '20px', overflowY: 'auto', background: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {messages.length === 0 && <div style={{textAlign: 'center', color: '#94a3b8', marginTop: '20px'}}>Напишите первое сообщение...</div>}

                                {messages.map((msg, index) => (
                                    <div key={msg.id || index} style={{
                                        alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%'
                                    }}>
                                        <div style={{
                                            background: msg.senderId === user.id ? '#3b82f6' : 'white',
                                            color: msg.senderId === user.id ? 'white' : '#334155',
                                            padding: '10px 15px',
                                            borderRadius: '12px',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            borderBottomRightRadius: msg.senderId === user.id ? '2px' : '12px',
                                            borderBottomLeftRadius: msg.senderId === user.id ? '12px' : '2px',
                                            wordBreak: 'break-word'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', textAlign: msg.senderId === user.id ? 'right' : 'left'}}>
                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Область ввода */}
                            <div className="chat-input-area" style={{padding: '15px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center'}}>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Напишите сообщение..."
                                    style={{
                                        flex: 1,
                                        padding: '12px 20px',
                                        borderRadius: '25px',
                                        border: '1px solid #cbd5e1',
                                        outline: 'none',
                                        fontSize: '0.95rem',
                                        background: '#f8fafc'
                                    }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="btn-primary"
                                    style={{
                                        borderRadius: '50%',
                                        width: '45px',
                                        height: '45px',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#3b82f6',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column'}}>
                            <div style={{fontSize: '4rem', marginBottom: '20px'}}>💬</div>
                            <div style={{fontSize: '1.1rem'}}>Выберите чат слева или начните новый</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;