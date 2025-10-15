// Movie Recommendation Service for intelligent movie suggestions
import { MovieService, Movie } from './movieService';

export interface UserPreferences {
  favoriteGenres?: string[];
  preferredRatingRange?: { min: number; max: number };
  preferredYearRange?: { min: number; max: number };
  likedDirectors?: string[];
  dislikedGenres?: string[];
}

export interface RecommendationRequest {
  query: string;
  genres?: string[];
  mood?: string;
  year?: number;
  minRating?: number;
  maxResults?: number;
  userContext?: {
    likedMovies?: Movie[];
    ratedMovies?: Movie[];
    preferences?: UserPreferences;
  };
}

export interface RecommendationResponse {
  movies: Movie[];
  reasoning: string;
  confidence: number;
  searchStrategy: string;
}

// Mood to genre mapping
const MOOD_GENRE_MAPPING: Record<string, string[]> = {
  // Positive moods
  'happy': ['Comedy', 'Adventure', 'Family', 'Animation', 'Musical'],
  'excited': ['Action', 'Adventure', 'Thriller', 'Sci-Fi'],
  'romantic': ['Romance', 'Drama', 'Comedy'],
  'adventurous': ['Adventure', 'Action', 'Fantasy', 'Sci-Fi'],
  'funny': ['Comedy', 'Animation'],
  'uplifting': ['Comedy', 'Family', 'Adventure', 'Musical'],
  
  // Contemplative moods
  'thoughtful': ['Drama', 'Biography', 'Documentary', 'History'],
  'deep': ['Drama', 'Thriller', 'Mystery', 'Biography'],
  'philosophical': ['Drama', 'Sci-Fi', 'Documentary'],
  'nostalgic': ['Drama', 'Romance', 'Family'],
  
  // Intense moods
  'thrilled': ['Thriller', 'Action', 'Horror', 'Mystery'],
  'scared': ['Horror', 'Thriller', 'Mystery'],
  'mysterious': ['Mystery', 'Thriller', 'Crime'],
  'dark': ['Thriller', 'Crime', 'Horror', 'Drama'],
  'suspenseful': ['Thriller', 'Mystery', 'Crime'],
  
  // Relaxed moods
  'chill': ['Comedy', 'Romance', 'Animation', 'Family'],
  'relaxed': ['Drama', 'Romance', 'Comedy'],
  'peaceful': ['Drama', 'Family', 'Documentary'],
  
  // Emotional moods
  'sad': ['Drama', 'Romance'],
  'emotional': ['Drama', 'Romance', 'Biography'],
  'inspiring': ['Biography', 'Drama', 'Adventure'],
  'motivational': ['Biography', 'Adventure', 'Drama']
};

// Keywords to genre mapping
const KEYWORD_GENRE_MAPPING: Record<string, string[]> = {
  // Action keywords
  'action': ['Action', 'Thriller'],
  'fight': ['Action', 'Thriller'],
  'explosion': ['Action'],
  'superhero': ['Action', 'Adventure', 'Sci-Fi'],
  'war': ['War', 'Action', 'Drama'],
  'battle': ['Action', 'War', 'Fantasy'],
  
  // Sci-Fi keywords
  'space': ['Sci-Fi', 'Adventure'],
  'alien': ['Sci-Fi', 'Horror'],
  'future': ['Sci-Fi', 'Thriller'],
  'robot': ['Sci-Fi', 'Action'],
  'technology': ['Sci-Fi', 'Thriller'],
  'time': ['Sci-Fi', 'Drama'],
  
  // Horror keywords
  'horror': ['Horror', 'Thriller'],
  'scary': ['Horror', 'Thriller'],
  'ghost': ['Horror', 'Mystery'],
  'monster': ['Horror', 'Thriller'],
  'zombie': ['Horror', 'Action'],
  
  // Romance keywords
  'love': ['Romance', 'Drama'],
  'romantic': ['Romance', 'Comedy'],
  'relationship': ['Romance', 'Drama'],
  'wedding': ['Romance', 'Comedy'],
  
  // Comedy keywords
  'funny': ['Comedy'],
  'laugh': ['Comedy'],
  'humor': ['Comedy'],
  'comedy': ['Comedy'],
  
  // Drama keywords
  'drama': ['Drama'],
  'emotional': ['Drama', 'Romance'],
  'family': ['Family', 'Drama'],
  'life': ['Drama', 'Biography'],
  
  // Crime keywords
  'crime': ['Crime', 'Thriller'],
  'detective': ['Crime', 'Mystery'],
  'murder': ['Crime', 'Thriller', 'Mystery'],
  'police': ['Crime', 'Action'],
  
  // Fantasy keywords
  'magic': ['Fantasy', 'Adventure'],
  'fantasy': ['Fantasy', 'Adventure'],
  'medieval': ['Fantasy', 'Adventure'],
  'dragon': ['Fantasy', 'Adventure'],
  
  // Animation keywords
  'animated': ['Animation', 'Family'],
  'cartoon': ['Animation', 'Comedy'],
  'kids': ['Animation', 'Family'],
  
  // Biography keywords
  'biography': ['Biography', 'Drama'],
  'real': ['Biography', 'Drama'],
  'true': ['Biography', 'Drama'],
  'based': ['Biography', 'Drama'],
  
  // Documentary keywords
  'documentary': ['Documentary'],
  'nature': ['Documentary'],
  'history': ['History', 'Documentary'],
  
  // Musical keywords
  'music': ['Musical', 'Drama'],
  'musical': ['Musical', 'Comedy'],
  'singing': ['Musical', 'Comedy'],
  'dance': ['Musical', 'Romance']
};

class RecommendationService {
  
  // Main recommendation method
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    console.log('🎯 SIMPLE: Processing query:', request.query);
    
    const query = request.query.toLowerCase();
    
    // Get all available movies - force fallback to local movies with proper genres
    let allMovies: Movie[];
    try {
      allMovies = await MovieService.getAllMovies();
      console.log('📚 Got', allMovies.length, 'movies total');
      
      // Check if movies have proper genres, if not use local data
      const hasProperGenres = allMovies.some(m => m.genre !== 'Unknown' && m.genre !== '');
      console.log('🏷️ Movies have proper genres:', hasProperGenres);
      
      if (!hasProperGenres) {
        console.log('🔄 TMDB movies lack genre info, forcing local movie data');
        throw new Error('Using local data for better genre information');
      }
    } catch (error) {
      console.log('📚 Using hardcoded local movies with proper genres');
      // Use the local movie data directly
      allMovies = [
        {
          id: "1",
          title: "Dune: Part Two",
          year: 2024,
          genre: "Sci-Fi",
          rating: 8.7,
          poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
          description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
        },
        {
          id: "2",
          title: "Oppenheimer",
          year: 2023,
          genre: "Biography",
          rating: 8.4,
          poster: "https://images.unsplash.com/photo-1489599096494-2db61da42bc3?w=400&h=600&fit=crop",
          description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
        },
        {
          id: "3",
          title: "Everything Everywhere All at Once",
          year: 2022,
          genre: "Action",
          rating: 7.8,
          poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
          description: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence."
        },
        {
          id: "4",
          title: "The Batman",
          year: 2022,
          genre: "Action",
          rating: 7.9,
          poster: "https://images.unsplash.com/photo-1635863138275-d9864d171c5d?w=400&h=600&fit=crop",
          description: "When the Riddler begins murdering key political figures in Gotham, Batman is forced to investigate."
        },
        {
          id: "5",
          title: "Top Gun: Maverick",
          year: 2022,
          genre: "Action",
          rating: 8.2,
          poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
          description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator."
        },
        {
          id: "7",
          title: "Inception",
          year: 2010,
          genre: "Sci-Fi",
          rating: 8.8,
          poster: "https://images.unsplash.com/photo-1624138784729-6fd5c3d3b5b5?w=400&h=600&fit=crop",
          description: "A thief who steals corporate secrets through the use of dream-sharing technology."
        },
        {
          id: "8",
          title: "The Shawshank Redemption",
          year: 1994,
          genre: "Drama",
          rating: 9.3,
          poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
          description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption."
        },
        {
          id: "9",
          title: "Pulp Fiction",
          year: 1994,
          genre: "Crime",
          rating: 8.9,
          poster: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&h=600&fit=crop",
          description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales."
        },
        {
          id: "10",
          title: "The Dark Knight",
          year: 2008,
          genre: "Action",
          rating: 9.0,
          poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
          description: "When the Joker wreaks havoc on Gotham, Batman faces one of his greatest tests."
        },
        {
          id: "11",
          title: "Superbad",
          year: 2007,
          genre: "Comedy",
          rating: 7.6,
          poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          description: "Two co-dependent high school seniors are forced to deal with separation anxiety."
        },
        {
          id: "12",
          title: "The Conjuring",
          year: 2013,
          genre: "Horror",
          rating: 7.5,
          poster: "https://images.unsplash.com/photo-1520637836862-4d197d17c98a?w=400&h=600&fit=crop",
          description: "Paranormal investigators help a family terrorized by a dark presence in their farmhouse."
        },
        {
          id: "13",
          title: "The Notebook",
          year: 2004,
          genre: "Romance",
          rating: 7.8,
          poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
          description: "A poor yet passionate young man falls in love with a rich young woman."
        }
      ];
    }
    
    if (allMovies.length === 0) {
      console.log('⚠️ No movies found, using hardcoded fallback');
      return this.getTestRecommendations();
    }
    
    // Simple query matching
    let results: Movie[] = [];
    let reasoning = "";
    
    console.log('🔎 Available genres:', [...new Set(allMovies.map(m => m.genre))].join(', '));
    
    if (query.includes('comedy') || query.includes('funny') || query.includes('laugh') || query.includes('humor')) {
      results = allMovies.filter(m => m.genre.toLowerCase() === 'comedy');
      reasoning = "🤣 Perfect! I found some hilarious comedy movies for you!";
      console.log('🎭 Detected: COMEDY request -', results.length, 'movies found');
    } 
    else if (query.includes('action') || query.includes('fight') || query.includes('battle') || query.includes('superhero')) {
      results = allMovies.filter(m => m.genre.toLowerCase() === 'action');
      reasoning = "💥 Get ready for some intense action movies!";
      console.log('🎬 Detected: ACTION request -', results.length, 'movies found');
    }
    else if (query.includes('drama') || query.includes('emotional') || query.includes('serious')) {
      results = allMovies.filter(m => m.genre.toLowerCase() === 'drama');
      reasoning = "🎭 Here are some powerful drama movies that will move you!";
      console.log('🎭 Detected: DRAMA request -', results.length, 'movies found');
    }
    else if (query.includes('sci-fi') || query.includes('science') || query.includes('space') || query.includes('future') || query.includes('scifi')) {
      results = allMovies.filter(m => m.genre.toLowerCase().includes('sci'));
      reasoning = "🚀 Blast off with these amazing sci-fi adventures!";
      console.log('🛸 Detected: SCI-FI request -', results.length, 'movies found');
    }
    else if (query.includes('horror') || query.includes('scary') || query.includes('fear') || query.includes('thriller')) {
      results = allMovies.filter(m => m.genre.toLowerCase() === 'thriller' || m.genre.toLowerCase() === 'horror');
      reasoning = "😱 Prepare to be scared with these thrilling movies!";
      console.log('👻 Detected: HORROR/THRILLER request -', results.length, 'movies found');
    }
    else if (query.includes('romance') || query.includes('love') || query.includes('romantic')) {
      results = allMovies.filter(m => m.genre.toLowerCase() === 'romance');
      reasoning = "❤️ Fall in love with these romantic movies!";
      console.log('💕 Detected: ROMANCE request -', results.length, 'movies found');
    }
    else {
      // Default: return top-rated movies
      results = allMovies.sort((a, b) => b.rating - a.rating).slice(0, 6);
      reasoning = "⭐ Here are some of the highest-rated movies I recommend!";
      console.log('🌟 Default: TOP-RATED movies');
    }
    
    // If no results found for specific genre, return top movies
    if (results.length === 0) {
      results = allMovies.sort((a, b) => b.rating - a.rating).slice(0, 6);
      reasoning = "🎬 I couldn't find that specific type, but here are some great movies anyway!";
      console.log('🔄 No genre matches, using top-rated');
    }
    
    // Limit results and sort by rating
    const finalResults = results
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    
    console.log('✅ Returning', finalResults.length, 'movies');
    console.log('🎬 Movies:', finalResults.map(m => `${m.title} (${m.genre})`).join(', '));
    
    return {
      movies: finalResults,
      reasoning: reasoning,
      confidence: 0.9,
      searchStrategy: "simple_keyword_match"
    };
  }
  
  // Analyze user query for intent and keywords
  private analyzeQuery(query: string): {
    hasSpecificTitle: boolean;
    detectedGenres: string[];
    detectedMoods: string[];
    detectedKeywords: string[];
    isQuestion: boolean;
  } {
    const words = query.split(' ').map(w => w.trim().toLowerCase());
    
    // Detect if it's a specific title search
    const hasSpecificTitle = query.includes('"') || 
                             words.some(word => word.charAt(0).toUpperCase() + word.slice(1) === word);
    
    // Detect genres
    const detectedGenres: string[] = [];
    for (const [keyword, genres] of Object.entries(KEYWORD_GENRE_MAPPING)) {
      if (words.includes(keyword) || query.includes(keyword)) {
        detectedGenres.push(...genres);
      }
    }
    
    // Detect moods
    const detectedMoods: string[] = [];
    for (const mood of Object.keys(MOOD_GENRE_MAPPING)) {
      if (words.includes(mood) || query.includes(mood)) {
        detectedMoods.push(mood);
      }
    }
    
    // Detect keywords
    const detectedKeywords = words.filter(word => 
      Object.keys(KEYWORD_GENRE_MAPPING).includes(word) ||
      Object.keys(MOOD_GENRE_MAPPING).includes(word)
    );
    
    // Check if it's a question
    const isQuestion = query.includes('?') || 
                      words.some(word => ['what', 'which', 'recommend', 'suggest'].includes(word));
    
    return {
      hasSpecificTitle,
      detectedGenres: [...new Set(detectedGenres)],
      detectedMoods,
      detectedKeywords,
      isQuestion
    };
  }
  // Determine the best search strategy
  private determineSearchStrategy(
    request: RecommendationRequest, 
    analysis: ReturnType<typeof this.analyzeQuery>
  ): string {
    console.log('📝 Determining search strategy:', { 
      hasSpecificTitle: analysis.hasSpecificTitle,
      isQuestion: analysis.isQuestion,
      hasMood: !!(request.mood || analysis.detectedMoods.length),
      hasGenres: !!(request.genres?.length || analysis.detectedGenres.length),
      hasUserContext: !!(request.userContext?.likedMovies?.length)
    });
    
    // Direct search if specific title mentioned
    if (analysis.hasSpecificTitle && !analysis.isQuestion) {
      return 'direct_search';
    }
    
    // Mood-based if mood is specified or detected
    if (request.mood || analysis.detectedMoods.length > 0) {
      return 'mood_based';
    }
    
    // Genre-based if genres are specified or detected
    if (request.genres?.length || analysis.detectedGenres.length > 0) {
      return 'genre_based';
    }
    
    // Personalized if user context is rich
    if (request.userContext?.likedMovies && request.userContext.likedMovies.length > 2) {
      return 'personalized';
    }
    
    // Default to genre-based with popular genres
    return 'genre_based';
  }
  
  // Build search filters from request and analysis
  private buildSearchFilters(
    request: RecommendationRequest,
    analysis: ReturnType<typeof this.analyzeQuery>,
    preferences?: UserPreferences
  ): {
    genres?: string[];
    year?: number;
    minRating?: number;
    excludeGenres?: string[];
  } {
    const filters: any = {};
    
    // Combine requested and detected genres
    const allGenres = [
      ...(request.genres || []),
      ...analysis.detectedGenres
    ];
    
    // Add mood-based genres
    if (request.mood) {
      const moodGenres = MOOD_GENRE_MAPPING[request.mood.toLowerCase()] || [];
      allGenres.push(...moodGenres);
    }
    
    // Add detected mood genres
    analysis.detectedMoods.forEach(mood => {
      const moodGenres = MOOD_GENRE_MAPPING[mood] || [];
      allGenres.push(...moodGenres);
    });
    
    // Remove duplicates and filter
    if (allGenres.length > 0) {
      filters.genres = [...new Set(allGenres)];
    } else {
      // If no genres detected, provide some popular default genres
      filters.genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Romance'];
    }
    
    // Apply other filters
    if (request.year) {
      filters.year = request.year;
    }
    
    if (request.minRating) {
      filters.minRating = request.minRating;
    }
    
    // Apply user preferences
    if (preferences) {
      if (preferences.dislikedGenres?.length) {
        filters.excludeGenres = preferences.dislikedGenres;
      }
      
      if (preferences.preferredRatingRange && !request.minRating) {
        filters.minRating = preferences.preferredRatingRange.min;
      }
    }
    
    return filters;
  }
  
  // Perform direct search based on query
  private async performDirectSearch(
    query: string, 
    filters: any, 
    maxResults: number
  ): Promise<Movie[]> {
    try {
      const movies = await MovieService.searchMovies(query, {
        genre: filters.genres?.[0],
        year: filters.year,
        minRating: filters.minRating
      });
      
      if (movies.length > 0) {
        return movies.slice(0, maxResults);
      }
    } catch (error) {
      console.warn('Direct search failed:', error);
    }
    
    // Fallback: try without filters
    try {
      console.log('🔄 Direct search with filters failed, trying without filters...');
      const movies = await MovieService.searchMovies(query);
      return movies.slice(0, maxResults);
    } catch (error) {
      console.warn('Direct search without filters failed:', error);
      return [];
    }
  }
  
  // Perform genre-based search
  private async performGenreBasedSearch(
    genres: string[], 
    filters: any, 
    maxResults: number
  ): Promise<Movie[]> {
    console.log('🎬 performGenreBasedSearch called with genres:', genres);
    const allMovies: Movie[] = [];
    
    // If no genres provided, get all movies and filter
    if (genres.length === 0) {
      console.log('⚠️ No genres provided, getting all movies');
      try {
        const allMoviesFromService = await MovieService.getAllMovies();
        console.log('🎬 Got', allMoviesFromService.length, 'movies from service');
        const result = allMoviesFromService
          .sort((a, b) => b.rating - a.rating)
          .slice(0, maxResults);
        console.log('🎬 Returning', result.length, 'movies (no genre filter)');
        return result;
      } catch (error) {
        console.warn('Failed to get all movies:', error);
        return [];
      }
    }
    
    // Search for each genre
    for (const genre of genres.slice(0, 3)) { // Limit to 3 genres for performance
      try {
        console.log(`🎬 Searching for genre: ${genre}`);
        const movies = await MovieService.searchMovies('', {
          genre,
          year: filters.year,
          minRating: filters.minRating || 5.0 // Lower threshold for better results
        });
        console.log(`🎬 Found ${movies.length} movies for genre: ${genre}`);
        allMovies.push(...movies);
      } catch (error) {
        console.warn(`Failed to search for genre ${genre}:`, error);
        
        // Try getting all movies and filtering by genre manually
        try {
          const allMoviesFromService = await MovieService.getAllMovies();
          const genreMovies = allMoviesFromService.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
          );
          console.log(`🔄 Manual genre filter found ${genreMovies.length} movies for ${genre}`);
          allMovies.push(...genreMovies);
        } catch (fallbackError) {
          console.warn(`Fallback genre search failed for ${genre}:`, fallbackError);
        }
      }
    }
    
    // Remove duplicates and sort by rating
    const uniqueMovies = this.removeDuplicateMovies(allMovies);
    const result = uniqueMovies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, maxResults);
      
    console.log(`🎬 Genre-based search returning ${result.length} movies`);
    return result;
  }
  
  // Perform mood-based search
  private async performMoodBasedSearch(
    mood: string, 
    filters: any, 
    maxResults: number
  ): Promise<Movie[]> {
    const moodGenres = MOOD_GENRE_MAPPING[mood.toLowerCase()] || ['Comedy'];
    return this.performGenreBasedSearch(moodGenres, filters, maxResults);
  }
  
  // Perform personalized search based on user history
  private async performPersonalizedSearch(
    userContext: NonNullable<RecommendationRequest['userContext']>, 
    filters: any, 
    maxResults: number
  ): Promise<Movie[]> {
    const { likedMovies = [], ratedMovies = [], preferences } = userContext;
    
    // Analyze user's preferred genres from history
    const genreFrequency: Record<string, number> = {};
    [...likedMovies, ...ratedMovies.filter(m => (m.userRating || 0) >= 7)].forEach(movie => {
      genreFrequency[movie.genre] = (genreFrequency[movie.genre] || 0) + 1;
    });
    
    // Get top preferred genres
    const preferredGenres = Object.entries(genreFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    // Combine with explicit preferences
    if (preferences?.favoriteGenres) {
      preferredGenres.push(...preferences.favoriteGenres);
    }
    
    // Search based on preferences
    const updatedFilters = {
      ...filters,
      genres: [...new Set(preferredGenres)],
      minRating: preferences?.preferredRatingRange?.min || filters.minRating || 7.0
    };
    
    return this.performGenreBasedSearch(updatedFilters.genres, updatedFilters, maxResults);
  }
  
  // Perform fallback search
  private async performFallbackSearch(
    query: string, 
    filters: any, 
    maxResults: number
  ): Promise<Movie[]> {
    console.log('🚨 Performing fallback search...');
    
    try {
      // Try trending movies first
      console.log('📈 Trying to get trending movies...');
      const trending = await MovieService.getTrendingMovies(maxResults);
      if (trending.length > 0) {
        console.log(`📈 Found ${trending.length} trending movies`);
        return trending;
      }
    } catch (error) {
      console.warn('Failed to get trending movies:', error);
    }
    
    try {
      // Fallback to all movies
      console.log('📚 Getting all movies as fallback...');
      const allMovies = await MovieService.getAllMovies();
      console.log(`📚 Retrieved ${allMovies.length} total movies`);
      
      const result = allMovies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, maxResults);
      
      console.log(`📚 Returning ${result.length} movies from fallback`);
      return result;
    } catch (error) {
      console.error('Even fallback failed:', error);
      
      // Last resort: return some hardcoded popular movies
      return [
        {
          id: "fallback-1",
          title: "The Shawshank Redemption",
          year: 1994,
          genre: "Drama",
          rating: 9.3,
          poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
          description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
        },
        {
          id: "fallback-2", 
          title: "The Dark Knight",
          year: 2008,
          genre: "Action",
          rating: 9.0,
          poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
        }
      ];
    }
  }
  
  // Remove duplicate movies from results
  private removeDuplicateMovies(movies: Movie[]): Movie[] {
    const seen = new Set<string>();
    return movies.filter(movie => {
      if (seen.has(movie.id)) {
        return false;
      }
      seen.add(movie.id);
      return true;
    });
  }
  
  // Post-process results based on user context
  private postProcessResults(
    movies: Movie[], 
    request: RecommendationRequest, 
    userContext?: RecommendationRequest['userContext']
  ): Movie[] {
    let processedMovies = [...movies];
    
    // Filter out movies user has already seen (if they rated them)
    if (userContext?.ratedMovies) {
      const ratedIds = new Set(userContext.ratedMovies.map(m => m.id));
      processedMovies = processedMovies.filter(movie => !ratedIds.has(movie.id));
    }
    
    // Apply user preferences
    if (userContext?.preferences) {
      const { dislikedGenres, preferredRatingRange, preferredYearRange } = userContext.preferences;
      
      processedMovies = processedMovies.filter(movie => {
        // Filter out disliked genres
        if (dislikedGenres?.includes(movie.genre)) {
          return false;
        }
        
        // Filter by preferred rating range
        if (preferredRatingRange) {
          if (movie.rating < preferredRatingRange.min || movie.rating > preferredRatingRange.max) {
            return false;
          }
        }
        
        // Filter by preferred year range
        if (preferredYearRange) {
          if (movie.year < preferredYearRange.min || movie.year > preferredYearRange.max) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // Sort by rating (descending) and user preferences
    processedMovies.sort((a, b) => {
      // Prioritize user's liked movies' similar genres
      if (userContext?.likedMovies) {
        const likedGenres = userContext.likedMovies.map(m => m.genre);
        const aInLiked = likedGenres.includes(a.genre);
        const bInLiked = likedGenres.includes(b.genre);
        
        if (aInLiked && !bInLiked) return -1;
        if (!aInLiked && bInLiked) return 1;
      }
      
      // Sort by rating
      return b.rating - a.rating;
    });
    
    return processedMovies;
  }
  
  // Build reasoning text for genre-based recommendations
  private buildGenreBasedReasoning(genres: string[], mood?: string): string {
    if (mood) {
      return `Since you're feeling ${mood}, I found some great ${genres.join(', ')} movies that should match your mood perfectly!`;
    }
    
    if (genres.length === 1) {
      return `Here are some excellent ${genres[0]} movies I think you'll enjoy`;
    }
    
    return `Based on your interest in ${genres.slice(0, -1).join(', ')} and ${genres[genres.length - 1]} movies, here are my recommendations`;
  }
  
  // Get user's movie preferences from their history
  async getUserPreferences(userId?: string): Promise<UserPreferences> {
    try {
      // In a real app, this would fetch from user profile/database
      // For now, derive from localStorage
      const likedMovies = await MovieService.getLikedMovies();
      const ratedMovies = [] as Movie[]; // Would get from user's rating history
      
      const genreFrequency: Record<string, number> = {};
      const directorFrequency: Record<string, number> = {};
      
      [...likedMovies, ...ratedMovies.filter(m => (m.userRating || 0) >= 7)].forEach(movie => {
        genreFrequency[movie.genre] = (genreFrequency[movie.genre] || 0) + 1;
        if (movie.director) {
          directorFrequency[movie.director] = (directorFrequency[movie.director] || 0) + 1;
        }
      });
      
      const favoriteGenres = Object.entries(genreFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);
        
      const likedDirectors = Object.entries(directorFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([director]) => director);
      
      return {
        favoriteGenres,
        likedDirectors,
        preferredRatingRange: { min: 6.5, max: 10 }, // Default good quality
        preferredYearRange: { min: 1990, max: new Date().getFullYear() }
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }
  
  // Test method to ensure we can return movies
  private getTestRecommendations(): RecommendationResponse {
    const testMovies: Movie[] = [
      {
        id: "test-1",
        title: "The Dark Knight",
        year: 2008,
        genre: "Action",
        rating: 9.0,
        poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
      },
      {
        id: "test-2",
        title: "Inception",
        year: 2010,
        genre: "Sci-Fi",
        rating: 8.8,
        poster: "https://images.unsplash.com/photo-1624138784729-6fd5c3d3b5b5?w=400&h=600&fit=crop",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
      },
      {
        id: "test-3",
        title: "The Shawshank Redemption",
        year: 1994,
        genre: "Drama",
        rating: 9.3,
        poster: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
      }
    ];
    
    return {
      movies: testMovies,
      reasoning: "🧪 Test mode: Here are some classic movies to test the chat functionality!",
      confidence: 1.0,
      searchStrategy: "test"
    };
  }
}

export const recommendationService = new RecommendationService();
