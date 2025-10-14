import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie, MovieService } from "@/lib/movieService";
import { Heart, Bookmark, User, Star } from "lucide-react";

const MyLists = () => {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUserMovies();
  }, []);

  const loadUserMovies = async () => {
    try {
      const [liked, bookmarked] = await Promise.all([
        MovieService.getLikedMovies(),
        MovieService.getBookmarkedMovies()
      ]);
      setLikedMovies(liked);
      setBookmarkedMovies(bookmarked);
    } catch (error) {
      console.error('Error loading user movies:', error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleLikeToggle = async (movieId: string) => {
    await loadUserMovies();
  };

  const handleBookmarkToggle = async (movieId: string) => {
    await loadUserMovies();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <User className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium">My Lists</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Personal{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Keep track of your favorite movies and save films you want to watch later.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{likedMovies.length}</h3>
              <p className="text-muted-foreground">Liked Movies</p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <Bookmark className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{bookmarkedMovies.length}</h3>
              <p className="text-muted-foreground">Saved Movies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Lists */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="liked" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Liked Movies
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Movies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="liked" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Liked Movies</h2>
                  <p className="text-muted-foreground">
                    {likedMovies.length} movies you've liked
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Sorted by rating
                  </span>
                </div>
              </div>

              {likedMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {likedMovies.map((movie) => (
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
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No liked movies yet</h3>
                  <p className="text-muted-foreground">
                    Start liking movies to see them here!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Saved Movies</h2>
                  <p className="text-muted-foreground">
                    {bookmarkedMovies.length} movies you've saved
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Sorted by rating
                  </span>
                </div>
              </div>

              {bookmarkedMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {bookmarkedMovies.map((movie) => (
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
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved movies yet</h3>
                  <p className="text-muted-foreground">
                    Save movies to watch them later!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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

export default MyLists;
