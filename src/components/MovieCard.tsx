import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Movie, getPosterUrl } from "@/lib/api";
import { PlayCircle, Star, Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  size?: "small" | "medium" | "large";
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  className,
  size = "medium",
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format release date
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // Format rating
  const formatRating = (rating: number) => {
    return (rating * 10).toFixed(0);
  };

  // Select poster size based on card size
  const posterSize =
    size === "small" ? "w154" : size === "large" ? "w342" : "w185";

  // Define size classes
  const sizeClasses = {
    small: "w-32 sm:w-36",
    medium: "w-40 sm:w-48",
    large: "w-56 sm:w-64",
  };

  // Genre mapping
  const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  // Get primary genre
  const getPrimaryGenre = () => {
    if (!movie.genre_ids || movie.genre_ids.length === 0) return "";
    return genreMap[movie.genre_ids[0]] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        "group relative flex flex-col",
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 mb-3 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
        {/* Poster Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          </div>
        )}

        {/* Poster Image */}
        <img
          src={getPosterUrl(movie.poster_path, posterSize)}
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100" : "opacity-0",
            isHovered ? "scale-110 brightness-110 filter blur-sm" : ""
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-full p-1.5 text-xs font-bold z-10">
            <div className="flex items-center">
              <Star className="w-3 h-3 text-indigo-400 fill-indigo-400 mr-0.5" />
              <span className="text-white">
                {formatRating(movie.vote_average)}%
              </span>
            </div>
          </div>
        )}

        {/* Year Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-white z-10">
          {formatDate(movie.release_date)}
        </div>

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-center gap-3 p-4 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        >
          {/* Play Button */}
          <Link
            to={`/movie/${movie.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transform transition-all duration-300 hover:scale-110 shadow-lg shadow-indigo-700/30"
          >
            <PlayCircle className="w-8 h-8" />
          </Link>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/80 text-white transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
            >
              Details
            </Link>
          </div>

          {/* Mini Info */}
          {size !== "small" && (
            <div className="w-full mt-2">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Title and Info */}
      <div className="flex flex-col">
        <Link
          to={`/movie/${movie.id}`}
          className="text-white font-medium text-sm line-clamp-1 hover:text-indigo-400 transition-colors"
        >
          {movie.title}
        </Link>

        <div className="flex items-center justify-between mt-1 text-xs text-zinc-500">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(movie.release_date)}
          </span>
          {getPrimaryGenre() && (
            <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
              {getPrimaryGenre()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
