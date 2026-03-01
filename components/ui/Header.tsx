"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/authStore";

function subscribe() {
  return () => {};
}

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          게시판
        </Link>

        {!mounted ? (
          <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3 text-sm min-w-0">
            <span className="text-gray-700 font-medium truncate">
              {user.name}
              <span className="text-gray-400 font-normal ml-1 text-xs">
                ({user.username})
              </span>
            </span>

            <span
              className="w-px h-4 bg-gray-200 shrink-0"
              aria-hidden="true"
            />

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
