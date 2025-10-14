import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { tmdbService } from '@/lib/tmdbService';

export const ApiTestButton = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testAPI = async () => {
    setIsTesting(true);
    setTestResult('Testing API...');
    
    try {
      console.log('🧪 Starting API test...');
      
      // Test 1: Get popular movies
      const popularMovies = await tmdbService.getPopularMovies(1);
      console.log('✅ Popular movies:', popularMovies.results.length);
      
      // Test 2: Search for a movie
      const searchResults = await tmdbService.searchMovies('batman', 1);
      console.log('✅ Search results:', searchResults.results.length);
      
      // Test 3: Get genres
      const genres = await tmdbService.getGenres();
      console.log('✅ Genres:', genres.length);
      
      setTestResult(`✅ API Test Passed! Found ${popularMovies.results.length} popular movies, ${searchResults.results.length} search results, and ${genres.length} genres.`);
    } catch (error) {
      console.error('❌ API test failed:', error);
      setTestResult(`❌ API Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-2">API Test</h3>
      <Button 
        onClick={testAPI} 
        disabled={isTesting}
        className="mb-2"
      >
        {isTesting ? 'Testing...' : 'Test TMDB API'}
      </Button>
      {testResult && (
        <p className="text-sm text-muted-foreground">{testResult}</p>
      )}
    </div>
  );
};

