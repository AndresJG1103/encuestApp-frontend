export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const extractError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = await res.json();
    const err = body?.error;
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
      if (Array.isArray(err.message)) return err.message.join(', ');
      if (typeof err.message === 'string') return err.message;
    }
    if (typeof body?.message === 'string') return body.message;
    return fallback;
  } catch {
    return fallback;
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  let token = getAccessToken();

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      throw new Error('Unauthorized');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const { accessToken, refreshToken: newRefreshToken } = refreshData.data;
          setTokens(accessToken, newRefreshToken);
          isRefreshing = false;
          onRefreshed(accessToken);
        } else {
          isRefreshing = false;
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Refresh token expired');
        }
      } catch (err) {
        isRefreshing = false;
        clearTokens();
        throw err;
      }
    }

    const retryOriginalRequest = new Promise((resolve) => {
      subscribeTokenRefresh((newToken: string) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        resolve(fetch(url, { ...config, headers }));
      });
    });

    return (await retryOriginalRequest) as Response;
  }

  return response;
};
