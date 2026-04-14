const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-c9715.up.railway.app/api/v1';
const TOKEN_KEY = '@gtmed:token';
const USER_KEY = '@gtmed:user';

// ── Rate Limit (429) listener ──
export type RateLimitType = 'questions' | 'flashcards' | 'unknown';
type RateLimitListener = (type: RateLimitType) => void;
const rateLimitListeners: Set<RateLimitListener> = new Set();

export function onRateLimit(listener: RateLimitListener): () => void {
  rateLimitListeners.add(listener);
  return () => { rateLimitListeners.delete(listener); };
}

function notifyRateLimit(data: Record<string, unknown>) {
  const details = data?.details as Record<string, unknown> | undefined;
  const type: RateLimitType = details?.type === 'flashcards' ? 'flashcards'
    : details?.type === 'questions' ? 'questions' : 'unknown';
  rateLimitListeners.forEach(fn => fn(type));
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      notifyRateLimit(data);
    }

    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = path;
    if (params) {
      const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
      if (filtered.length > 0) {
        url += '?' + new URLSearchParams(
          filtered.map(([k, v]) => [k, String(v)])
        ).toString();
      }
    }
    return request<T>(url);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
  },
};
