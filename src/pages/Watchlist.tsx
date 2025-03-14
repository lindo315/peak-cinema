import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/lib/api";
import { BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Watchlist = () => {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load watchlist from localStorage
    const loadWatchlist = () => {
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      setWatchlistMovies(watchlist);
      setLoading(false);
    };

    loadWatchlist();
  }, []);

  // Clear watchlist
  const handleClearWatchlist = () => {
    localStorage.setItem("watchlist", "[]");
    setWatchlistMovies([]);
    toast({
      title: "Watchlist cleared",
      description: "Your watchlist has been cleared successfully",
    });
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = (movieId: number) => {
    const updatedWatchlist = watchlistMovies.filter(
      (movie) => movie.id !== movieId
    );
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    setWatchlistMovies(updatedWatchlist);
    toast({
      title: "Removed from watchlist",
      description: "The movie has been removed from your watchlist",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 mt-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Watchlist</h1>

          {watchlistMovies.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWatchlist}
              className="bg-red-500"
            >
              Clear Watchlist
            </Button>
          )}
        </div>

        {watchlistMovies.length > 0 ? (
          <MovieGrid movies={watchlistMovies} loading={loading} />
        ) : (
          <div className="text-center py-16">
            <BookmarkX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-medium mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Add movies to your watchlist to keep track of what you want to
              watch
            </p>
            <Button asChild>
              <a href="/">Discover Movies</a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Watchlist;
