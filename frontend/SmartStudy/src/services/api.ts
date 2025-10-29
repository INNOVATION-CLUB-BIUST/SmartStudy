import { getIdToken } from './auth';

const baseUrl = (import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!baseUrl) {
    console.warn('VITE_FUNCTIONS_BASE_URL is not set. Requests will likely fail.');
  }

  const res = await fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error('Request failed'), { status: res.status, data });
  }
  return data as T;
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

// Specific endpoints
export function postOnboarding(payload: unknown) {
  return post<{ message: string; userId: string }>("/onboarding", payload);
}
