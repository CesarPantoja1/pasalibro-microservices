import api from './api.js';

export async function createRoom(payload) {
  return api.post('/chat/rooms', payload);
}

export async function getRooms() {
  return api.get('/chat/rooms');
}

export async function getMessages(roomId) {
  return api.get(`/chat/rooms/${roomId}/messages`);
}

// TODO: El envío de mensajes se manejará vía Socket.IO cuando el cliente se integre.
export async function sendMessage(roomId, payload) {
  return api.post(`/chat/rooms/${roomId}/messages`, payload);
}
