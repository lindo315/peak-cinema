
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SearchResults from "@/components/SearchResults";
import { searchMovies, Movie, getGenres, Genre } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const yearParam = searchParams.get("year") || "";
  const sortParam = searchParams.get("sort") || "popularity.desc";
  
  const [query, setQuery] = useState(queryParam);
  const [year, setYear] = useState(yearParam);
  const [sort, setSort] = useState<"popularity.desc" | "vote_average.desc" | "release_date.desc">(
    sortParam as any || "popularity.desc"
  );
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch genres
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  // Search movies
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["searchMovies", query, year, sort, page],
    queryFn: () => searchMovies(
      query, 
      page, 
      year ? parseInt(year) : undefined, 
      sort
    ),
    enabled: query.length > 0,
  });

  // Update movies when data changes
  React.useEffect(() => {
    if (data?.results && page === 1) {
      setAllMovies(data.results);
    } else if (data?.results) {
      setAllMovies((prev) => [...prev, ...data.results]);
    }
  }, [data, page]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL
    setSearchParams({
      query,
      ...(year && { year }),
      ...(sort && { sort }),
    });
    
    // Reset page
    setPage(1);
    
    // Close filters on mobile
    setFiltersOpen(false);
    
    // Refetch
    refetch();
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setYear("");
    setSort("popularity.desc");
    
    // Update URL
    setSearchParams({
      query,
    });
    
    // Reset page
    setPage(1);
    
    // Close filters on mobile
    setFiltersOpen(false);
    
    // Refetch
    refetch();
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Search Movies</h1>

          {/* Search Bar */}
          <div className="flex justify-between gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={!query || isLoading}>
                Search
              </Button>
            </form>

            {/* Filters Button (Mobile) */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Apply filters to your search results
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Year Filter */}
                  <div className="space-y-2">
                    <label htmlFor="year-mobile" className="text-sm font-medium">
                      Year
                    </label>
                    <Select
                      value={year}
                      onValueChange={(value) => setYear(value)}
                    >
                      <SelectTrigger id="year-mobile">
                        <SelectValue placeholder="All years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All years</SelectItem>
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-2">
                    <label htmlFor="sort-mobile" className="text-sm font-medium">
                      Sort By
                    </label>
                    <Select
                      value={sort}
                      onValueChange={(value: any) => setSort(value)}
                    >
                      <SelectTrigger id="sort-mobile">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity.desc">Popularity</SelectItem>
                        <SelectItem value="vote_average.desc">Rating</SelectItem>
                        <SelectItem value="release_date.desc">Release Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <SheetFooter className="mt-8">
                  <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                    <Button onClick={handleSearch}>Apply Filters</Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Filters (Desktop) */}
          <div className="hidden md:flex flex-wrap gap-6 mb-8">
            {/* Year Filter */}
            <div className="space-y-1">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <Select
                value={year}
                onValueChange={(value) => {
                  setYear(value);
                  setPage(1);
                  setSearchParams({
                    query,
                    ...(value && { year: value }),
                    ...(sort && { sort }),
                  });
                  refetch();
                }}
              >
                <SelectTrigger id="year" className="w-36">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All years</SelectItem>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-1">
              <label htmlFor="sort" className="text-sm font-medium">
                Sort By
              </label>
              <Select
                value={sort}
                onValueChange={(value: any) => {
                  setSort(value);
                  setPage(1);
                  setSearchParams({
                    query,
                    ...(year && { year }),
                    sort: value,
                  });
                  refetch();
                }}
              >
                <SelectTrigger id="sort" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity.desc">Popularity</SelectItem>
                  <SelectItem value="vote_average.desc">Rating</SelectItem>
                  <SelectItem value="release_date.desc">Release Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(year || sort !== "popularity.desc") && (
              <Button
                variant="ghost"
                size="sm"
                className="self-end"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters (Mobile) */}
          <div className="md:hidden mb-6">
            {(year || sort !== "popularity.desc") && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Filters:</span>
                
                {year && (
                  <div className="px-2 py-1 text-xs rounded-full bg-secondary flex items-center gap-1">
                    <span>Year: {year}</span>
                    <button
                      onClick={() => {
                        setYear("");
                        setSearchParams({
                          query,
                          ...(sort !== "popularity.desc" && { sort }),
                        });
                        refetch();
                      }}
                      aria-label="Remove year filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {sort !== "popularity.desc" && (
                  <div className="px-2 py-1 text-xs rounded-full bg-secondary flex items-center gap-1">
                    <span>
                      Sort: {
                        sort === "vote_average.desc" 
                          ? "Rating" 
                          : sort === "release_date.desc" 
                            ? "Release Date" 
                            : "Popularity"
                      }
                    </span>
                    <button
                      onClick={() => {
                        setSort("popularity.desc");
                        setSearchParams({
                          query,
                          ...(year && { year }),
                        });
                        refetch();
                      }}
                      aria-label="Remove sort filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {query ? (
            <SearchResults
              movies={allMovies}
              loading={isLoading}
              error={error}
              totalResults={data?.total_results || 0}
              currentPage={page}
              totalPages={data?.total_pages || 0}
              onLoadMore={handleLoadMore}
            />
          ) : (
            <div className="text-center py-16">
              <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">Search for movies</h2>
              <p className="text-muted-foreground">
                Enter a movie title, actor, or keyword in the search box above
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
