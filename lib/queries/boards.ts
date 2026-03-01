import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  getCategories,
} from "@/lib/api/posts";
import type { BoardCategory, BoardRequest } from "@/types";

export const boardKeys = {
  all: ["boards"] as const,
  list: (page: number) => ["boards", page] as const,
  allForFilter: ["boards", "all-for-filter"] as const,
  detail: (id: number) => ["board", id] as const,
};

const PAGE_SIZE = 10;

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity, // 카테고리는 세션 내 변경되지 않음 → 1회만 fetch
  });
}

export function useBoardsQuery(page: number, category?: BoardCategory) {
  const pagedQuery = useQuery({
    queryKey: boardKeys.list(page),
    queryFn: () => getBoards(page),
    enabled: !category,
    staleTime: 0,
  });

  // 카테고리 선택: 전체 fetch 후 select로 메모이제이션된 클라이언트 필터링
  const allQuery = useQuery({
    queryKey: boardKeys.allForFilter,
    queryFn: () => getBoards(0, 1000),
    enabled: !!category,
    staleTime: 60_000,
    select: category
      ? (data) => {
          const filtered = data.content.filter((p) => p.category === category);
          const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
          const start = page * PAGE_SIZE;
          const pageContent = filtered.slice(start, start + PAGE_SIZE);
          return {
            ...data,
            content: pageContent,
            totalPages,
            totalElements: filtered.length,
            numberOfElements: pageContent.length,
            number: page,
            first: page === 0,
            last: page >= totalPages - 1,
            empty: filtered.length === 0,
          };
        }
      : undefined,
  });

  if (!category) return pagedQuery;

  return {
    data: allQuery.data,
    isLoading: allQuery.isPending,
    error: allQuery.error,
  };
}

export function useBoardQuery(id: number) {
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: () => getBoard(id),
  });
}

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File }) =>
      createBoard(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

export function useUpdateBoardMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, file }: { data: BoardRequest; file?: File }) =>
      updateBoard(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(id) });
    },
  });
}

export function useDeleteBoardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBoard(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.removeQueries({ queryKey: boardKeys.detail(id) });
    },
  });
}
