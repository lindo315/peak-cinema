import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

interface WatchlistContextType {
  watchlist: Movie[];
  isInWatchlist: (movieId: number) => boolean;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const { user } = useAuth();

  // Load watchlist from localStorage on component mount or when user changes
  useEffect(() => {
    const loadWatchlist = () => {
      if (user) {
        const storedWatchlist = localStorage.getItem("cineverse_watchlist");
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist));
        } else {
          setWatchlist([]);
        }
      } else {
        // Clear watchlist when user is logged out
        setWatchlist([]);
      }
    };

    loadWatchlist();
  }, [user]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("cineverse_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, user]);

  const isInWatchlist = (movieId: number): boolean => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const addToWatchlist = (movie: Movie) => {
    if (!user) {
      toast.error("Please log in to add movies to your watchlist");
      return;
    }

    if (isInWatchlist(movie.id)) {
      toast.info("This movie is already in your watchlist");
      return;
    }

    setWatchlist((prevWatchlist) => [...prevWatchlist, movie]);
    toast.success(`${movie.title} added to your watchlist`);
  };

  const removeFromWatchlist = (movieId: number) => {
    if (!user) return;

    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== movieId)
    );
    toast.success("Movie removed from your watchlist");
  };

  const clearWatchlist = () => {
    if (!user) return;

    setWatchlist([]);
    toast.success("Your watchlist has been cleared");
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
export default WatchlistContext;
