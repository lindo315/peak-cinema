
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { discoverMovies, getGenres } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

// Available years for filtering
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

// Sort options
const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  { value: "release_date.desc", label: "Release Date Descending" },
  { value: "release_date.asc", label: "Release Date Ascending" },
  { value: "revenue.desc", label: "Revenue Descending" },
];

const Explore = () => {
  const [activeTab, setActiveTab] = useState("discover");
  
  // Discover filters
  const [genreId, setGenreId] = useState("");
  const [year, setYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  
  // Fetch genres
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });
  
  // Discover movies
  const { 
    data: discoverData, 
    isLoading: discoverLoading 
  } = useQuery({
    queryKey: ["discoverMovies", genreId, year, sortBy, page],
    queryFn: () => discoverMovies({
      page,
      with_genres: genreId,
      primary_release_year: year ? parseInt(year) : undefined,
      sort_by: sortBy,
      "vote_count.gte": 100,
    }),
  });

  // Handle load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Explore Movies</h1>
        
        <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="oscars">Oscar Winners</TabsTrigger>
            <TabsTrigger value="classics">Classic Movies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="animate-fade-up">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Genre Filter */}
              <div className="space-y-1 min-w-[200px]">
                <label htmlFor="genre" className="text-sm font-medium">
                  Genre
                </label>
                <Select 
                  value={genreId} 
                  onValueChange={(value) => {
                    setGenreId(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All genres</SelectItem>
                    {genres?.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Year Filter */}
              <div className="space-y-1 min-w-[120px]">
                <label htmlFor="year" className="text-sm font-medium">
                  Year
                </label>
                <Select 
                  value={year} 
                  onValueChange={(value) => {
                    setYear(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All years</SelectItem>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort Filter */}
              <div className="space-y-1 min-w-[200px]">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort By
                </label>
                <Select 
                  value={sortBy} 
                  onValueChange={(value) => {
                    setSortBy(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Movie Grid */}
            <MovieGrid 
              movies={discoverData?.results || []} 
              loading={discoverLoading} 
            />
            
            {/* Load More */}
            {discoverData && page < discoverData.total_pages && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleLoadMore} 
                  variant="outline" 
                  className="min-w-[200px]"
                >
                  Load More
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="oscars" className="animate-fade-up">
            <div className="text-center py-16">
              <Compass className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-8">
                This feature is under development and will be available soon!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="classics" className="animate-fade-up">
            <div className="text-center py-16">
              <Compass className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-8">
                This feature is under development and will be available soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explore;
