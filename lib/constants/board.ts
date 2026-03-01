import type { BoardCategory } from "@/types";

// 색상은 UI 전용 — API에서 내려오지 않으므로 유지
export const CATEGORY_COLOR: Record<BoardCategory, string> = {
  NOTICE: "bg-blue-100 text-blue-700",
  FREE:   "bg-green-100 text-green-700",
  QNA:    "bg-amber-100 text-amber-700",
  ETC:    "bg-gray-100 text-gray-600",
};
