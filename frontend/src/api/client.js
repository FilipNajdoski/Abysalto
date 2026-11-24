import axios from 'axios';

export const TOKEN_KEY = 'abysalto.token';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errors) {
    const messages = Object.values(data.errors).flat();
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }
  return data?.detail || data?.title || error?.message || 'Something went wrong.';
}

export default client;
