import { useAuthStore } from "@/store/authStore";
import { decodeJwt } from "@/lib/utils/jwt";
import { refresh } from "@/lib/api/auth";

// 동시 401 응답 시 refresh가 중복 호출되는 race condition 방지
let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const data = await refresh(refreshToken);
      const { name, username } = decodeJwt(data.accessToken);

      useAuthStore.getState().setAuth(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        { name, username }
      );

      return data.accessToken;
    } catch {
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 401) return res;

  const newToken = await tryRefresh();

  if (!newToken) {
    useAuthStore.getState().clearAuth();
    window.location.href = "/login";
    return res;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  });
}
