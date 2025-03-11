import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Movie, getBackdropUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Info, PlayCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  movie: Movie;
  loading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  movie,
  loading = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    if (!loading && movie) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % 5); // Assuming we have 5 slides
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [loading, movie]);

  if (loading || !movie) {
    return (
      <div className="w-full h-[85vh] bg-black/80 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  const formatScore = (score: number) => {
    return (score * 10).toFixed(1) + "%";
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-black/80 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}

      {/* Background Image */}
      <img
        src={getBackdropUrl(movie.backdrop_path, "original")}
        alt={movie.title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center p-6 sm:p-12">
        <div className="container mx-auto">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight uppercase">
              {movie.title}
            </h1>

            {/* Rating with stars */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold">
                {formatScore(movie.vote_average)}
              </span>
            </div>

            <p className="text-base sm:text-lg text-white/90 max-w-xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8"
              >
                <Link to={`/movie/${movie.id}`}>
                  <PlayCircle className="w-5 h-5" />
                  WATCH TRAILER
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 bg-black/40 backdrop-blur-sm border-white/20 text-white hover:text-primary rounded-full px-6"
              >
                <Link to={`/movie/${movie.id}`}>
                  <Info className="w-5 h-5" />
                  MORE INFO
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
