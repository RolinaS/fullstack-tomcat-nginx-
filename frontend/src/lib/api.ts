// src/lib/api.ts

// Base API selon l'environnement (SSR vs navigateur)
export function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.API_INTERNAL_BASE ?? "http://api:8080/api";
  }
  return process.env.NEXT_PUBLIC_API_BASE ?? "/api";
}

type Json =
  | string | number | boolean | null
  | { [key: string]: Json } | Json[];

function buildUrl(path: string): string {
  const base = apiBase();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${url} -> ${res.status}`);
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}
export async function apiPost<T>(path: string, body: Json | FormData): Promise<T> {
  const init: RequestInit =
    body instanceof FormData
      ? { method: "POST", body }
      : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
  return request<T>(path, init);
}
export async function apiPut<T>(path: string, body: Json | FormData): Promise<T> {
  const init: RequestInit =
    body instanceof FormData
      ? { method: "PUT", body }
      : { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
  return request<T>(path, init);
}
export async function apiDelete(path: string): Promise<void> {
  await request<unknown>(path, { method: "DELETE" });
}


type ApiCallable = {
  // GET simple
  <T>(path: string): Promise<T>;
  // surcharge: accepte un RequestInit (POST/PUT/DELETE “à la main”)
  <T>(path: string, init: RequestInit): Promise<T>;
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: Json | FormData): Promise<T>;
  put<T>(path: string, body: Json | FormData): Promise<T>;
  delete(path: string): Promise<void>;
};

const apiCallable = (async function apiCallable<T>(
  path: string,
  init?: RequestInit
) {
  return request<T>(path, init);
}) as ApiCallable;

apiCallable.get = apiGet;
apiCallable.post = apiPost;
apiCallable.put = apiPut;
apiCallable.delete = apiDelete;

export const api = apiCallable;

