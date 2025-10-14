// TMDB API service for fetching movie data
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages: Array<{
    iso_639_1: string;
    name: string;
  }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBFilters {
  genre?: string;
  year?: number;
  minRating?: number;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'title.asc';
}

class TMDBService {
  private readonly baseURL = 'https://api.themoviedb.org/3';
  private readonly apiKey = '41f9c3736a5c09deb1aa75814134728a';
  private readonly accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MWY5YzM3MzZhNWMwOWRlYjFhYTc1ODE0MTM0NzI4YSIsIm5iZiI6MTc1ODY4ODA2OC4wMDMsInN1YiI6IjY4ZDM3MzQzNWM3OTFjZDY3NjJlYzJjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PxATOw22nLC4bO48lrieRCaN3z1Qrr0qo85YBYIFvUs';
  private readonly imageBaseURL = 'https://image.tmdb.org/t/p';

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add API key to params
    params.api_key = this.apiKey;
    
    // Add params to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log('🌐 Making request to:', url.toString());
    console.log('🔑 Using API key:', this.apiKey.substring(0, 8) + '...');
    console.log('🎫 Using access token:', this.accessToken.substring(0, 20) + '...');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TMDB API error response:', errorText);
      throw new Error(`TMDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ TMDB API response received');
    return data;
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest<TMDBResponse<TMDBMovie>>('/movie/popular', { page });
  }

  // Get trending movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`, { page });
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page });
  }

  // Search movies
  async searchMovies(query: string, page: number = 1, filters?: TMDBFilters): Promise<TMDBResponse<TMDBMovie>> {
    console.log('🔍 TMDB searchMovies called with:', { query, page, filters });
    
    const params: Record<string, any> = {
      query,
      page,
      include_adult: false,
    };

    if (filters?.year) {
      params.year = filters.year;
    }

    if (filters?.genre) {
      // Get genre ID from genre name
      console.log('🎭 Getting genre ID for:', filters.genre);
      const genres = await this.getGenres();
      const genre = genres.find(g => g.name.toLowerCase() === filters.genre?.toLowerCase());
      if (genre) {
        params.with_genres = genre.id;
        console.log('🎭 Found genre ID:', genre.id);
      } else {
        console.log('⚠️ Genre not found:', filters.genre);
      }
    }

    if (filters?.minRating) {
      params['vote_average.gte'] = filters.minRating;
    }

    if (filters?.sortBy) {
      params.sort_by = filters.sortBy;
    }

    console.log('📡 Making TMDB request with params:', params);
    const response = await this.makeRequest<TMDBResponse<TMDBMovie>>('/search/movie', params);
    console.log('📡 TMDB search response:', response.results.length, 'movies');
    return response;
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.makeRequest<TMDBMovieDetails>(`/movie/${movieId}`, {
      append_to_response: 'credits'
    });
  }

  // Get genres
  async getGenres(): Promise<TMDBGenre[]> {
    const response = await this.makeRequest<{ genres: TMDBGenre[] }>('/genre/movie/list');
    return response.genres;
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest<TMDBResponse<TMDBMovie>>('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
  }

  // Get movies by year
  async getMoviesByYear(year: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest<TMDBResponse<TMDBMovie>>('/discover/movie', {
      primary_release_year: year,
      page,
      sort_by: 'popularity.desc'
    });
  }

  // Get discover movies with filters
  async discoverMovies(filters: TMDBFilters, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const params: Record<string, any> = {
      page,
      sort_by: filters.sortBy || 'popularity.desc',
      include_adult: false,
    };

    if (filters.genre) {
      const genres = await this.getGenres();
      const genre = genres.find(g => g.name.toLowerCase() === filters.genre?.toLowerCase());
      if (genre) {
        params.with_genres = genre.id;
      }
    }

    if (filters.year) {
      params.primary_release_year = filters.year;
    }

    if (filters.minRating) {
      params['vote_average.gte'] = filters.minRating;
    }

    return this.makeRequest<TMDBResponse<TMDBMovie>>('/discover/movie', params);
  }

  // Helper method to get full image URL
  getImageURL(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) {
      return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop'; // Fallback image
    }
    return `${this.imageBaseURL}/${size}${path}`;
  }

  // Helper method to get backdrop URL
  getBackdropURL(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) {
      return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop'; // Fallback image
    }
    return `${this.imageBaseURL}/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();
