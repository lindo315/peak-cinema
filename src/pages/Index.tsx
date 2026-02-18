import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import MovieCarousel from "@/components/MovieCarousel";
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

  return (
    <Layout>
      <div className="pb-16 animate-fade-in">
        {/* Hero Section — rotates through up to 5 now-playing movies */}
        <HeroSection
          movies={nowPlayingMovies || []}
          loading={loadingNowPlaying}
        />

        {/* Now Playing */}
        <div className="container px-4 sm:px-6 mx-auto pt-12">
          <MovieCarousel
            title="Now Playing"
            movies={nowPlayingMovies || []}
            loading={loadingNowPlaying}
            viewAllLink="/movies/now-playing"
          />

          <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4" />

          {/* Popular Movies */}
          <MovieCarousel
            title="Popular Movies"
            movies={popularMovies || []}
            loading={loadingPopular}
            viewAllLink="/movies/popular"
          />

          <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4" />

          {/* Top Rated */}
          <MovieCarousel
            title="Top Rated"
            movies={topRatedMovies || []}
            loading={loadingTopRated}
            viewAllLink="/movies/top-rated"
          />

          <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4" />

          {/* Coming Soon */}
          <MovieCarousel
            title="Coming Soon"
            movies={upcomingMovies || []}
            loading={loadingUpcoming}
            viewAllLink="/movies/upcoming"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
