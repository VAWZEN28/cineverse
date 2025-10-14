import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Movie, MovieService } from "@/lib/movieService";
import { User, Star, Heart, Bookmark, Settings, Award, TrendingUp, Calendar } from "lucide-react";

const Profile = () => {
  const [userRatings, setUserRatings] = useState<Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    favoriteGenre: "",
    joinDate: "2024"
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [allMovies, likedMoviesList, bookmarkedMoviesList] = await Promise.all([
        MovieService.getAllMovies(),
        MovieService.getLikedMovies(),
        MovieService.getBookmarkedMovies()
      ]);
      
      const ratedMovies = allMovies.filter(movie => movie.userRating);
      setUserRatings(ratedMovies);
      setLikedMovies(likedMoviesList);
      setBookmarkedMovies(bookmarkedMoviesList);

    // Calculate user stats
    const totalRatings = ratedMovies.length;
    const averageRating = totalRatings > 0 
      ? ratedMovies.reduce((sum, movie) => sum + (movie.userRating || 0), 0) / totalRatings 
      : 0;
    
    // Find favorite genre
    const genreCounts: { [key: string]: number } = {};
    ratedMovies.forEach(movie => {
      genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
    });
    const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => 
      genreCounts[a] > genreCounts[b] ? a : b, "");

      setUserStats({
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        favoriteGenre,
        joinDate: "2024"
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleLikeToggle = async (movieId: string) => {
    await loadUserData();
  };

  const handleBookmarkToggle = async (movieId: string) => {
    await loadUserData();
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
              <span className="text-primary font-medium">Profile</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your movie preferences, ratings, and personal collection.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Info */}
      <section className="py-8 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="text-2xl">U</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Movie Enthusiast</h2>
              <p className="text-muted-foreground mb-4">Passionate about cinema and storytelling</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Member since {userStats.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">{userStats.totalRatings} ratings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">Avg: {userStats.averageRating}/10</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{userStats.totalRatings}</h3>
                <p className="text-muted-foreground">Movies Rated</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{likedMovies.length}</h3>
                <p className="text-muted-foreground">Liked Movies</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Bookmark className="h-8 w-8 text-secondary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{bookmarkedMovies.length}</h3>
                <p className="text-muted-foreground">Saved Movies</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{userStats.averageRating}</h3>
                <p className="text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Movie Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="ratings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ratings" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                My Ratings
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Liked Movies
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Movies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ratings" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">My Ratings</h2>
                  <p className="text-muted-foreground">
                    {userRatings.length} movies you've rated
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Sorted by rating
                  </span>
                </div>
              </div>

              {userRatings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {userRatings.map((movie) => (
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
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No ratings yet</h3>
                  <p className="text-muted-foreground">
                    Start rating movies to see them here!
                  </p>
                </div>
              )}
            </TabsContent>

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

export default Profile;
