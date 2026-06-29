import type { AnalyzeResponse, StatusResponse, AdminStats, DownloadRecord, Banner } from "@/types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restInit } = init ?? {};
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...extraHeaders },
    ...restInit,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

// ─── Public ─────────────────────────────────────────────────────────────────

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>("/v1/download/analyze", {
    method: "POST",
    body: JSON.stringify({ url }),
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
