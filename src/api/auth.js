// Backend endpoints:
// POST /auth/signup   { fullName, email, password }
// POST /auth/login    { email, password }
// POST /auth/logout
// GET  /auth/me       current user or 401

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export class AuthApiError extends Error {
  constructor(message, status = null, errors = {}) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.errors = errors;
  }
}

const request = async (path, { method = 'GET', body } = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthApiError('Unable to connect to TradeSphere. Check your connection and try again.');
  }

  let data = null;
  if (response.status !== 204) {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        if (response.ok) {
          throw new AuthApiError('The server returned an invalid response.', response.status);
        }
      }
    }
  }

  if (!response.ok) {
    const message = typeof data?.message === 'string'
      ? data.message
      : `Request failed (${response.status}). Please try again.`;
    const errors = data?.errors && typeof data.errors === 'object' ? data.errors : {};
    throw new AuthApiError(message, response.status, errors);
  }

  return data;
};

export const signUp = (credentials) => request('/auth/signup', {
  method: 'POST',
  body: credentials,
});

export const signIn = (credentials) => request('/auth/login', {
  method: 'POST',
  body: credentials,
});

export const signOut = () => request('/auth/logout', { method: 'POST' });

export const getCurrentUser = async () => {
  try {
    const response = await request('/auth/me');
    if (!response) {
      throw new AuthApiError('The server returned an invalid session response.', 200);
    }
    if (response && typeof response === 'object' && Object.hasOwn(response, 'user')) {
      return response.user || null;
    }
    return response ?? null;
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
};
