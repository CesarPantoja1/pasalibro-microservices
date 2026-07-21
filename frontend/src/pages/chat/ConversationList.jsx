import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';

function ConversationList({ conversations = [], activeConversationId }) {
  return (
    <div className="chat-conversations">
      <div className="chat-conversations__header">
        <h2>Conversaciones</h2>
      </div>

      <div className="chat-conversations__list">
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
                className={`chat-conversation-item${isActive ? ' chat-conversation-item--active' : ''}`}
              >
                <span className="chat-conversation-item__avatar">
                  {conversation.name?.charAt(0)?.toUpperCase() || '?'}
                </span>

                <span className="chat-conversation-item__body">
                  <span className="chat-conversation-item__top">
                    <span className="chat-conversation-item__name">{conversation.name}</span>
                    {conversation.unread > 0 ? (
                      <span className="chat-conversation-item__badge">{conversation.unread}</span>
                    ) : null}
                  </span>
                  <span className="chat-conversation-item__preview">
                    {conversation.lastMessage || 'Haz clic para ver los mensajes'}
                  </span>
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;
