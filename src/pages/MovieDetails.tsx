import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
} from "@/lib/api";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Star,
  Heart,
  PlayCircle,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Award,
  DollarSign,
  Ticket,
  Sparkles,
  FilmIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    // Check if movie is in watchlist
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setInWatchlist(
      watchlist.some((item: { id: number }) => item.id === Number(id))
    );

    // Scroll to top when movie changes
    window.scrollTo(0, 0);
  }, [id]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

    if (inWatchlist) {
      const newWatchlist = watchlist.filter(
        (item: { id: number }) => item.id !== Number(id)
      );
      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
      setInWatchlist(false);
      toast({
        title: "Removed from watchlist",
        description: `${movie?.title} has been removed from your watchlist`,
        variant: "default",
      });
    } else {
      if (movie) {
        watchlist.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        });
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        setInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${movie?.title} has been added to your watchlist`,
          variant: "default",
        });
      }
    }
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format year only
  const formatYear = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // Calculate profit and ROI
  const calculateProfit = () => {
    if (!movie || !movie.budget || !movie.revenue) return null;
    return movie.revenue - movie.budget;
  };

  const calculateROI = () => {
    if (!movie || !movie.budget || !movie.revenue || movie.budget === 0)
      return null;
    return ((movie.revenue - movie.budget) / movie.budget) * 100;
  };

  const profit = calculateProfit();
  const roi = calculateROI();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">
              Loading movie details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <p className="text-muted-foreground mb-8">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Find the trailer
  const trailer = movie.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // Get all trailers
  const trailers =
    movie.videos?.results.filter(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    ) || [];

  // Get directors
  const directors = movie.credits?.crew.filter(
    (crew) => crew.job === "Director"
  );

  // Get writers
  const writers = movie.credits?.crew.filter(
    (crew) => crew.department === "Writing"
  );

  // Get producers
  const producers = movie.credits?.crew.filter(
    (crew) => crew.job === "Producer"
  );

  // Get cinematographers
  const cinematographers = movie.credits?.crew.filter(
    (crew) => crew.job === "Director of Photography"
  );

  // Get cast sorted by order
  const cast = movie.credits?.cast.sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div className="animate-fade-in pb-16">
        {/* Backdrop with Parallax Effect */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          {/* Back button */}
          <div className="absolute top-20 left-6 z-10">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-black/60 hover:border-primary/30 hover:text-primary transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Background image with parallax effect */}
          <img
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative -mt-40 sm:-mt-56 md:-mt-64 z-10 flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-48 sm:w-64 md:w-72 h-auto mx-auto md:mx-0 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <motion.img
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={getPosterUrl(movie.poster_path, "original")}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>

            {/* Info */}
            <div className="flex-1 md:pt-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Title and year */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance flex items-center gap-2">
                  {movie.title}
                  <span className="text-muted-foreground text-2xl sm:text-3xl font-normal">
                    ({formatYear(movie.release_date)})
                  </span>
                </h1>

                {/* Tagline */}
                {movie.tagline && (
                  <p className="mt-2 text-lg italic text-white/80">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Meta */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-white/80" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-white/80" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                      {movie.vote_count && (
                        <span className="text-white/80">
                          ({movie.vote_count.toLocaleString()} votes)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <div
                        key={genre.id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium transition-colors hover:bg-primary/20"
                      >
                        {genre.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {trailer && (
                    <Button
                      asChild
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      <a
                        href={`https://www.youtube.com/watch?v=${trailer.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PlayCircle className="h-5 w-5" />
                        Watch Trailer
                      </a>
                    </Button>
                  )}

                  <Button
                    variant={inWatchlist ? "default" : "outline"}
                    className={
                      inWatchlist
                        ? "gap-2 bg-primary text-white hover:bg-white hover:text-primary"
                        : "gap-2 backdrop-blur-sm bg-black border-primary text-white hover:text-primary"
                    }
                    onClick={toggleWatchlist}
                  >
                    <Bookmark
                      className={cn("h-5 w-5", inWatchlist && "fill-current")}
                    />
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2 bg-black border-primary text-white hover:text-primary"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>

                {/* Short overview */}
                <div className="mt-8 max-w-3xl text-balance">
                  <p className="text-lg leading-relaxed">{movie.overview}</p>
                </div>

                {/* Director info */}
                {directors && directors.length > 0 && (
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Directed by{" "}
                      <span className="text-primary font-semibold italic">
                        {directors.map((d) => d.name).join(", ")}
                      </span>
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4"></div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6">
                  <TabsList className="h-14 bg-transparent flex w-full max-w-3xl mx-auto justify-between">
                    <TabsTrigger
                      value="overview"
                      className="flex-1 px-4 py-2 text-white font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-black/40 hover:bg-black/30 hover:text-primary/90"
                    >
                      <FilmIcon className="h-4 w-4 mr-2 inline-block" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="cast"
                      className="flex-1 px-4 py-2 text-white font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-black/40 hover:bg-black/30 hover:text-primary/90"
                    >
                      <User className="h-4 w-4 mr-2 inline-block" />
                      Cast
                    </TabsTrigger>
                    {/* <TabsTrigger
                      value="media"
                      className="flex-1 px-4 py-2 text-white font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-black/40 hover:bg-black/30 hover:text-primary/90"
                    >
                      <PlayCircle className="h-4 w-4 mr-2 inline-block" />
                      Media
                    </TabsTrigger> */}
                    <TabsTrigger
                      value="similar"
                      className="flex-1 px-4 py-2 text-white font-medium rounded-t-lg border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-black/40 hover:bg-black/30 hover:text-primary/90"
                    >
                      <Sparkles className="h-4 w-4 mr-2 inline-block" />
                      Similar Movies
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="container mx-auto px-4 sm:px-6 py-8">
                <TabsContent
                  value="overview"
                  className="animate-fade-up mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center mb-6">
                      <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold">Overview</h2>
                    </div>

                    <div className="rounded-xl bg-black/30 backdrop-blur-sm border border-gray-800/50 p-6 mb-10">
                      <p className="text-lg leading-relaxed">
                        {movie.overview}
                      </p>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      {/* Left Column */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40 p-6">
                        <h3 className="text-xl font-semibold mb-6 flex items-center">
                          <Award className="h-5 w-5 text-primary mr-2" />
                          Movie Details
                        </h3>
                        <div className="space-y-5 divide-y divide-gray-800/40">
                          {directors && directors.length > 0 && (
                            <div className="pt-5 first:pt-0">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Director
                                </span>
                                <span className="font-medium">
                                  {directors.map((d) => d.name).join(", ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {writers && writers.length > 0 && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Writers
                                </span>
                                <span className="font-medium">
                                  {writers.map((w) => w.name).join(", ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {producers && producers.length > 0 && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Producers
                                </span>
                                <span className="font-medium">
                                  {producers.map((p) => p.name).join(", ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {cinematographers && cinematographers.length > 0 && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Cinematography
                                </span>
                                <span className="font-medium">
                                  {cinematographers
                                    .map((c) => c.name)
                                    .join(", ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {movie.status && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Status
                                </span>
                                <span className="font-medium">
                                  {movie.status}
                                </span>
                              </div>
                            </div>
                          )}

                          {movie.release_date && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Release Date
                                </span>
                                <span className="font-medium">
                                  {formatDate(movie.release_date)}
                                </span>
                              </div>
                            </div>
                          )}

                          {movie.runtime && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Runtime
                                </span>
                                <span className="font-medium">
                                  {formatRuntime(movie.runtime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40 p-6">
                        <h3 className="text-xl font-semibold mb-6 flex items-center">
                          <DollarSign className="h-5 w-5 text-primary mr-2" />
                          Financial Details
                        </h3>
                        <div className="space-y-5 divide-y divide-gray-800/40">
                          {movie.budget && movie.budget > 0 && (
                            <div className="pt-5 first:pt-0">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Budget
                                </span>
                                <span className="font-medium">
                                  ${movie.budget.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}

                          {movie.revenue && movie.revenue > 0 && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Revenue
                                </span>
                                <span className="font-medium">
                                  ${movie.revenue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}

                          {profit !== null && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Profit
                                </span>
                                <span
                                  className={`font-medium ${
                                    profit > 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  ${profit.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}

                          {roi !== null && (
                            <div className="pt-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400">
                                  Return on Investment
                                </span>
                                <span
                                  className={`font-medium ${
                                    roi > 0 ? "text-green-500" : "text-red-500"
                                  }`}
                                >
                                  {roi.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="cast"
                  className="animate-fade-up mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center mb-6">
                      <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold">Cast & Crew</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {cast.slice(0, 12).map((person) => (
                        <motion.div
                          key={person.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: person.order * 0.05,
                          }}
                          className="group relative bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40 p-4 hover:border-primary/50 hover:bg-black/30 transition-all duration-300"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary transition-all duration-300">
                              {person.profile_path ? (
                                <img
                                  src={getProfileUrl(person.profile_path)}
                                  alt={person.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                  <User className="h-10 w-10 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                              {person.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {person.character}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {cast.length > 12 && (
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          className="bg-black/30 border-gray-800 text-white hover:bg-black/50 hover:text-primary"
                        >
                          View All Cast
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="media"
                  className="animate-fade-up mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center mb-6">
                      <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold">Media</h2>
                    </div>

                    {trailers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {trailers.map((trailer, index) => (
                          <motion.div
                            key={trailer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group relative bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40 p-3 hover:border-primary/50 hover:bg-black/30 transition-all duration-300"
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title={trailer.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                            <p className="text-sm text-gray-300 mt-3 px-2">
                              {trailer.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40">
                        <PlayCircle className="h-14 w-14 text-gray-600 mb-4" />
                        <p className="text-lg text-gray-400">
                          No trailers available
                        </p>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="similar"
                  className="animate-fade-up mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center mb-6">
                      <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold">Similar Movies</h2>
                    </div>

                    {movie.similar?.results.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {movie.similar?.results
                          .slice(0, 8)
                          .map((similarMovie, index) => (
                            <motion.div
                              key={similarMovie.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <Link
                                to={`/movie/${similarMovie.id}`}
                                className="block"
                              >
                                <div className="group relative bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40 overflow-hidden hover:border-primary/50 hover:bg-black/30 transition-all duration-300">
                                  <div className="relative aspect-[2/3] overflow-hidden">
                                    <img
                                      src={getPosterUrl(
                                        similarMovie.poster_path,
                                        "w500"
                                      )}
                                      alt={similarMovie.title}
                                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/images/poster-placeholder.png";
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                          <span className="text-sm font-medium text-white">
                                            {(
                                              similarMovie.vote_average * 10
                                            ).toFixed(0)}
                                            %
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                          {formatYear(
                                            similarMovie.release_date
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <h3 className="font-medium text-white line-clamp-1 group-hover:text-primary transition-colors">
                                      {similarMovie.title}
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800/40">
                        <FilmIcon className="h-14 w-14 text-gray-600 mb-4" />
                        <p className="text-lg text-gray-400">
                          No similar movies found
                        </p>
                      </div>
                    )}

                    {movie.similar?.results.length > 8 && (
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          className="bg-black/30 border-gray-800 text-white hover:bg-black/50 hover:text-primary"
                        >
                          View More Movies
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetails;
