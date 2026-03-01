import type {
  BoardPage,
  BoardDetail,
  BoardRequest,
  CategoryMap,
} from "@/types";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const isDev = process.env.NODE_ENV === "development";

function logTiming(label: string, ms: number) {
  if (isDev) console.log(`[posts] ${label}: ${ms.toFixed(1)}ms`);
}

export async function getBoards(page = 0, size = 10): Promise<BoardPage> {
  const t = performance.now();
  const res = await fetchWithAuth(
    `${API_BASE}/boards?page=${page}&size=${size}&sort=createdAt,desc`
  );
  logTiming(`getBoards(page=${page})`, performance.now() - t);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "게시글 목록 조회에 실패했습니다");
  }

  return res.json();
}

export async function getBoard(id: number): Promise<BoardDetail> {
  const t = performance.now();
  const res = await fetchWithAuth(`${API_BASE}/boards/${id}`);
  logTiming(`getBoard(${id})`, performance.now() - t);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "게시글 조회에 실패했습니다");
  }

  return res.json();
}

export async function createBoard(
  data: BoardRequest,
  file?: File
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) formData.append("file", file);

  const res = await fetchWithAuth(`${API_BASE}/boards`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "게시글 작성에 실패했습니다");
  }
}

export async function updateBoard(
  id: number,
  data: BoardRequest,
  file?: File
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) formData.append("file", file);

  const res = await fetchWithAuth(`${API_BASE}/boards/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "게시글 수정에 실패했습니다");
  }
}

export async function deleteBoard(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/boards/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "게시글 삭제에 실패했습니다");
  }
}

export async function getCategories(): Promise<CategoryMap> {
  const res = await fetchWithAuth(`${API_BASE}/boards/categories`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "카테고리 조회에 실패했습니다");
  }

  return res.json();
}
