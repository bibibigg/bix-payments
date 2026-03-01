export default function EditPostSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-8 w-24 rounded bg-gray-200 animate-pulse mb-6" />
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
