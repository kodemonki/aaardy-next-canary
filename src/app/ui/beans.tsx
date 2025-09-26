import { fetchBeanData, BeansResponse } from "../actions";
import ImageWithFallback from "./imageWithFallback";

export const experimental_ppr = true;

export async function Beans({ filterBy, sortBy, page = 1 }: { filterBy?: string; sortBy?: string; page?: number }) {
  try {
    const beansData: BeansResponse = await fetchBeanData();
    
    // Filter beans based on filterBy prop
    let filteredBeans = beansData.items;
    if (filterBy && filterBy !== "") {
      filteredBeans = beansData.items.filter(bean => 
        bean.groupName.some(group => 
          group.toLowerCase().includes(filterBy.toLowerCase())
        )
      );
    }
    
    // Sort beans based on sortBy prop
    if (sortBy && sortBy !== "") {
      filteredBeans = [...filteredBeans].sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.flavorName.localeCompare(b.flavorName);
          case "flavor group":
            return a.groupName[0]?.localeCompare(b.groupName[0] || "") || 0;
          case "sugar-free status":
            return b.sugarFree === a.sugarFree ? 0 : b.sugarFree ? 1 : -1;
          default:
            return 0;
        }
      });
    }
    
    // Pagination logic
    const beansPerPage = 6;
    const totalPages = Math.ceil(filteredBeans.length / beansPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * beansPerPage;
    const endIndex = startIndex + beansPerPage;
    
    // Get beans for current page
    const displayBeans = filteredBeans.slice(startIndex, endIndex);
    
    return (
      <div className="w-full p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">
          Jelly Belly Beans
          {filterBy && <span className="text-base font-normal text-gray-600 ml-2">- Filtered by: {filterBy}</span>}
          {sortBy && <span className="text-base font-normal text-gray-600 ml-2">- Sorted by: {sortBy}</span>}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredBeans.length)} of {filteredBeans.length} beans
          {filterBy && ` (${beansData.totalCount} total available)`}
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayBeans.map((bean) => (
            <div key={bean.beanId} className="p-3 border rounded-lg bg-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <ImageWithFallback 
                    src={bean.imageUrl} 
                    alt={`${bean.flavorName} jelly bean`}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                    fallbackColor={bean.backgroundColor}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{bean.flavorName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{bean.description}</p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {bean.glutenFree && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Gluten Free</span>}
                    {bean.sugarFree && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Sugar Free</span>}
                    {bean.kosher && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Kosher</span>}
                    {bean.seasonal && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Seasonal</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 p-4 border-t">
            {/* Previous Button */}
            {currentPage > 1 && (
              <a
                href={`/?${new URLSearchParams({
                  ...(filterBy && { filterBy }),
                  ...(sortBy && { sortBy }),
                  page: (currentPage - 1).toString()
                }).toString()}`}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Previous
              </a>
            )}
            
            {/* Page Numbers */}
            {(() => {
              const maxVisible = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const endPage = Math.min(totalPages, startPage + maxVisible - 1);
              
              // Adjust start if we're near the end
              if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }
              
              const pages = [];
              
              // Add first page and ellipsis if needed
              if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                  pages.push('...');
                }
              }
              
              // Add visible page range
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }
              
              // Add ellipsis and last page if needed
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push('...');
                }
                pages.push(totalPages);
              }
              
              return pages.map((pageItem, index) => {
                if (pageItem === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 py-2">
                      ...
                    </span>
                  );
                }
                
                const pageNum = pageItem as number;
                return (
                  <a
                    key={pageNum}
                    href={`/?${new URLSearchParams({
                      ...(filterBy && { filterBy }),
                      ...(sortBy && { sortBy }),
                      page: pageNum.toString()
                    }).toString()}`}
                    className={`px-3 py-2 rounded ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              });
            })()}
            
            {/* Next Button */}
            {currentPage < totalPages && (
              <a
                href={`/?${new URLSearchParams({
                  ...(filterBy && { filterBy }),
                  ...(sortBy && { sortBy }),
                  page: (currentPage + 1).toString()
                }).toString()}`}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-800">
        <p>Error loading beans data: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}