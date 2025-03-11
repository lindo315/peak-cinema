
import { toast } from "@/components/ui/use-toast";

const API_KEY = "fc3b22fdf9107c194338b124e4e7954c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const POSTER_SIZES = {
  tiny: "w92",
  small: "w154",
  medium: "w185",
  large: "w342",
  xlarge: "w500",
  xxlarge: "w780",
  original: "original"
};

export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original"
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  runtime?: number;
  genres?: Genre[];
  vote_count?: number;
  tagline?: string;
  status?: string;
  popularity?: number;
  budget?: number;
  revenue?: number;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: Movie[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface SearchResults {
  page: number;
  total_results: number;
  total_pages: number;
  results: Movie[];
}

export interface ApiError {
  status_message: string;
  status_code: number;
}

const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  const message = error instanceof Error ? error.message : "An error occurred while fetching data";
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  });
  throw error;
};

export const getPosterUrl = (path: string | null, size = POSTER_SIZES.large): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size = BACKDROP_SIZES.large): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path: string | null, size = POSTER_SIZES.medium): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error("Failed to fetch popular movies");
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error("Failed to fetch top rated movies");
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error("Failed to fetch now playing movies");
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error("Failed to fetch upcoming movies");
    const data = await response.json();
    return data.results;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,similar`
    );
    if (!response.ok) throw new Error("Failed to fetch movie details");
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const searchMovies = async (
  query: string, 
  page = 1,
  year?: number,
  sortBy: "popularity.desc" | "vote_average.desc" | "release_date.desc" = "popularity.desc"
): Promise<SearchResults> => {
  try {
    let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=${page}&sort_by=${sortBy}`;
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to search movies");
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    const data = await response.json();
    return data.genres;
  } catch (error) {
    return handleApiError(error);
  }
};

export const discoverMovies = async (
  params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    primary_release_year?: number;
    "vote_average.gte"?: number;
    "vote_count.gte"?: number;
  } = {}
): Promise<SearchResults> => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      language: "en-US",
      page: (params.page || 1).toString(),
      ...params
    });
    
    const response = await fetch(`${BASE_URL}/discover/movie?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Failed to discover movies");
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};
