import { useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Award } from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

// Mock data for featured movies
const featuredMovies = [
  {
    title: "Dune: Part Two",
    year: 2024,
    genre: "Sci-Fi",
    rating: 8.7,
    userRating: 9,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: false,
  },
  {
    title: "Oppenheimer",
    year: 2023,
    genre: "Biography",
    rating: 8.4,
    userRating: 8,
    poster: "https://images.unsplash.com/photo-1489599096494-2db61da42bc3?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: true,
  },
  {
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Action",
    rating: 7.8,
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: false,
  },
  {
    title: "The Batman",
    year: 2022,
    genre: "Action",
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1635863138275-d9864d171c5d?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: false,
  },
  {
    title: "Top Gun: Maverick",
    year: 2022,
    genre: "Action",
    rating: 8.2,
    userRating: 9,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    isLiked: true,
    isBookmarked: true,
  },
  {
    title: "Avatar: The Way of Water",
    year: 2022,
    genre: "Sci-Fi",
    rating: 7.6,
    poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
    isLiked: false,
    isBookmarked: false,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
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
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow px-8 py-6 text-lg font-semibold">
                Start Rating Movies
              </Button>
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg border-border bg-card hover:bg-card-hover">
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Your Next Favorite</h2>
            <p className="text-muted-foreground text-lg">
              Search through thousands of movies and discover your next cinematic adventure
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} onFilterClick={handleFilterClick} />
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
            
            <Button variant="ghost" className="text-primary hover:text-primary-glow">
              View All →
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredMovies.map((movie, index) => (
              <MovieCard key={index} {...movie} />
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

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">
              © 2024 Flimm Fiesta. Made with ❤️ for movie lovers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;