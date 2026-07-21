import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRooms, getMessages } from '../../services/chatService.js';
import ConversationList from './ConversationList.jsx';
import MessageList from './MessageList.jsx';

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  
  const socketRef = useRef(null);

  // 1. Cargar las salas
  useEffect(() => {
    let isMounted = true;
    async function fetchRooms() {
      try {
        const response = await getRooms();
        if (isMounted) {
          // Mapeamos los datos del backend al formato que espera el frontend
          const mappedRooms = response.data.map(room => {
            // El backend retorna seller_id y buyer_id. 
            // Si el user logueado es el buyer, la otra persona es el seller.
            const isBuyer = user?.id === room.buyer_id;
            const otherUserId = isBuyer ? room.seller_id : room.buyer_id;
            
            return {
              id: room.id,
              name: `Usuario #${otherUserId}`, // TODO: Traer nombre real desde ms-users
              book_id: room.book_id,
              unread: 0, 
              lastMessage: `Sala #${room.id} - Libro #${room.book_id}`
            };
          });
          setRooms(mappedRooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        if (isMounted) setLoadingRooms(false);
      }
    }
    fetchRooms();
    return () => { isMounted = false; };
  }, [user]);

  // 2. Conectar a WebSocket y cargar mensajes de la sala activa
  useEffect(() => {
    if (!id) return;
    const roomId = parseInt(id);
    let isMounted = true;

    // Cargar historial REST
    setLoadingMessages(true);
    getMessages(roomId)
      .then(res => {
        if (isMounted) setMessages(res.data);
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingMessages(false);
      });

    // Conectar WebSocket
    const token = localStorage.getItem('token');
    socketRef.current = io('/', {
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket conectado:', socket.id);
      socket.emit('join_room', { room_id: roomId });
    });

    socket.on('new_message', (incomingMessage) => {
      if (isMounted && incomingMessage.room_id === roomId) {
        setMessages(prev => [...prev, incomingMessage]);
      }
    });
    
    socket.on('error', (err) => {
        console.error('Socket error:', err);
        // Si hay error de IDOR (no es participante), podríamos redirigir
        if (err.error === 'You are not a participant of this room') {
           alert("No tienes permiso para ver este chat.");
           navigate('/chat');
        }
    });

    return () => {
      isMounted = false;
      socket.emit('leave_room', { room_id: roomId });
      socket.disconnect();
    };
  }, [id, navigate]);

  const activeConversation = useMemo(
    () => rooms.find((r) => r.id === parseInt(id)) || null,
    [rooms, id]
  );

  const handleSendMessage = () => {
    const trimmed = draftMessage.trim();
    if (!trimmed || !id || !socketRef.current) return;

    // Emitir mensaje por WebSockets
    socketRef.current.emit('send_message', {
      room_id: parseInt(id),
      content: trimmed
    });

    setDraftMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-page__eyebrow-wrap">
        <span className="chat-page__eyebrow">Mensajes</span>
        <h1>Chat</h1>
        <p>Coordina la entrega de tus libros directamente con otros usuarios.</p>
      </div>

      <div className="chat-page__grid">
        <Card className="chat-sidebar">
          {loadingRooms ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Loader text="Cargando..." />
            </div>
          ) : (
            <ConversationList
              conversations={rooms}
              activeConversationId={id}
            />
          )}
        </Card>

        <Card className="chat-panel">
          {id ? (
            activeConversation ? (
              <>
                <div className="chat-panel__header">
                  <span className="chat-panel__avatar">
                    {activeConversation.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div>
                    <h3>{activeConversation.name}</h3>
                    <span className="chat-panel__status">En línea</span>
                  </div>
                </div>

                {loadingMessages ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader text="Cargando mensajes..." />
                  </div>
                ) : (
                  <MessageList messages={messages} currentUserId={user?.id} />
                )}

                <div className="chat-panel__input-bar">
                  <textarea
                    className="chat-panel__textarea"
                    placeholder="Escribe un mensaje..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <Button variant="primary" onClick={handleSendMessage} disabled={!draftMessage.trim()}>
                    Enviar
                  </Button>
                </div>
              </>
            ) : (
              loadingRooms ? (
                 <div className="chat-panel__empty">
                    <Loader text="Cargando sala..." />
                 </div>
              ) : (
                 <div className="chat-panel__empty">
                    <p>La sala no existe o no tienes acceso.</p>
                 </div>
              )
            )
          ) : (
            <div className="chat-panel__empty">
              <p>Selecciona una conversación para comenzar.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Chat;
