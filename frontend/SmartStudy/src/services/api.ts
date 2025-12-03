const baseUrl = (import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (!baseUrl) {
    console.warn('VITE_FUNCTIONS_BASE_URL is not set. Requests will likely fail.');
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  console.log('API Request:', url, options.method || 'GET');

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    throw Object.assign(
      new Error(data.error || `Request failed with status ${res.status}`),
      { status: res.status, data }
    );
    data = null;
  }

  if (!res.ok) {
    console.error('API Error:', res.status, data);
    throw Object.assign(new Error(data?.error || 'Request failed'), { status: res.status, data });
  }

  return data as T;
}

export function post<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options
  });
}

export function get<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, { method: 'GET', ...options });
}

export function put<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options
  });
}

export function del<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, { method: 'DELETE', ...options });
}

export interface OnboardingPayload {
  userId: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    university: string;
    major?: string;
    yearOfStudy: string;
    studentId: string;
    dateOfBirth?: string;
  };
  course: string;
  goals: {
    title: string;
    targetDate: string;
    priority: string;
  }[];
  preferences: {
    studyTimePreference: string;
    weeklyStudyHours: number;
  };
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  userId: string;
}

// Specific endpoints
export function postOnboarding(payload: OnboardingPayload) {
  return post<OnboardingResponse>("/onboarding", payload);
}
