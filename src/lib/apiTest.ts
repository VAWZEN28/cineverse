// Test TMDB API connectivity
import { tmdbService } from './tmdbService';

export const testTMDBConnection = async () => {
  try {
    console.log('Testing TMDB API connection...');
    
    // Test 1: Get popular movies
    console.log('1. Testing popular movies...');
    const popularMovies = await tmdbService.getPopularMovies(1);
    console.log('✅ Popular movies:', popularMovies.results.length, 'movies found');
    
    // Test 2: Search for a movie
    console.log('2. Testing movie search...');
    const searchResults = await tmdbService.searchMovies('batman', 1);
    console.log('✅ Search results:', searchResults.results.length, 'movies found');
    
    // Test 3: Get genres
    console.log('3. Testing genres...');
    const genres = await tmdbService.getGenres();
    console.log('✅ Genres:', genres.length, 'genres found');
    
    // Test 4: Get trending movies
    console.log('4. Testing trending movies...');
    const trendingMovies = await tmdbService.getTrendingMovies('week', 1);
    console.log('✅ Trending movies:', trendingMovies.results.length, 'movies found');
    
    console.log('🎉 All TMDB API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ TMDB API test failed:', error);
    return false;
  }
};

// Auto-run test when imported
testTMDBConnection();

