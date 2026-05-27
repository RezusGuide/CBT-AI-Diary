import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchChats();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedChat]);

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
        <div className="app-layout" style={{ height: 'calc(100vh - 6rem)', marginLeft: 0 }}>
            <div className="chat-container animate-in" style={{ width: '100%', display: 'flex' }}>
                {/* CHAT SIDEBAR */}
                <div className="chat-sidebar" style={{ width: '320px', borderRight: '1px solid var(--slate-200)', background: 'var(--white)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Сообщения</h2>
                    </div>
                    <div style={{ overflowY: 'auto', height: 'calc(100% - 70px)' }}>
                        {chats.map(chat => {
                            const otherUser = chat.client.id === user.id ? chat.psychologist : chat.client;
                            return (
                                <div 
                                    key={chat.id} 
                                    onClick={() => setSelectedChat(chat)}
                                    style={{ 
                                        padding: '1.25rem', cursor: 'pointer', 
                                        background: selectedChat?.id === chat.id ? 'var(--p-100)' : 'transparent',
                                        borderLeft: selectedChat?.id === chat.id ? '4px solid var(--p-600)' : '4px solid transparent',
                                        transition: '0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{otherUser.fullName || otherUser.username}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '4px' }}>Нажмите, чтобы открыть чат</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MESSAGES AREA */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-lavender)' }}>
                    {selectedChat ? (
                        <>
                            <div style={{ padding: '1rem 2rem', background: 'var(--white)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--p-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {(selectedChat.client.id === user.id ? selectedChat.psychologist : selectedChat.client).username.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                                    {selectedChat.client.id === user.id ? selectedChat.psychologist.fullName : selectedChat.client.fullName}
                                </h3>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.sender.id === user.id ? 'msg-mine' : 'msg-theirs'}`}>
                                        {msg.content}
                                        <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{ padding: '1.5rem 2rem', background: 'var(--white)', borderTop: '1px solid var(--slate-200)' }}>
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                                    <input 
                                        placeholder="Напишите сообщение..." 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        style={{ marginBottom: 0 }}
                                    />
                                    <button type="submit" className="btn-primary">Отправить</button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                                <p>Выберите чат для начала общения</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
