"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import EditPostSkeleton from "@/components/posts/EditPostSkeleton";
import { useBoardQuery, useUpdateBoardMutation } from "@/lib/queries/boards";
import type { BoardCategory, BoardRequest } from "@/types";

export default function EditPostPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: post, isLoading, error } = useBoardQuery(id);
  const updateMutation = useUpdateBoardMutation(id);

  const handleSubmit = useCallback(
    (data: BoardRequest, file?: File) => updateMutation.mutateAsync({ data, file }),
    [updateMutation],
  );

  if (isLoading) return <EditPostSkeleton />;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {error.message}
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <PostForm
        initialData={{
          title: post.title,
          content: post.content,
          category: post.boardCategory as BoardCategory,
        }}
        initialImageUrl={post.imageUrl}
        onSubmit={handleSubmit}
        submitLabel="수정"
      />
    </div>
  );
}
