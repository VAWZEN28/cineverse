// Movie service for handling movie data and operations
import { tmdbService, TMDBMovie, TMDBMovieDetails } from './tmdbService';

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  userRating?: number;
  poster: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  description?: string;
  director?: string;
  cast?: string[];
  runtime?: number;
  backdrop?: string;
  tmdbId?: number;
}

// Extended movie data with more details
const extendedMovies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    year: 2024,
    genre: "Sci-Fi",
    rating: 8.7,
    userRating: 9,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: false,
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    runtime: 166
  },
  {
    id: "2",
    title: "Oppenheimer",
    year: 2023,
    genre: "Biography",
    rating: 8.4,
    userRating: 8,
    poster: "https://images.unsplash.com/photo-1489599096494-2db61da42bc3?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: true,
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    runtime: 180
  },
  {
    id: "3",
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Action",
    rating: 7.8,
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: false,
    description: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes connecting with the lives she could have led.",
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu"],
    runtime: 139
  },
  {
    id: "4",
    title: "The Batman",
    year: 2022,
    genre: "Action",
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1635863138275-d9864d171c5d?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: false,
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate, and uncover the corruption that connects to his own family.",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
    runtime: 176
  },
  {
    id: "5",
    title: "Top Gun: Maverick",
    year: 2022,
    genre: "Action",
    rating: 8.2,
    userRating: 9,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: true,
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    director: "Joseph Kosinski",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
    runtime: 130
  },
  {
    id: "6",
    title: "Avatar: The Way of Water",
    year: 2022,
    genre: "Sci-Fi",
    rating: 7.6,
    poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: false,
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    runtime: 192
  },
  {
    id: "7",
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    rating: 8.8,
    poster: "https://images.unsplash.com/photo-1624138784729-6fd5c3d3b5b5?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: true,
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    runtime: 148
  },
  {
    id: "8",
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    rating: 9.3,
    poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: false,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    runtime: 142
  },
  {
    id: "9",
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    rating: 8.9,
    poster: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: true,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    runtime: 154
  },
  {
    id: "10",
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: 9.0,
    poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: true,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    runtime: 152
  }
];

// Local storage keys
const STORAGE_KEYS = {
  USER_RATINGS: 'cineverse_user_ratings',
  LIKED_MOVIES: 'cineverse_liked_movies',
  BOOKMARKED_MOVIES: 'cineverse_bookmarked_movies'
};

// Get data from localStorage
const getStoredData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// Save data to localStorage
const saveStoredData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

// Helper function to convert TMDB movie to our Movie interface
const convertTMDBMovie = (tmdbMovie: TMDBMovie, userRatings: Record<string, number>, likedMovies: Record<string, boolean>, bookmarkedMovies: Record<string, boolean>): Movie => {
  const year = new Date(tmdbMovie.release_date).getFullYear();
  const genre = 'Unknown'; // We'll get this from movie details if needed
  
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    year: year,
    genre: genre,
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    userRating: userRatings[tmdbMovie.id.toString()],
    poster: tmdbService.getImageURL(tmdbMovie.poster_path, 'w500'),
    backdrop: tmdbService.getBackdropURL(tmdbMovie.backdrop_path, 'w1280'),
    isLiked: likedMovies[tmdbMovie.id.toString()] || false,
    isBookmarked: bookmarkedMovies[tmdbMovie.id.toString()] || false,
    description: tmdbMovie.overview,
    tmdbId: tmdbMovie.id
  };
};

export class MovieService {
  // Get all movies (now uses TMDB API)
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
      
      const response = await tmdbService.getPopularMovies(1);
      return response.results.map(movie => 
        convertTMDBMovie(movie, userRatings, likedMovies, bookmarkedMovies)
      );
    } catch (error) {
      console.error('Error fetching movies from TMDB:', error);
      // Fallback to local data
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);

      return extendedMovies.map(movie => ({
        ...movie,
        userRating: userRatings[movie.id] || movie.userRating,
        isLiked: likedMovies[movie.id] || movie.isLiked || false,
        isBookmarked: bookmarkedMovies[movie.id] || movie.isBookmarked || false
      }));
    }
  }

  // Search movies (now uses TMDB API)
  static async searchMovies(query: string, filters?: {
    genre?: string;
    year?: number;
    minRating?: number;
  }): Promise<Movie[]> {
    console.log('🎬 MovieService.searchMovies called with:', { query, filters });
    
    try {
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
      
      const tmdbFilters = {
        genre: filters?.genre,
        year: filters?.year,
        minRating: filters?.minRating
      };
      
      console.log('📡 Calling tmdbService.searchMovies with:', { query, tmdbFilters });
      const response = await tmdbService.searchMovies(query, 1, tmdbFilters);
      console.log('📡 TMDB response:', response.results.length, 'movies');
      
      const convertedMovies = response.results.map(movie => 
        convertTMDBMovie(movie, userRatings, likedMovies, bookmarkedMovies)
      );
      
      console.log('✅ Converted movies:', convertedMovies.length);
      return convertedMovies;
    } catch (error) {
      console.error('❌ Error searching movies from TMDB:', error);
      console.log('🔄 Falling back to local search...');
      
      // Fallback to local search with extendedMovies directly
      console.log('🔄 Using local extendedMovies array for fallback');
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);

      const movies = extendedMovies.map(movie => ({
        ...movie,
        userRating: userRatings[movie.id] || movie.userRating,
        isLiked: likedMovies[movie.id] || movie.isLiked || false,
        isBookmarked: bookmarkedMovies[movie.id] || movie.isBookmarked || false
      }));
      
      const lowerQuery = query.toLowerCase();

      const filteredMovies = movies.filter(movie => {
        // Text search
        const matchesQuery = !query || 
          movie.title.toLowerCase().includes(lowerQuery) ||
          movie.director?.toLowerCase().includes(lowerQuery) ||
          movie.cast?.some(actor => actor.toLowerCase().includes(lowerQuery)) ||
          movie.genre.toLowerCase().includes(lowerQuery);

        // Filter by genre
        const matchesGenre = !filters?.genre || 
          movie.genre.toLowerCase() === filters.genre.toLowerCase() ||
          movie.genre.toLowerCase().includes(filters.genre.toLowerCase());

        // Filter by year
        const matchesYear = !filters?.year || movie.year === filters.year;

        // Filter by minimum rating
        const matchesRating = !filters?.minRating || movie.rating >= filters.minRating;

        return matchesQuery && matchesGenre && matchesYear && matchesRating;
      });
      
      console.log('🔄 Local search results:', filteredMovies.length, 'movies from', movies.length, 'total local movies');
      
      // If no results found with filters, return some movies anyway
      if (filteredMovies.length === 0 && query) {
        console.log('🔄 No filtered results, returning top-rated local movies');
        return movies.sort((a, b) => b.rating - a.rating).slice(0, 5);
      }
      
      return filteredMovies;
    }
  }

  // Get movie by ID (now uses TMDB API)
  static async getMovieById(id: string): Promise<Movie | undefined> {
    try {
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
      
      const movieDetails = await tmdbService.getMovieDetails(parseInt(id));
      
      // Convert TMDB movie details to our Movie interface
      const year = new Date(movieDetails.release_date).getFullYear();
      const genre = movieDetails.genres[0]?.name || 'Unknown';
      const director = movieDetails.credits?.crew.find(person => person.job === 'Director')?.name;
      const cast = movieDetails.credits?.cast.slice(0, 5).map(actor => actor.name) || [];
      
      return {
        id: movieDetails.id.toString(),
        title: movieDetails.title,
        year: year,
        genre: genre,
        rating: Math.round(movieDetails.vote_average * 10) / 10,
        userRating: userRatings[movieDetails.id.toString()],
        poster: tmdbService.getImageURL(movieDetails.poster_path, 'w500'),
        backdrop: tmdbService.getBackdropURL(movieDetails.backdrop_path, 'w1280'),
        isLiked: likedMovies[movieDetails.id.toString()] || false,
        isBookmarked: bookmarkedMovies[movieDetails.id.toString()] || false,
        description: movieDetails.overview,
        director: director,
        cast: cast,
        runtime: movieDetails.runtime,
        tmdbId: movieDetails.id
      };
    } catch (error) {
      console.error('Error fetching movie details from TMDB:', error);
      // Fallback to local data
      const movies = await this.getAllMovies();
      return movies.find(movie => movie.id === id);
    }
  }

  // Rate a movie
  static rateMovie(movieId: string, rating: number): void {
    const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
    userRatings[movieId] = rating;
    saveStoredData(STORAGE_KEYS.USER_RATINGS, userRatings);
  }

  // Toggle like status
  static toggleLike(movieId: string): void {
    const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
    likedMovies[movieId] = !likedMovies[movieId];
    saveStoredData(STORAGE_KEYS.LIKED_MOVIES, likedMovies);
  }

  // Toggle bookmark status
  static toggleBookmark(movieId: string): void {
    const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
    bookmarkedMovies[movieId] = !bookmarkedMovies[movieId];
    saveStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES, bookmarkedMovies);
  }

  // Get user's liked movies
  static getLikedMovies(): Movie[] {
    const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
    return this.getAllMovies().filter(movie => likedMovies[movie.id]);
  }

  // Get user's bookmarked movies
  static getBookmarkedMovies(): Movie[] {
    const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
    return this.getAllMovies().filter(movie => bookmarkedMovies[movie.id]);
  }

  // Get trending movies (now uses TMDB API)
  static async getTrendingMovies(limit: number = 6): Promise<Movie[]> {
    try {
      const userRatings = getStoredData(STORAGE_KEYS.USER_RATINGS);
      const likedMovies = getStoredData(STORAGE_KEYS.LIKED_MOVIES);
      const bookmarkedMovies = getStoredData(STORAGE_KEYS.BOOKMARKED_MOVIES);
      
      const response = await tmdbService.getTrendingMovies('week', 1);
      return response.results.slice(0, limit).map(movie => 
        convertTMDBMovie(movie, userRatings, likedMovies, bookmarkedMovies)
      );
    } catch (error) {
      console.error('Error fetching trending movies from TMDB:', error);
      // Fallback to local data
      const movies = await this.getAllMovies();
      return movies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    }
  }

  // Get movies by genre
  static async getMoviesByGenre(genre: string): Promise<Movie[]> {
    const movies = await this.getAllMovies();
    return movies.filter(movie => movie.genre === genre);
  }

  // Get available genres (now uses TMDB API)
  static async getAvailableGenres(): Promise<string[]> {
    try {
      const genres = await tmdbService.getGenres();
      return genres.map(genre => genre.name).sort();
    } catch (error) {
      console.error('Error fetching genres from TMDB:', error);
      // Fallback to local data
      const movies = await this.getAllMovies();
      const genreSet = new Set(movies.map(movie => movie.genre));
      return Array.from(genreSet).sort();
    }
  }

  // Get available years (generate common years)
  static getAvailableYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }
}
