"use client";

const WINDOW = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.min(
    Math.max(0, currentPage - Math.floor(WINDOW / 2)),
    Math.max(0, totalPages - WINDOW)
  );
  const pages = Array.from(
    { length: Math.min(WINDOW, totalPages) },
    (_, i) => start + i
  );

  // 공통 베이스 (transition-colors 제외 — 페이지 번호 버튼 active↔inactive 전환 시 깜빡임 방지)
  const btnBase =
    "min-w-[36px] h-9 px-2.5 inline-flex items-center justify-center rounded-lg text-sm border cursor-pointer select-none";

  // 이전/다음/처음/끝 버튼
  const btnNav = `${btnBase} bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200`;

  return (
    <nav
      className="flex justify-center items-center gap-1 mt-7"
      aria-label="페이지 네비게이션"
    >
      {/* 첫 페이지 */}
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className={btnNav}
        aria-label="첫 페이지"
      >
        «
      </button>

      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={btnNav}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {/* 페이지 번호 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-label={`${page + 1}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`${btnBase} ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={btnNav}
        aria-label="다음 페이지"
      >
        ›
      </button>

      {/* 마지막 페이지 */}
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className={btnNav}
        aria-label="마지막 페이지"
      >
        »
      </button>
    </nav>
  );
}
