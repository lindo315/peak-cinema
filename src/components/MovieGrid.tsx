import React, { useState, useEffect } from "react";
import { Movie } from "@/lib/api";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Star,
  Clock,
  Grid,
  LayoutGrid,
  SlidersHorizontal,
  X,
} from "lucide-react";
import MovieCard from "./MovieCard";
import { motion, AnimatePresence } from "framer-motion";

interface MovieGridProps {
  title?: string;
  subtitle?: string;
  movies: Movie[];
  loading?: boolean;
  error?: unknown;
  className?: string;
  cardSize?: "small" | "medium" | "large";
  showFilters?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  title,
  subtitle,
  movies,
  loading = false,
  error = null,
  className,
  cardSize = "medium",
  showFilters = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "topRated">(
    "trending"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const itemsPerPage =
    viewMode === "list"
      ? 10
      : cardSize === "small"
      ? 24
      : cardSize === "large"
      ? 12
      : 18;

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedGenres]);

  // Simulating genres data (would come from API)
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
  ];

  // Filter movies by selected genres
  const filteredMovies = movies.filter((movie) => {
    if (selectedGenres.length === 0) return true;
    return movie.genre_ids.some((id) =>
      selectedGenres.includes(genres.find((g) => g.id === id)?.name || "")
    );
  });

  // Sort movies based on criteria
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    } else if (sortBy === "topRated") {
      return b.vote_average - a.vote_average;
    } else {
      // Default: trending/popularity
      return b.popularity - a.popularity;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-black/40 rounded-xl backdrop-blur-sm">
        <div className="text-red-500 mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Unable to Load Movies
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          We encountered a problem while loading content. Please try again
          later.
        </p>
        <Button
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-gray-800 rounded-md animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
            className
          )}
        >
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-800 rounded-md animate-pulse"></div>
              <div className="h-3 w-1/2 bg-gray-800 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (sortedMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-black/40 rounded-xl backdrop-blur-sm">
        <div className="text-gray-500 mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Movies Found
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          It looks like there are no movies matching your current filters.
        </p>
        {selectedGenres.length > 0 && (
          <Button
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
            onClick={() => setSelectedGenres([])}
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with title and sorting options */}
      <div className="flex flex-col space-y-4">
        {/* Title section */}
        {(title || subtitle) && (
          <div className="flex flex-col">
            {title && (
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
          </div>
        )}

        {/* Controls section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Sort options */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={sortBy === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("trending")}
              className={cn(
                "rounded-full font-medium",
                sortBy !== "trending" &&
                  "bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-white/80 text-white"
              )}
            >
              <Flame className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("newest")}
              className={cn(
                "rounded-full font-medium",
                sortBy !== "newest" &&
                  "bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-white/80 text-white"
              )}
            >
              <Clock className="w-4 h-4 mr-2" />
              Newest
            </Button>
            <Button
              variant={sortBy === "topRated" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("topRated")}
              className={cn(
                "rounded-full font-medium",
                sortBy !== "topRated" &&
                  "bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-white/80 text-white"
              )}
            >
              <Star className="w-4 h-4 mr-2" />
              Top Rated
            </Button>
          </div>

          {/* View and filter controls */}
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-full p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Filter button */}
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={cn(
                  "rounded-full font-medium",
                  "bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-white/80 text-white",
                  filtersOpen &&
                    "bg-primary text-white hover:border-indigo-600 text-white"
                )}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {selectedGenres.length > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                    {selectedGenres.length}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Filter by Genre</h3>
                {selectedGenres.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGenres([])}
                    className="text-gray-400 hover:border-indigo-600 text-white text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.name)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all duration-200",
                      selectedGenres.includes(genre.name)
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50"
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {selectedGenres.map((genre) => (
            <div
              key={genre}
              className="flex items-center bg-indigo-600/20 text-indigo-400 text-sm rounded-full px-3 py-1"
            >
              {genre}
              <button
                onClick={() => toggleGenre(genre)}
                className="ml-2 text-indigo-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Movie grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "grid" ? (
            <div
              className={cn(
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
                className
              )}
            >
              {currentMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  size={cardSize}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {currentMovies.map((movie, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={movie.id}
                  className="flex gap-4 bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/40 transition-all duration-300"
                >
                  <div className="w-24 sm:w-32 md:w-40 shrink-0">
                    <img
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-4 pr-4 flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-medium line-clamp-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center text-xs">
                        <Star className="w-3 h-3 text-indigo-400 fill-indigo-400 mr-1" />
                        <span>{(movie.vote_average * 10).toFixed(0)}%</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {movie.overview}
                    </p>
                    <div className="flex mt-auto gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                      >
                        <a href={`/movie/${movie.id}`}>Watch Now</a>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-full border-gray-700 bg-black/40 text-white hover:bg-white/80"
                      >
                        <a href={`/movie/${movie.id}`}>Details</a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/60 text-white w-10 h-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {/* Generate pagination buttons */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <Button
                  key={idx}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "rounded-full min-w-10 h-10",
                    currentPage !== pageNum &&
                      "bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/60 text-white"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Show ellipsis and last page if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(totalPages)}
                  className="rounded-full min-w-10 h-10 bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/60 text-white"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full bg-black/40 backdrop-blur-sm border-gray-800 hover:bg-black/60 text-white w-10 h-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
