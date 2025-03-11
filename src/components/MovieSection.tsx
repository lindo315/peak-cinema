
import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/lib/api";
import MovieGrid from "./MovieGrid";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  error?: unknown;
  viewAllLink?: string;
  cardSize?: "small" | "medium" | "large";
  className?: string;
}

const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  loading = false,
  error = null,
  viewAllLink,
  cardSize = "medium",
  className,
}) => {
  return (
    <section className={cn("py-10", className)}>
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-balance">{title}</h2>
          
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          cardSize={cardSize}
        />
      </div>
    </section>
  );
};

export default MovieSection;
