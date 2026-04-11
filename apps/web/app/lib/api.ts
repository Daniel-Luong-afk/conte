const API_URL = process.env.API_URL;

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-type": "application.json", ...options?.headers },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export const api = {
  novels: {
    list: () =>
      apiFetch<any[]>(`/api/novels`, {
        next: { revalidate: 300 },
      }),

    byId: (id: string) =>
      apiFetch<any>(`/api/novels/${id}`, {
        next: { revalidate: 3600 },
      }),
  },
  chapters: {
    byNumber: (novelId: string, chapterNumber: number) =>
      apiFetch<any>(`/api/novels/${novelId}/chapters/${chapterNumber}`, {
        next: { revalidate: 86400 },
      }),
  },
};
