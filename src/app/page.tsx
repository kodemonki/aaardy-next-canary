import { Suspense } from "react";
import { Beans } from "./ui/beans";
import SearchForm from "./ui/searchForm";
import Loading from "./ui/loading";

export const experimental_ppr = true;

export default async function Home({ searchParams }: { 
  searchParams: Promise<{ filterBy?: string; sortBy?: string; page?: string }> 
}) {
  const params = await searchParams;
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <SearchForm />
        <Suspense fallback={<Loading/>}>
          <Beans 
            filterBy={params.filterBy} 
            sortBy={params.sortBy} 
            page={params.page ? parseInt(params.page) : 1}
          />
        </Suspense>
      </main>
    </div>
  );
}
