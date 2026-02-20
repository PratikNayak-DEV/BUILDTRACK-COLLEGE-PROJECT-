export const AUTH_TOKEN_KEY = 'buildtrack_token';
export const AUTH_USER_KEY = 'buildtrack_user';

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function setAuthSession(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
