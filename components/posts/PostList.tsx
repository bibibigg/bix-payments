"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useBoardsQuery, useCategoriesQuery } from "@/lib/queries/boards";
import Pagination from "@/components/posts/Pagination";
import { PostTableSkeleton } from "@/components/posts/PostListSkeleton";
import { CATEGORY_COLOR } from "@/lib/constants/board";
import { formatListDate } from "@/lib/utils/formatDate";
import type { BoardCategory } from "@/types";

export default function PostList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") || "1") - 1);
  const category = (searchParams.get("category") as BoardCategory | null) ?? undefined;

  const { data, isLoading, error } = useBoardsQuery(page, category);
  const { data: categoryMap } = useCategoriesQuery();

  const handlePageChange = useCallback((newPage: number) => {
    const catParam = category ? `category=${category}` : "";
    if (newPage === 0) {
      router.push(catParam ? `/?${catParam}` : "/");
    } else {
      router.push(`/?page=${newPage + 1}${catParam ? `&${catParam}` : ""}`);
    }
  }, [category, router]);

  const handleCategoryChange = useCallback((newCategory?: BoardCategory) => {
    router.push(newCategory ? `/?category=${newCategory}` : "/");
  }, [router]);

  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categoryMap ? (
          <>
            <button
              onClick={() => handleCategoryChange()}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                !category
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              전체
            </button>
            {(Object.entries(categoryMap) as [BoardCategory, string][]).map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                  category === cat
                    ? `${CATEGORY_COLOR[cat] ?? "bg-gray-100 text-gray-600"} border-transparent shadow-sm`
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </>
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 rounded-full bg-gray-200 animate-pulse shrink-0"
            />
          ))
        )}
      </div>

      {isLoading ? (
        <>
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-3" />
          <PostTableSkeleton />
        </>
      ) : error ? (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error.message}</span>
        </div>
      ) : !data || data.empty ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            className="w-12 h-12 mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-500">게시글이 없습니다</p>
          <p className="text-xs mt-1 text-gray-400">첫 번째 글을 작성해보세요.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            총{" "}
            <span className="font-semibold text-gray-800">
              {data.totalElements.toLocaleString()}
            </span>
            건
          </p>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden sm:grid sm:grid-cols-[64px_112px_1fr_96px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider select-none">
              <span>번호</span>
              <span>카테고리</span>
              <span>제목</span>
              <span className="text-right">작성일</span>
            </div>

            <ul role="list" className="divide-y divide-gray-100">
              {data.content.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className={[
                      "grid grid-cols-[1fr_80px] gap-x-3 gap-y-1",
                      "sm:grid-cols-[64px_112px_1fr_96px] sm:gap-4 sm:gap-y-0",
                      "px-5 py-4 items-center",
                      "hover:bg-blue-50/40 transition-colors group",
                    ].join(" ")}
                  >
                    <span className="hidden sm:block text-sm text-gray-400 tabular-nums">
                      {post.id}
                    </span>

                    <span
                      className={`inline-flex items-center self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${
                        CATEGORY_COLOR[post.category] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {categoryMap?.[post.category] ?? post.category}
                    </span>

                    <span className="text-sm font-medium text-gray-900 leading-snug truncate group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </span>

                    <span className="text-xs text-gray-400 text-right tabular-nums whitespace-nowrap">
                      {formatListDate(post.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            currentPage={data.number}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
