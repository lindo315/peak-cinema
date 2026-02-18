import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Movie, getBackdropUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Info, PlayCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  movies: Movie[];
  loading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  movies,
  loading = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const featured = movies.slice(0, 5);

  // Auto-advance carousel
  useEffect(() => {
    if (!loading && featured.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % featured.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [loading, featured.length]);

  // Reset image loaded state when slide changes
  useEffect(() => {
    setImageLoaded(false);
  }, [activeSlide]);

  const goTo = (index: number) => {
    setActiveSlide((index + featured.length) % featured.length);
  };

  if (loading || featured.length === 0) {
    return (
      <div className="w-full h-[85vh] bg-black/80 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  const movie = featured[activeSlide];

  // Star rating: vote_average is 0–10, map to 0–5 stars
  const starCount = Math.round(movie.vote_average / 2);
  const scoreLabel = (movie.vote_average * 10).toFixed(1) + "%";

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Slide images */}
      <AnimatePresence mode="sync">
        <motion.img
          key={movie.id}
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center p-6 sm:p-12">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight uppercase">
                {movie.title}
              </h1>

              {/* Star rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= starCount
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      )}
                    />
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold">
                  {scoreLabel}
                </span>
              </div>

              <p className="text-base sm:text-lg text-white/90 max-w-xl line-clamp-3">
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {featured.length > 1 && (
        <>
          <button
            onClick={() => goTo(activeSlide - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => goTo(activeSlide + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
