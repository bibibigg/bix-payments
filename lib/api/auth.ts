import type { SignupRequest, LoginRequest, LoginResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function signup(data: SignupRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "회원가입에 실패했습니다");
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "로그인에 실패했습니다");
  }

  return res.json();
}

export async function refresh(refreshToken: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "토큰 갱신에 실패했습니다");
  }

  return res.json();
}
