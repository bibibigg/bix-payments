import { Suspense } from "react";
import Link from "next/link";
import PostList from "@/components/posts/PostList";
import { PostListSkeleton } from "@/components/posts/PostListSkeleton";

export default function HomePage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">게시글 목록</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            커뮤니티의 다양한 이야기를 확인하세요
          </p>
        </div>
        <Link
          href="/posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          글쓰기
        </Link>
      </div>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </>
  );
}
