import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// API functions
export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/trending/movie/week', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: false
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0 };
  }
};

// Alias for searchMovies to maintain compatibility
export const searchMulti = searchMovies;

export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return { results: [], total_pages: 0 };
  }
};

// Movie detail functions
export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return { cast: [], crew: [] };
  }
};

export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return { results: [] };
  }
};

// TV Show API Functions
export const getPopularTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getTopRatedTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated TV shows:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getTrendingTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/trending/tv/week', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getTvShowDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
};

export default tmdbApi; 