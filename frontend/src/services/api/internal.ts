import { env } from '../../config/env';

class InternalApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'InternalApiError';
  }
}

export const internalApi = {
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<unknown> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${env.VITE_API_URL}/api/v1${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new InternalApiError(response.status, errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  },

  get(url: string) {
    return this.fetchWithAuth(url, { method: 'GET' });
  },

  post(url: string, body: unknown) {
    return this.fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body) });
  },

  put(url: string, body: unknown) {
    return this.fetchWithAuth(url, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(url: string) {
    return this.fetchWithAuth(url, { method: 'DELETE' });
  },

  patch(url: string, body: unknown) {
    return this.fetchWithAuth(url, { method: 'PATCH', body: JSON.stringify(body) });
  }
};
