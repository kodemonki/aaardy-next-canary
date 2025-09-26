
export default function Loading() {
  return (
    <div className="w-full p-4 border rounded-lg bg-gray-50">
      {/* Header section with same structure as Beans component */}
      <div className="mb-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
      
      {/* Grid of loading skeletons matching Beans layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-3 border rounded-lg bg-white shadow-sm">
            <div className="flex items-start gap-3">
              {/* Color circle skeleton */}
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                {/* Flavor name skeleton */}
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                {/* Description skeleton */}
                <div className="space-y-1 mb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
                {/* Tags skeleton */}
                <div className="flex flex-wrap gap-1">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-14 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6 p-4 border-t">
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
