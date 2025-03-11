import React, { useState, useRef } from "react";
import { Movie } from "@/lib/api";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  error?: unknown;
  className?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  loading = false,
  error = null,
  className,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  React.useEffect(() => {
    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className={cn("py-6", className)}>
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 aspect-[2/3] rounded-lg bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className={cn("py-6 relative", className)}>
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

      {/* Left arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 rounded-full p-2 text-white hover:bg-black/90"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Movie cards */}
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 pl-2 pr-2"
        onScroll={handleScroll}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            size="medium"
            className="flex-shrink-0"
          />
        ))}
      </div>

      {/* Right arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 rounded-full p-2 text-white hover:bg-black/90"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MovieCarousel;
