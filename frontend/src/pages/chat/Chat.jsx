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
    <div className="flex flex-col h-[85vh] w-full max-w-7xl mx-auto py-6">
      <div className="mb-4">
        <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Mensajes</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">Chat</h1>
        <p className="text-gray-500 mt-1">Coordina la entrega de tus libros directamente con otros usuarios.</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Columna Izquierda */}
        <Card className="w-1/3 flex flex-col overflow-hidden bg-white shadow-sm border border-gray-200 rounded-xl">
          {loadingRooms ? (
            <div className="p-8 text-center">
              <Loader text="Cargando..." />
            </div>
          ) : (
            <ConversationList
              conversations={rooms}
              activeConversationId={id}
            />
          )}
        </Card>

        {/* Columna Derecha */}
        <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border border-gray-200 rounded-xl">
          {id ? (
            activeConversation ? (
              <>
                {/* Cabecera de la Sala */}
                <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mr-3">
                    {activeConversation.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{activeConversation.name}</h3>
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                      En línea
                    </span>
                  </div>
                </div>

                {/* Lista de Mensajes */}
                {loadingMessages ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader text="Cargando mensajes..." />
                  </div>
                ) : (
                  <MessageList messages={messages} currentUserId={user?.id} />
                )}

                {/* Barra de Input Estilizada */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                  <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Escribe un mensaje..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={!draftMessage.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              loadingRooms ? (
                 <div className="flex-1 flex items-center justify-center">
                    <Loader text="Cargando sala..." />
                 </div>
              ) : (
                 <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>La sala no existe o no tienes acceso.</p>
                 </div>
              )
            )
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg">Selecciona una conversación para comenzar.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Chat;
