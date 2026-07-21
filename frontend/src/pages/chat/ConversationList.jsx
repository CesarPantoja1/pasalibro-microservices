import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';

function ConversationList({ conversations = [], activeConversationId }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-semibold text-gray-800 text-lg">Conversaciones</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyState
            title="Sin conversaciones"
            description="Cuando contactes a un vendedor o comprador, aparecerá aquí."
          />
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === parseInt(activeConversationId);

            return (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={`flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-emerald-50/50 transition-colors ${isActive ? 'bg-emerald-50 border-l-4 border-l-emerald-500 pl-3' : 'border-l-4 border-l-transparent'}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg bg-emerald-100 text-emerald-700">
                  {conversation.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-gray-900 truncate">{conversation.name}</span>
                    {conversation.unread > 0 ? (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{conversation.unread}</span>
                    ) : null}
                  </div>
                  <span className="text-sm text-gray-500 truncate">{conversation.lastMessage || 'Haz clic para ver los mensajes'}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;
