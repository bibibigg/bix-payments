export default function PostDetailSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="pb-5 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-14 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-8 w-3/4 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="space-y-2 mb-8">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="h-9 w-24 rounded-xl bg-gray-200 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-16 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-9 w-16 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
