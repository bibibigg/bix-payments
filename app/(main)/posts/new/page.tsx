"use client";

import { useCallback } from "react";
import PostForm from "@/components/posts/PostForm";
import { useCreateBoardMutation } from "@/lib/queries/boards";
import type { BoardRequest } from "@/types";

export default function NewPostPage() {
  const createMutation = useCreateBoardMutation();

  const handleSubmit = useCallback(
    (data: BoardRequest, file?: File) => createMutation.mutateAsync({ data, file }),
    [createMutation],
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="작성" />
    </div>
  );
}
