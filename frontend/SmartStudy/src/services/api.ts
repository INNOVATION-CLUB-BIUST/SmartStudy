import { getAuth } from "firebase/auth";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/smartstudy-26356/us-central1/api";
/**
 * Retrieves the current user's Firebase ID token.
 *
 * - If the user is already loaded (`auth.currentUser` exists), returns the token immediately.
 * - If Firebase Auth is still initializing, waits for `onAuthStateChanged` to fire before returning the token.
 * - Returns `null` if no user is logged in.
 *
 * This ensures that API requests always include a valid token, even on initial page load.
 */
async function getUserToken(): Promise<string | null> {
  const auth = getAuth();

  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }

  // Wait for Firebase to finish initializing
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      resolve(user ? await user.getIdToken() : null);
    });
  });
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {

  // Get token if logged in
  const token = await getUserToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠ No Firebase auth token found. User may not be logged in.");
  }

  if (!baseUrl) {
    console.warn("⚠ baseUrl is empty. API calls will fail.");
  }

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("🌐 API Request:", options.method || "GET", url);

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    console.error("❌ Network error:", networkError);
    throw new Error("Network error — is the backend emulator running?");
  }

  // Attempt to parse server JSON
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    console.warn("⚠ Response was not valid JSON");
  }

  // Handle HTTP status errors
  if (!res.ok) {
    const message =
      data?.error ||
      `Request failed with status ${res.status}: ${res.statusText}`;

    console.error("❌ API Error:", message, "→ Full data:", data);
    throw Object.assign(new Error(message), {
      status: res.status,
      data,
    });
  }

  return data as T;
}

// ------------------------------
// Public API Methods
// ------------------------------

export function post<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export function get<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: "GET",
    ...options,
  });
}

export function put<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });
}

export function del<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    method: "DELETE",
    ...options,
  });
}

// ------------------------------
// Onboarding Types & Endpoint
// ------------------------------

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

export function postOnboarding(payload: OnboardingPayload) {
  return post<OnboardingResponse>("/onboarding", payload);
}
