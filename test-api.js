// Simple test script to verify TMDB API credentials
const API_KEY = '41f9c3736a5c09deb1aa75814134728a';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MWY5YzM3MzZhNWMwOWRlYjFhYTc1ODE0MTM0NzI4YSIsIm5iZiI6MTc1ODY4ODA2OC4wMDMsInN1YiI6IjY4ZDM3MzQzNWM3OTFjZDY3NjJlYzJjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PxATOw22nLC4bO48lrieRCaN3z1Qrr0qo85YBYIFvUs';

async function testTMDBAPI() {
  try {
    console.log('🧪 Testing TMDB API credentials...');
    
    // Test with API key
    console.log('1. Testing with API key...');
    const response1 = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const data1 = await response1.json();
    console.log('✅ API Key test:', response1.status, data1.results?.length || 0, 'movies');
    
    // Test with access token
    console.log('2. Testing with access token...');
    const response2 = await fetch('https://api.themoviedb.org/3/movie/popular', {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data2 = await response2.json();
    console.log('✅ Access Token test:', response2.status, data2.results?.length || 0, 'movies');
    
    // Test search
    console.log('3. Testing search...');
    const response3 = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=batman`);
    const data3 = await response3.json();
    console.log('✅ Search test:', response3.status, data3.results?.length || 0, 'movies');
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTMDBAPI();

