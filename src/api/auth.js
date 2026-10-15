// src/api/auth.js
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

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

// --- Auth API ---
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

export const updateProfile = (profileData) => request('/auth/profile', {
  method: 'PUT',
  body: profileData,
});

// --- Catalog / Products API ---
export const getProducts = () => request('/products');

export const getProductById = (productId) => request(`/products/${productId}`);

export const getVendorProducts = (vendorId) => request(`/products/vendor/${vendorId}`);

export const createProduct = (productData) => request('/products', {
  method: 'POST',
  body: productData,
});

export const updateProduct = (productId, productData) => request(`/products/${productId}`, {
  method: 'PUT',
  body: productData,
});

export const deleteProduct = (productId) => request(`/products/${productId}`, {
  method: 'DELETE',
});

// --- Orders API ---
export const placeOrder = (orderData) => request('/orders', {
  method: 'POST',
  body: orderData,
});

export const getMyOrders = () => request('/orders/me');

export const getOrderById = (orderId) => request(`/orders/${orderId}`);

export const approveOrderPacking = (orderId) => request(`/orders/${orderId}/approve-packing`, {
  method: 'POST',
});

export const getBuyerOrders = (buyerId) => request(`/orders/buyer/${buyerId}`);

export const getVendorOrders = (vendorId) => request(`/orders/vendor/${vendorId}`);

// --- Business Verification (KYC) API ---
export const getMyVerification = () => request('/verification/me');

export const saveMyVerification = (payload) => request('/verification/me', {
  method: 'PUT',
  body: payload,
});

// --- Disputes API ---
export const getDisputes = () => request('/disputes');

export const createDispute = (disputeData) => request('/disputes', {
  method: 'POST',
  body: disputeData,
});

export const updateDisputeStatus = (disputeId, status) => request(`/disputes/${disputeId}/status`, {
  method: 'PATCH',
  body: { status },
});

// --- Notifications API ---
export const getNotifications = () => request('/notifications');

export const markNotificationRead = (id) => request(`/notifications/${id}/read`, {
  method: 'PATCH',
});

export const markAllNotificationsRead = () => request('/notifications/read-all', {
  method: 'PATCH',
});