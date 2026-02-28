"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          게시판
        </Link>

        {/* isHydrated가 false이면 인증 상태가 불확실한 구간이므로 스켈레톤을 표시한다. */}
        {!isHydrated ? (
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              {user.name} ({user.username})
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:underline"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
