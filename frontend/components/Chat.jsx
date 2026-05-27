import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChats = () => {
        fetch(`/api/chat/user/${user.id}`).then(res => res.json()).then(data => setChats(data));
    };

    const fetchMessages = () => {
        if (selectedChat) {
            fetch(`/api/chat/${selectedChat.id}/messages`).then(res => res.json()).then(data => setMessages(data));
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: selectedChat.id, senderId: user.id, content: newMessage })
        }).then(() => {
            setNewMessage('');
            fetchMessages();
        });
    };

    return (
        <div className="chat-container">
            <div style={{ display: 'flex', height: '100%' }}>
                {/* CHAT SIDEBAR */}
                <div style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Чаты</h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {chats.map(chat => {
                            const otherUser = chat.client.id === user.id ? chat.psychologist : chat.client;
                            const isSelected = selectedChat?.id === chat.id;
                            return (
                                <div 
                                    key={chat.id} 
                                    onClick={() => setSelectedChat(chat)}
                                    style={{ 
                                        padding: '14px 20px', 
                                        cursor: 'pointer', 
                                        background: isSelected ? 'var(--bg-surface-2)' : 'transparent',
                                        borderLeft: isSelected ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                        transition: 'var(--transition-fast)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: 'var(--radius-full)', 
                                            background: otherUser.role === 'PSYCHOLOGIST' ? 'var(--accent-primary)' : 'var(--accent-orange)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '13px',
                                            fontWeight: '700'
                                        }}>
                                            {otherUser.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: '600', fontSize: '13px', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {otherUser.fullName || otherUser.username}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {otherUser.role === 'PSYCHOLOGIST' ? 'Психолог' : 'Клиент'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MESSAGES AREA */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
                    {selectedChat ? (
                        <>
                            <div className="chat-header">
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: 'var(--radius-md)', 
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    color: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 'bold',
                                    fontSize: '18px'
                                }}>
                                    {(selectedChat.client.id === user.id ? selectedChat.psychologist : selectedChat.client).username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '15px' }}>
                                        {selectedChat.client.id === user.id ? selectedChat.psychologist.fullName : selectedChat.client.fullName}
                                    </h3>
                                    <div style={{ fontSize: '11px', color: 'var(--color-world)' }}>● В сети</div>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                                {messages.map(msg => {
                                    const isMine = msg.sender.id === user.id;
                                    return (
                                        <div 
                                            key={msg.id} 
                                            className={`message ${isMine ? 'message-user' : 'message-ai'}`}
                                            style={{ alignSelf: isMine ? 'flex-end' : 'flex-start' }}
                                        >
                                            {msg.content}
                                            <div className="message-time">
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-input-area">
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%', gap: '10px' }}>
                                    <input 
                                        className="chat-input"
                                        placeholder="Напишите сообщение..." 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className="chat-send-btn">
                                        <span style={{ transform: 'rotate(45deg)', display: 'inline-block', marginBottom: '2px', marginRight: '2px' }}>✈️</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>💬</div>
                                <h2 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Ваши сообщения</h2>
                                <p>Выберите чат, чтобы начать общение</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
