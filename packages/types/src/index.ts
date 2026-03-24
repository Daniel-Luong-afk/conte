export type {
  Novel,
  Chapter,
  User,
  Bookmark,
  GlossaryTerm,
  NovelSource,
  ReadingProgress,
  ScrapeJob,
} from "@prisma/client";

// Shared response shape for all endpoints
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// Cost is optional, will set after chosen AI translator responds
export interface TranslationJob {
  chapterId: string;
  novelId: string;
  sourceLanguage: "JP" | "KR" | "CN";
  status: "pending" | "processing" | "done" | "failed";
  cost?: number;
}

// Shape for /api/admin/cache response
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: string;
}
