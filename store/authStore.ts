import { create } from 'zustand';
import type { User } from '@/types';
import { decodeJwt } from '@/lib/utils/jwt';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  clearAuth: () => void;
}

const COOKIE_FLAG = 'isLoggedIn=1; path=/; SameSite=Lax';
const COOKIE_CLEAR = 'isLoggedIn=; path=/; max-age=0; SameSite=Lax';

function readLocalStorage(): Pick<AuthState, 'user'> {
  if (typeof window === 'undefined') {
    return { user: null };
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return { user: null };
  }

  try {
    const { name, username } = decodeJwt(accessToken);
    // localStorage에 유효한 토큰이 있으면 쿠키 플래그도 동기화
    // (브라우저 재방문 시 middleware가 쿠키를 읽어 리다이렉트 여부를 결정)
    document.cookie = COOKIE_FLAG;
    return { user: { name, username } };
  } catch {
    return { user: null };
  }
}

export const useAuthStore = create<AuthState>(() => ({
  ...readLocalStorage(),
  isHydrated: typeof window !== 'undefined',

  setAuth: ({ accessToken, refreshToken }, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    document.cookie = COOKIE_FLAG;
    useAuthStore.setState({ user });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = COOKIE_CLEAR;
    useAuthStore.setState({ user: null });
  },
}));
