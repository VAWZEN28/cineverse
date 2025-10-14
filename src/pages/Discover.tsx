import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie, MovieService } from "@/lib/movieService";
import { MovieFilters } from "@/lib/types";
import { Sparkles, Film, Star } from "lucide-react";

const Discover = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load genres and movies
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [genreList, movieList] = await Promise.all([
          MovieService.getAvailableGenres(),
          selectedGenre ? MovieService.getMoviesByGenre(selectedGenre) : MovieService.getAllMovies()
        ]);
        setGenres(genreList);
        setMovies(movieList);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedGenre]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleLikeToggle = async (movieId: string) => {
    // Refresh the movies to reflect the changes
    try {
      const movieList = selectedGenre 
        ? await MovieService.getMoviesByGenre(selectedGenre) 
        : await MovieService.getAllMovies();
      setMovies(movieList);
    } catch (error) {
      console.error('Error refreshing movies after like toggle:', error);
    }
  };

  const handleBookmarkToggle = async (movieId: string) => {
    // Refresh the movies to reflect the changes
    try {
      const movieList = selectedGenre 
        ? await MovieService.getMoviesByGenre(selectedGenre) 
        : await MovieService.getAllMovies();
      setMovies(movieList);
    } catch (error) {
      console.error('Error refreshing movies after bookmark toggle:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium">Discover</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Explore the World of{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Cinema
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive into different genres and discover amazing films from every era of cinema.
            </p>
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <section className="py-8 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedGenre === "" ? "default" : "outline"}
              onClick={() => setSelectedGenre("")}
              className="bg-gradient-primary"
            >
              <Film className="h-4 w-4 mr-2" />
              All Movies
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? "bg-gradient-primary" : ""}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">
                {selectedGenre ? `${selectedGenre} Movies` : "All Movies"}
              </h2>
              <p className="text-muted-foreground">
                {movies.length} movies found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Sorted by rating
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading movies...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    {...movie}
                    onMovieClick={handleMovieClick}
                    onLikeToggle={handleLikeToggle}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>

              {movies.length === 0 && (
                <div className="text-center py-12">
                  <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No movies found in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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

export default Discover;
