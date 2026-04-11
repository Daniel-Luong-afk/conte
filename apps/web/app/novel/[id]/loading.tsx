export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex gap-8 mb-10">
        <div className="w-48 h-64 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
