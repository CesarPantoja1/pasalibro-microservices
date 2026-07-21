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
    return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          title="No hay mensajes"
          description="Escribe el primer mensaje para iniciar la conversación."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;

        return (
          <div
            key={message.id || `temp-${Math.random()}`}
            className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] px-4 py-2 flex flex-col shadow-sm ${
                isOwn 
                  ? 'bg-emerald-700 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
              }`}
            >
              <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
              <span className={`text-[11px] self-end mt-1 ${isOwn ? 'text-emerald-100/90' : 'text-gray-400'}`}>
                {formatTime(message.created_at)}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
