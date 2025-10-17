const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const requestInit: RequestInit & { next?: { revalidate?: number } } = {
    ...init
  };

  if (!init || !init.method || init.method === 'GET') {
    requestInit.next = { revalidate: 60 };
  }

  const res = await fetch(`${API_BASE}${path}`, requestInit);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
};
