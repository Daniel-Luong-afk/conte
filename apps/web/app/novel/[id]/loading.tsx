export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sm:p-8 mb-6">
        <div className="flex gap-6">
          <div className="w-36 h-52 bg-gray-800 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-7 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
            <div className="flex gap-2 mt-2">
              <div className="h-6 bg-gray-800 rounded-full w-16" />
              <div className="h-6 bg-gray-800 rounded-full w-20" />
            </div>
            <div className="h-16 bg-gray-800 rounded mt-2" />
          </div>
        </div>
      </div>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 border-b border-gray-800 bg-gray-900" />
        ))}
      </div>
    </div>
  );
}
