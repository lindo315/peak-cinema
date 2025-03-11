
import React from "react";
import { Movie } from "@/lib/api";
import MovieGrid from "./MovieGrid";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  movies: Movie[];
  loading: boolean;
  error?: unknown;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  movies,
  loading,
  error,
  totalResults,
  currentPage,
  totalPages,
  onLoadMore,
}) => {
  return (
    <div className="space-y-6">
      {totalResults > 0 && (
        <div className="text-sm text-muted-foreground">
          Found {totalResults} results
        </div>
      )}

      <MovieGrid movies={movies} loading={loading} error={error} />

      {currentPage < totalPages && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px]"
            variant="outline"
          >
            {loading ? (
              <>
                <span className="mr-2">Loading</span>
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
