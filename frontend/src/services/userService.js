import api from './api.js';

export async function login(payload) {
  return api.post('/users/login', payload);
}

export async function register(payload) {
  return api.post('/users/register', payload);
}

export async function getProfile() {
  return api.get('/users/profile');
}

export async function updateProfile(payload) {
  return api.put('/users/profile', payload);
}
