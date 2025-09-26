"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { groupName } from "../lib/data";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterBy, setFilterBy] = useState(searchParams.get('filterBy') || "");
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new URLSearchParams
    const params = new URLSearchParams();
    if (filterBy) params.set('filterBy', filterBy);
    if (sortBy) params.set('sortBy', sortBy);
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Update URL with new search params
    router.push(`/?${params.toString()}`);
  };

  return (
    <section>
      <form onSubmit={handleSubmit} role="search" aria-label="Filter and sort jelly beans" className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex items-center gap-2">
          <span>Filter By:</span>
          <select 
            id="filter-select"
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-2 py-1 border rounded"
            aria-describedby="filter-help"
          >
            <option value="">All Groups</option>
            {groupName.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
        <span id="filter-help" className="sr-only">Filter beans by flavor group</span>
        <label className="flex items-center gap-2">
          <span>Sort By:</span>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border rounded"
            aria-describedby="sort-help"
          >
            <option value="">Default Order</option>
            <option value={"name"}>Name</option>
            <option value={"flavor group"}>Flavor Group</option>
            <option value={"sugar-free status"}>Sugar-Free Status</option>
          </select>
        </label>
        <span id="sort-help" className="sr-only">Sort beans by name, flavor group, or dietary options</span>
        <button 
          type="submit"
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          aria-label="Apply selected filters and sorting options"
        >
          Apply Filters
        </button>
        <button 
          type="button" 
          onClick={() => {
            setFilterBy("");
            setSortBy("");
            router.push("/");
          }}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </form>
    </section>
  );
}
