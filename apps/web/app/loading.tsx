export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-32 mb-3" />
      <div className="h-4 bg-gray-800 rounded w-48 mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] bg-gray-800 rounded-xl mb-2" />
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
            <div className="h-3 bg-gray-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
