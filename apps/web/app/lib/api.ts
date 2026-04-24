const API_URL = process.env.API_URL;

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export const api = {
  novels: {
    list: () => apiFetch<any[]>(`/api/novels`, { cache: "no-store" }),
    byId: (id: string) =>
      apiFetch<any>(`/api/novels/${id}`, { cache: "no-store" }),
  },
  chapters: {
    byNumber: (novelId: string, chapterNumber: number) =>
      apiFetch<any>(`/api/novels/${novelId}/chapters/${chapterNumber}`, {
        cache: "no-store",
      }),
  },
  bookmarks: {
    list: (token: string) =>
      apiFetch<{ bookmarks: any[] }>(
        `/api/bookmarks`,
        { cache: "no-store" },
        token,
      ),
  },
};
