import type {
  AnalyzeResponse,
  PreviewData,
  StatusResponse,
  AdminStats,
  DownloadRecord,
  Banner,
  ArticleListItem,
  ArticleDetail,
  AdminArticle,
  ArticleTranslation,
} from "@/types";

const BASE = "/api";

export class RateLimitError extends Error {
  limit: number;
  constructor(limit: number) {
    super("RATE_LIMIT_EXCEEDED");
    this.limit = limit;
    this.name = "RateLimitError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restInit } = init ?? {};
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...extraHeaders },
    ...restInit,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = (body as { detail?: unknown }).detail;
    if (res.status === 429 && detail && typeof detail === "object" && (detail as { code?: string }).code === "RATE_LIMIT_EXCEEDED") {
      throw new RateLimitError((detail as { limit?: number }).limit ?? 3);
    }
    throw new Error(typeof detail === "string" ? detail : `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

// ─── Public ─────────────────────────────────────────────────────────────────

export async function previewUrl(url: string): Promise<PreviewData> {
  const data = await request<PreviewData>("/v1/download/preview", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  // Proxy the thumbnail through our backend so the browser avoids Instagram CDN restrictions
  if (data.thumbnail_url) {
    data.thumbnail_url = `${BASE}/v1/download/thumbnail-proxy?url=${encodeURIComponent(data.thumbnail_url)}`;
  }
  return data;
}

export async function analyzeUrl(url: string, previewThumbnailUrl?: string): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>("/v1/download/analyze", {
    method: "POST",
    body: JSON.stringify({ url, preview_thumbnail_url: previewThumbnailUrl ?? null }),
  });
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  return request<StatusResponse>(`/v1/download/${jobId}/status`);
}

export function getDownloadUrl(jobId: string): string {
  return `${BASE}/v1/download/${jobId}/file`;
}

export async function fetchPublicBanners(position?: string): Promise<Banner[]> {
  const q = position ? `?position=${position}` : "";
  return request<Banner[]>(`/admin/banners/public${q}`);
}

export async function fetchArticles(lang: string): Promise<ArticleListItem[]> {
  const data = await request<{ items: ArticleListItem[] }>(`/v1/articles?lang=${lang}`);
  return data.items;
}

export async function fetchArticle(slug: string, lang: string): Promise<ArticleDetail> {
  return request<ArticleDetail>(`/v1/articles/${encodeURIComponent(slug)}?lang=${lang}`);
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function adminLogin(username: string, password: string): Promise<string> {
  const data = await request<{ access_token: string }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return data.access_token;
}

export async function fetchStats(token: string): Promise<AdminStats> {
  return request<AdminStats>("/admin/stats", { headers: authHeader(token) });
}

export async function fetchDownloads(
  token: string,
  page = 1
): Promise<{ items: DownloadRecord[]; total: number; page: number; pages: number }> {
  return request(`/admin/downloads?page=${page}`, { headers: authHeader(token) });
}

export async function fetchBanners(token: string): Promise<Banner[]> {
  return request<Banner[]>("/admin/banners", { headers: authHeader(token) });
}

export async function createBanner(
  token: string,
  data: Omit<Banner, "id">
): Promise<Banner> {
  return request<Banner>("/admin/banners", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

export async function toggleBanner(token: string, id: string): Promise<void> {
  await request(`/admin/banners/${id}/toggle`, {
    method: "PATCH",
    headers: authHeader(token),
  });
}

export async function deleteBanner(token: string, id: string): Promise<void> {
  await request(`/admin/banners/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
}

// ─── Instagram Credentials ───────────────────────────────────────────────────

export async function fetchCredentials(
  token: string
): Promise<{ instagram_username: string; instagram_password_set: boolean }> {
  return request("/admin/credentials", { headers: authHeader(token) });
}

export async function saveCredentials(
  token: string,
  username: string,
  password: string
): Promise<{ saved: boolean; username: string }> {
  return request("/admin/credentials", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ instagram_username: username, instagram_password: password }),
  });
}

export async function clearCredentials(token: string): Promise<void> {
  await request("/admin/credentials", {
    method: "DELETE",
    headers: authHeader(token),
  });
}

// ─── Cookies file ─────────────────────────────────────────────────────────────

export async function fetchCookiesStatus(
  token: string
): Promise<{ has_cookies: boolean; file_size: number; path: string | null }> {
  return request("/admin/cookies", { headers: authHeader(token) });
}

export async function uploadCookies(token: string, file: File): Promise<{ saved: boolean; file_size: number }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`/api/admin/cookies`, {
    method: "POST",
    headers: authHeader(token), // No Content-Type - browser sets multipart boundary automatically
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deleteCookies(token: string): Promise<void> {
  await request("/admin/cookies", {
    method: "DELETE",
    headers: authHeader(token),
  });
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

export async function fetchProxy(token: string): Promise<{ proxy: string }> {
  return request("/admin/proxy", { headers: authHeader(token) });
}

export async function saveProxy(token: string, proxy: string): Promise<{ saved: boolean; proxy: string }> {
  return request("/admin/proxy", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ proxy }),
  });
}

// ─── Rate limit ───────────────────────────────────────────────────────────────

export async function fetchRateLimit(
  token: string
): Promise<{ enabled: boolean; daily_limit: number }> {
  return request("/admin/rate-limit", { headers: authHeader(token) });
}

export async function saveRateLimit(
  token: string,
  enabled: boolean,
  daily_limit: number
): Promise<{ saved: boolean; enabled: boolean; daily_limit: number }> {
  return request("/admin/rate-limit", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ enabled, daily_limit }),
  });
}

// ─── Articles (admin) ─────────────────────────────────────────────────────────

export async function fetchAdminArticles(token: string): Promise<AdminArticle[]> {
  const data = await request<{ items: AdminArticle[] }>("/admin/articles", {
    headers: authHeader(token),
  });
  return data.items;
}

export async function createArticle(
  token: string,
  data: {
    slug?: string;
    keywords?: string;
    is_published?: boolean;
    lang: string;
    title: string;
    excerpt?: string;
    content?: string;
    translations?: Record<string, ArticleTranslation>;
  }
): Promise<AdminArticle> {
  return request<AdminArticle>("/admin/articles", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

export async function updateArticle(
  token: string,
  id: string,
  data: {
    slug?: string;
    keywords?: string;
    is_published?: boolean;
    lang?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    translations?: Record<string, ArticleTranslation>;
  }
): Promise<AdminArticle> {
  return request<AdminArticle>(`/admin/articles/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
}

export async function toggleArticle(token: string, id: string): Promise<void> {
  await request(`/admin/articles/${id}/toggle`, {
    method: "PATCH",
    headers: authHeader(token),
  });
}

export async function deleteArticle(token: string, id: string): Promise<void> {
  await request(`/admin/articles/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
}
