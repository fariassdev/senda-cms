import createFetchClient, { type Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';

import { useAuthStore } from '@/stores/authStore';
import type { paths } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create public client first (for auth operations that shouldn't use auth middleware)
const publicFetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const store = useAuthStore.getState();
    const token = store.token;

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    return request;
  },

  async onResponse({ response }) {
    // Handle 401 responses by clearing auth state
    if (response.status === 401) {
      const store = useAuthStore.getState();
      store.clearAuth();
    }

    return response;
  },
};

const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);

export const $publicApi = createClient(publicFetchClient);
