import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Award } from "lucide-react";
import { Movie, MovieService } from "@/lib/movieService";
import { MovieFilters } from "@/lib/types";
import { MovieFilters as MovieFiltersComponent } from "@/components/MovieFilters";
import { ApiTestButton } from "@/components/ApiTestButton";
import heroImage from "@/assets/hero-cinema.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<MovieFilters>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load featured movies on component mount
  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const movies = await MovieService.getTrendingMovies(6);
        setFeaturedMovies(movies);
      } catch (error) {
        console.error('Error loading featured movies:', error);
      }
    };
    loadFeaturedMovies();
  }, []);

  const handleSearch = async (query: string, searchFilters?: MovieFilters) => {
    console.log('🔍 Starting search for:', query, 'with filters:', searchFilters || filters);
    setSearchQuery(query);
    
    if (!query.trim()) {
      console.log('⚠️ Empty query, clearing results');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    try {
      console.log('📡 Calling MovieService.searchMovies...');
      const results = await MovieService.searchMovies(query, searchFilters || filters);
      console.log('✅ Search results:', results.length, 'movies found');
      setSearchResults(results);
    } catch (error) {
      console.error('❌ Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterClick = () => {
    setIsFiltersOpen(true);
  };

  const handleFiltersChange = async (newFilters: MovieFilters) => {
    setFilters(newFilters);
    if (searchQuery) {
      setIsSearching(true);
      try {
        const results = await MovieService.searchMovies(searchQuery, newFilters);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching movies with filters:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleLikeToggle = async (movieId: string) => {
    // Refresh the movies to reflect the changes
    try {
      const movies = await MovieService.getTrendingMovies(6);
      setFeaturedMovies(movies);
      if (searchQuery) {
        const results = await MovieService.searchMovies(searchQuery, filters);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error refreshing movies after like toggle:', error);
    }
  };

  const handleBookmarkToggle = async (movieId: string) => {
    // Refresh the movies to reflect the changes
    try {
      const movies = await MovieService.getTrendingMovies(6);
      setFeaturedMovies(movies);
      if (searchQuery) {
        const results = await MovieService.searchMovies(searchQuery, filters);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error refreshing movies after bookmark toggle:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cinema background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/30" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium">Welcome to the Fiesta</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Rate, Discover &{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Celebrate
              </span>{" "}
              Cinema
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the ultimate movie community. Rate your favorites, discover hidden gems, 
              and celebrate the magic of cinema with fellow film enthusiasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow px-8 py-6 text-lg font-semibold"
                onClick={() => {
                  const searchSection = document.querySelector('#search-section');
                  searchSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Rating Movies
              </Button>
              <Link to="/discover">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg border-border bg-card hover:bg-card-hover">
                  Browse Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Your Next Favorite</h2>
            <p className="text-muted-foreground text-lg">
              Search through thousands of movies and discover your next cinematic adventure
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch} 
            onFilterClick={handleFilterClick}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isFiltersOpen={isFiltersOpen}
            onFiltersClose={() => setIsFiltersOpen(false)}
          />
          
          {/* Temporary API Test Button */}
          <div className="mt-8">
            <ApiTestButton />
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">Trending Now</span>
              </div>
              <h2 className="text-3xl font-bold">Featured Movies</h2>
            </div>
            
            <Link to="/discover">
              <Button variant="ghost" className="text-primary hover:text-primary-glow">
                View All →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                {...movie}
                onMovieClick={handleMovieClick}
                onLikeToggle={handleLikeToggle}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">50K+</h3>
              <p className="text-muted-foreground">Movies Rated</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">25K+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">1M+</h3>
              <p className="text-muted-foreground">Reviews Written</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold">Search Results</h2>
                <p className="text-muted-foreground">
                  {isSearching ? (
                    "Searching..."
                  ) : (
                    `Found ${searchResults.length} movies for "${searchQuery}"`
                  )}
                </p>
              </div>
            </div>

            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground text-lg">Searching movies...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {searchResults.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    {...movie}
                    onMovieClick={handleMovieClick}
                    onLikeToggle={handleLikeToggle}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No movies found for "{searchQuery}". Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLikeToggle={handleLikeToggle}
        onBookmarkToggle={handleBookmarkToggle}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">
              © 2024 Cineverse. Made with ❤️ for movie lovers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;