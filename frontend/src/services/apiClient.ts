const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

const getAuthToken = () => localStorage.getItem('auth_token');

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json();
    return data.error || data.msg || 'Request failed';
  } catch {
    return 'Request failed';
  }
};

export const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<T>;
};

