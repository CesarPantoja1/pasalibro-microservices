import api from './api.js';

export async function getBooks(params = {}) {
  return api.get('/books', { params });
}

export async function getBookById(id) {
  return api.get(`/books/${id}`);
}

export async function createBook(payload) {
  return api.post('/books', payload);
}

export async function updateBook(id, payload) {
  return api.put(`/books/${id}`, payload);
}

export async function deleteBook(id) {
  return api.delete(`/books/${id}`);
}
