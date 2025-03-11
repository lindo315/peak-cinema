import React, { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import MovieCarousel from "@/components/MovieCarousel";
import Layout from "@/components/Layout";
import {
  Movie,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
} from "@/lib/api";

const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const popular = await getPopularMovies();
        const topRated = await getTopRatedMovies();
        const nowPlaying = await getNowPlayingMovies();

        console.log("Popular Movies:", popular);
        console.log("Top Rated Movies:", topRated);
        console.log("Now Playing Movies:", nowPlaying);

        setFeaturedMovies(popular.slice(0, 5));
        setTrendingMovies(topRated);
        setPopularMovies(popular);
        setNewReleases(nowPlaying);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen">
        {/* Hero Section - Now passing the array of featured movies */}
        <HeroSection movies={featuredMovies} loading={loading} />

        {/* Movie Sections */}
        <div className="container mx-auto px-4 sm:px-6 -mt-16 relative z-10">
          <MovieCarousel
            title="Trending Now"
            movies={trendingMovies}
            loading={loading}
            className="mb-8"
          />

          <MovieCarousel
            title="Popular"
            movies={popularMovies}
            loading={loading}
            className="mb-8"
          />

          <MovieCarousel
            title="New Releases"
            movies={newReleases}
            loading={loading}
            className="mb-8"
          />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
