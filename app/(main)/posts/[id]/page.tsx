"use client";

import { useParams } from "next/navigation";
import { useBoardQuery, useCategoriesQuery } from "@/lib/queries/boards";
import { CATEGORY_COLOR } from "@/lib/constants/board";
import { formatDetailDate } from "@/lib/utils/formatDate";
import PostDetailSkeleton from "@/components/posts/PostDetailSkeleton";
import PostImageLightbox from "@/components/posts/PostImageLightbox";
import PostDetailActions from "@/components/posts/PostDetailActions";
import type { BoardCategory } from "@/types";

export default function PostDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: post, isLoading, error } = useBoardQuery(id);
  const { data: categoryMap } = useCategoriesQuery();

  if (isLoading) return <PostDetailSkeleton />;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
      >
        {error.message}
      </div>
    );
  }

  if (!post) return null;

  const imageSrc = post.imageUrl?.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_API_BASE}${post.imageUrl}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="pb-5 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              CATEGORY_COLOR[post.boardCategory as BoardCategory] ??
              "bg-gray-100 text-gray-600"
            }`}
          >
            {categoryMap?.[post.boardCategory] ?? post.boardCategory}
          </span>
          <span className="text-xs text-gray-400">
            {formatDetailDate(post.createdAt)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
      </div>

      <div className="text-gray-700 leading-relaxed text-base mb-6 whitespace-pre-wrap wrap-break-word min-h-24">
        {post.content}
      </div>

      {imageSrc && <PostImageLightbox src={imageSrc} />}

      <PostDetailActions id={id} />
    </div>
  );
}
