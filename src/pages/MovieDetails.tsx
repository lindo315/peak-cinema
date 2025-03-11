
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  getMovieDetails, 
  getPosterUrl, 
  getBackdropUrl,
  getProfileUrl
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
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [inWatchlist, setInWatchlist] = React.useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(Number(id)),
    enabled: !!id,
  });

  React.useEffect(() => {
    // Check if movie is in watchlist
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setInWatchlist(watchlist.some((item: { id: number }) => item.id === Number(id)));
  }, [id]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    
    if (inWatchlist) {
      const newWatchlist = watchlist.filter((item: { id: number }) => item.id !== Number(id));
      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
      setInWatchlist(false);
      toast({
        title: "Removed from watchlist",
        description: `${movie?.title} has been removed from your watchlist`,
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
          description: `${movie.title} has been added to your watchlist`,
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 block">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  // Find the trailer
  const trailer = movie.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // Get directors
  const directors = movie.credits?.crew.filter((crew) => crew.job === "Director");

  // Get cast sorted by order
  const cast = movie.credits?.cast.slice(0, 12).sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div className="animate-fade-in pb-16">
        {/* Backdrop */}
        <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}
          
          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-black/60"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative -mt-32 sm:-mt-48 md:-mt-56 z-10 flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-48 sm:w-64 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-xl">
              <img
                src={getPosterUrl(movie.poster_path, "w342")}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 md:pt-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-balance">{movie.title}</h1>
              
              {/* Tagline */}
              {movie.tagline && (
                <p className="mt-2 text-lg italic text-muted-foreground text-balance">
                  "{movie.tagline}"
                </p>
              )}
              
              {/* Meta */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {movie.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                    {movie.vote_count && (
                      <span className="text-muted-foreground">({movie.vote_count} votes)</span>
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
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-4">
                {trailer && (
                  <Button asChild className="gap-2">
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
                  className="gap-2"
                  onClick={toggleWatchlist}
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5", 
                      inWatchlist && "fill-current"
                    )} 
                  />
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="overview">
              <TabsList className="mx-auto mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                <TabsTrigger value="similar">Similar Movies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="animate-fade-up">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  <p className="text-lg leading-relaxed">{movie.overview}</p>
                  
                  {/* Additional Details */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      {directors && directors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Director</h3>
                          <p className="text-base">{directors.map(d => d.name).join(", ")}</p>
                        </div>
                      )}
                      
                      {movie.status && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Status</h3>
                          <p className="text-base">{movie.status}</p>
                        </div>
                      )}
                      
                      {movie.release_date && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Release Date</h3>
                          <p className="text-base">{formatDate(movie.release_date)}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Column */}
                    <div>
                      {movie.budget > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Budget</h3>
                          <p className="text-base">${movie.budget.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {movie.revenue > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Revenue</h3>
                          <p className="text-base">${movie.revenue.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {movie.popularity && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Popularity</h3>
                          <p className="text-base">{movie.popularity.toFixed(1)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cast" className="animate-fade-up">
                {cast && cast.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {cast.map((person) => (
                        <div key={person.id} className="flex flex-col items-center text-center">
                          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-2 rounded-full overflow-hidden bg-muted">
                            {person.profile_path ? (
                              <img
                                src={getProfileUrl(person.profile_path)}
                                alt={person.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <User className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-sm">{person.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{person.character}</p>
                        </div>
                      ))}
                    </div>
                    
                    {directors && directors.length > 0 && (
                      <>
                        <Separator className="my-8" />
                        <h2 className="text-2xl font-semibold mb-6">Directors</h2>
                        <div className="flex flex-wrap gap-6">
                          {directors.map((person) => (
                            <div key={person.id} className="flex flex-col items-center text-center">
                              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-2 rounded-full overflow-hidden bg-muted">
                                {person.profile_path ? (
                                  <img
                                    src={getProfileUrl(person.profile_path)}
                                    alt={person.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                                    <User className="h-10 w-10 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <h3 className="font-medium text-sm">{person.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">Director</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No cast information available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="similar" className="animate-fade-up">
                <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
                {movie.similar && movie.similar.results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {movie.similar.results.slice(0, 12).map((similarMovie) => (
                      <MovieCard key={similarMovie.id} movie={similarMovie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No similar movies available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetails;
