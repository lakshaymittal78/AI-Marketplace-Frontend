const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export interface TokenInfo {
  used: number;
  limit: number;
  remaining: number;
  status: string | null;
}

export interface AuthResponse {
  access_token: string;
  tokens?: TokenInfo;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  history: ChatMessage[];
}

export const api = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  chat: async (message: string, history: ChatMessage[]): Promise<ChatResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Chat request failed');
    }

    return response.json();
  },

  getTokenInfo: async (): Promise<TokenInfo> => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/tokens`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch token info');
    }

    return response.json();
  },
}

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!getToken();
