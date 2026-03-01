export function PostTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="hidden sm:grid sm:grid-cols-[64px_112px_1fr_96px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="h-3.5 w-8 rounded bg-gray-200 animate-pulse" />
        <div className="h-3.5 w-14 rounded bg-gray-200 animate-pulse" />
        <div className="h-3.5 w-10 rounded bg-gray-200 animate-pulse" />
        <div className="h-3.5 w-12 rounded bg-gray-200 animate-pulse ml-auto" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={[
            "grid grid-cols-[auto_1fr_auto]",
            "sm:grid-cols-[64px_112px_1fr_96px] sm:gap-4",
            "gap-x-3 px-5 py-3.5 border-b border-gray-100 last:border-b-0 items-center",
          ].join(" ")}
        >
          <div className="hidden sm:block h-4 w-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <>
      <div className="flex gap-1.5 pb-2 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-16 rounded-full bg-gray-200 animate-pulse shrink-0"
          />
        ))}
      </div>
      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-3" />
      <PostTableSkeleton />
    </>
  );
}
