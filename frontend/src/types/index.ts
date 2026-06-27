export type DownloadStep = "idle" | "analyzing" | "processing" | "ready" | "error";

export interface AnalyzeResponse {
  job_id: string;
  status: string;
  media_type: string;
  remaining: number;
}

export interface CarouselFile {
  index: number;
  name: string;
  media_type: "image" | "video";
  url: string;
}

export interface StatusResponse {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  title?: string | null;
  thumbnail_url?: string | null;
  media_type?: string | null;
  file_count?: number;
  carousel_files?: CarouselFile[] | null;
  error?: string | null;
}

export interface DownloadResult {
  job_id: string;
  title: string;
  thumbnail_url: string;
  media_type: string;
  file_count: number;
  carousel_files?: CarouselFile[] | null;
}

export interface Banner {
  id: string;
  position: string;
  image_url: string;
  link_url: string;
}

export interface AdminStats {
  total: number;
  completed: number;
  failed: number;
  today: number;
  success_rate: number;
}

export interface DownloadRecord {
  job_id: string;
  ip_address: string;
  status: string;
  media_type: string;
  title?: string | null;
  created_at: string;
}
