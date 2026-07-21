import React, { useEffect, useRef } from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

// Historial de mensajes de la conversación activa.
// Diferencia visualmente los mensajes propios de los recibidos según currentUserId.
function MessageList({ messages = [], currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoDate) => {
    if (!isoDate) return '';
    // Asegurarse de que se trata como UTC añadiendo la "Z" si no la tiene
    const date = new Date(isoDate.endsWith('Z') ? isoDate : `${isoDate}Z`);
    // Formato consistente 12h: "12:56 a.m."
    return date.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (messages.length === 0) {
    return (
      <div className="chat-messages chat-messages--empty">
        <EmptyState
          title="No hay mensajes"
          description="Escribe el primer mensaje para iniciar la conversación."
        />
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;

        return (
          <div
            key={message.id || `temp-${Math.random()}`}
            className={`chat-message-row${isOwn ? ' chat-message-row--own' : ''}`}
          >
            <div className={`chat-bubble${isOwn ? ' chat-bubble--own' : ' chat-bubble--other'}`}>
              <p className="chat-bubble__text">{message.content}</p>
              <span className="chat-bubble__time">{formatTime(message.created_at)}</span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
