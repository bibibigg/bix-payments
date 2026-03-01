"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDeleteBoardMutation } from "@/lib/queries/boards";
import Button from "@/components/ui/Button";

interface PostDetailActionsProps {
  id: number;
}

export default function PostDetailActions({ id }: PostDetailActionsProps) {
  const router = useRouter();
  const deleteMutation = useDeleteBoardMutation();
  const [deleteError, setDeleteError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "삭제에 실패했습니다");
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      {deleteError && (
        <p role="alert" className="text-sm text-red-600 mb-3">
          {deleteError}
        </p>
      )}

      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="secondary">목록으로</Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/posts/${id}/edit`}>
            <Button variant="secondary">수정</Button>
          </Link>

          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-medium whitespace-nowrap">
                정말 삭제할까요?
              </span>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-sm px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {deleteMutation.isPending ? "삭제 중..." : "확인"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                취소
              </button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              삭제
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
