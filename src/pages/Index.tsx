import React from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/lib/api";

const Index = () => {
  const { data: popularMovies, isLoading: loadingPopular } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
  });

  const { data: topRatedMovies, isLoading: loadingTopRated } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRatedMovies,
  });

  const { data: nowPlayingMovies, isLoading: loadingNowPlaying } = useQuery({
    queryKey: ["nowPlayingMovies"],
    queryFn: getNowPlayingMovies,
  });

  const { data: upcomingMovies, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: getUpcomingMovies,
  });

  // Get a featured movie for the hero section
  const featuredMovie = nowPlayingMovies?.[0];

  return (
    <Layout>
      <div className="pb-16 animate-fade-in">
        {/* Hero Section */}
        <HeroSection movie={featuredMovie} loading={loadingNowPlaying} />

        {/* Now Playing Movies */}
        <MovieSection
          title="Now Playing"
          movies={nowPlayingMovies || []}
          loading={loadingNowPlaying}
          viewAllLink="/movies/now-playing"
          className="pt-16"
        />

        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4"></div>

        {/* Popular Movies */}
        <MovieSection
          title="Popular Movies"
          movies={popularMovies || []}
          loading={loadingPopular}
          viewAllLink="/movies/popular"
        />

        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4"></div>

        {/* Top Rated Movies */}
        <MovieSection
          title="Top Rated"
          movies={topRatedMovies || []}
          loading={loadingTopRated}
          viewAllLink="/movies/top-rated"
        />

        <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4"></div>

        {/* Upcoming Movies */}
        <MovieSection
          title="Coming Soon"
          movies={upcomingMovies || []}
          loading={loadingUpcoming}
          viewAllLink="/movies/upcoming"
        />
      </div>
    </Layout>
  );
};

export default Index;
