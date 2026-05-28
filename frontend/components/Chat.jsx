import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../src/api';

const Chat = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [partner, setPartner] = useState(null);       // for CLIENT: their psychologist
    const [clientList, setClientList] = useState([]);   // for PSYCHOLOGIST: their clients
    const [activeClient, setActiveClient] = useState(null); // PSYCHOLOGIST selects a client
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const chatPartnerId = user.role === 'CLIENT'
      ? partner?.id
      : activeClient?.id;

    // Load partner info
    useEffect(() => {
      fetch(API_URL(`/api/chat/partner?userId=${user.id}`))
        .then(res => res.json())
        .then(data => {
          if (user.role === 'CLIENT') {
            setPartner(data.partner);
          } else {
            setClientList(data.clients || []);
            if (data.clients?.length > 0) setActiveClient(data.clients[0]);
          }
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        });
    }, [user.id, user.role]);

    // Load messages when chat partner changes
    useEffect(() => {
      if (!chatPartnerId) {
        setMessages([]);
        return;
      }
      
      const fetchHistory = () => {
        fetch(API_URL(`/api/chat/messages/${chatPartnerId}?userId=${user.id}`))
          .then(res => res.json())
          .then(data => setMessages(data))
          .catch(err => console.error(err));
      };

      fetchHistory();
      const poll = setInterval(fetchHistory, 3000);
      return () => clearInterval(poll);
    }, [chatPartnerId, user.id]);

    // Scroll to bottom on new messages
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
      if (e) e.preventDefault();
      if (!input.trim() || !chatPartnerId) return;
      
      const content = input.trim();
      setInput('');
      
      // Optimistic update
      const tempId = Date.now();
      setMessages(prev => [...prev, {
        id: tempId, 
        content,
        sender: { id: user.id },
        sentAt: new Date().toISOString()
      }]);

      try {
        await fetch(API_URL(`/api/chat/messages/${chatPartnerId}?senderId=${user.id}`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
      } catch (err) {
        console.error('Send failed:', err);
      }
    };

    if (loading) return <div style={{ color: 'var(--text-muted)', padding: 32 }}>Загрузка...</div>;

    // CLIENT with no psychologist
    if (user.role === 'CLIENT' && !partner) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: 48, margin: '0 auto', maxWidth: '600px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
          <h2>Чат недоступен</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Сначала выберите психолога в разделе «Профиль», чтобы начать общение.
          </p>
        </div>
      );
    }

    // PSYCHOLOGIST with no clients
    if (user.role === 'PSYCHOLOGIST' && clientList.length === 0) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: 48, margin: '0 auto', maxWidth: '600px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
          <h2>Нет активных клиентов</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Когда клиент выберет вас своим психологом, он появится здесь.
          </p>
        </div>
      );
    }

    const currentPartner = user.role === 'CLIENT' ? partner : activeClient;

    return (
      <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 120px)' }}>

        {/* PSYCHOLOGIST: client selector sidebar */}
        {user.role === 'PSYCHOLOGIST' && (
          <div className="card" style={{ width: 240, flexShrink: 0, padding: '12px 0', overflowY: 'auto' }}>
            <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 600,
                          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Мои Клиенты
            </div>
            {clientList.map(client => (
              <div
                key={client.id}
                onClick={() => setActiveClient(client)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                  background: activeClient?.id === client.id ? 'var(--bg-surface-2)' : 'transparent',
                  borderLeft: activeClient?.id === client.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  transition: 'var(--transition-fast)', margin: '0 4px',
                }}
              >
                {client.profilePicture
                  ? <img src={client.profilePicture} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} alt="client" />
                  : <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-orange-glow)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'var(--accent-orange)'
                    }}>{(client.fullName || client.username || "?")[0]}</div>
                }
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: activeClient?.id === client.id ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {client.fullName || client.username}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat window */}
        <div className="chat-container" style={{ flex: 1 }}>
          {/* Header */}
          <div className="chat-header">
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              {currentPartner?.profilePicture
                ? <img src={currentPartner.profilePicture}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} alt="partner" />
                : <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: '#fff'
                  }}>
                    {(currentPartner?.fullName || currentPartner?.username || "?")[0]}
                  </div>
              }
              <div style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 10, height: 10, background: '#34d399',
                borderRadius: '50%', border: '2px solid var(--bg-surface)'
              }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {currentPartner?.fullName || currentPartner?.username}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {user.role === 'CLIENT' ? 'Психолог' : 'Клиент'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px',
                        display: 'flex', flexDirection: 'column', gap: 4 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)',
                            fontSize: 13, marginTop: 32 }}>
                Начните разговор 👋
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.sender?.id === user.id || msg.sender === user.id;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column',
                                           alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div className={isMe ? 'message message-user' : 'message message-ai'}>
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {new Date(msg.sentAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <form onSubmit={sendMessage} style={{ display: 'flex', width: '100%', gap: '10px' }}>
                <input
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                />
                <button type="submit" className="chat-send-btn">➤</button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Chat;
