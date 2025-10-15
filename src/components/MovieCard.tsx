import { Star, Heart, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Movie, MovieService } from "@/lib/movieService";

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
  showQuickActions?: boolean;
  onMovieClick?: (movie: Movie) => void;
  onLikeToggle?: (movieId: string) => void;
  onBookmarkToggle?: (movieId: string) => void;
}

// Legacy interface for backward compatibility
interface LegacyMovieCardProps extends Movie {
  onMovieClick?: (movie: Movie) => void;
  onLikeToggle?: (movieId: string) => void;
  onBookmarkToggle?: (movieId: string) => void;
}

export const MovieCard = (props: MovieCardProps | LegacyMovieCardProps) => {
  // Handle both new and legacy prop structures
  const isLegacy = 'id' in props;
  
  const {
    movie,
    compact = false,
    showQuickActions = true,
    onMovieClick,
    onLikeToggle,
    onBookmarkToggle,
  } = isLegacy ? {
    movie: props as Movie,
    compact: false,
    showQuickActions: true,
    onMovieClick: props.onMovieClick,
    onLikeToggle: props.onLikeToggle,
    onBookmarkToggle: props.onBookmarkToggle,
  } : props as MovieCardProps;
  
  const {
    id,
    title,
    year,
    genre,
    rating,
    userRating,
    poster,
    isLiked = false,
    isBookmarked = false,
  } = movie;
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    MovieService.toggleLike(id);
    onLikeToggle?.(id);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    MovieService.toggleBookmark(id);
    onBookmarkToggle?.(id);
  };

  const handleMovieClick = () => {
    const movieData: Movie = {
      ...movie,
      isLiked: liked,
      isBookmarked: bookmarked,
    };
    onMovieClick?.(movieData);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card hover:scale-105 cursor-pointer"
      onClick={handleMovieClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={poster}
          alt={`${title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        {showQuickActions && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/80 hover:bg-background border-border/50"
              onClick={handleLikeToggle}
            >
              <Heart 
                className={`h-4 w-4 ${liked ? 'fill-accent text-accent' : 'text-foreground'}`} 
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/80 hover:bg-background border-border/50"
              onClick={handleBookmarkToggle}
            >
              <Bookmark 
                className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : 'text-foreground'}`} 
              />
            </Button>
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>
        </div>
      </div>

      <div className={compact ? "p-2" : "p-4"}>
        <h3 className={`font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className={`text-muted-foreground ${
            compact ? 'text-xs' : 'text-sm'
          }`}>{year} • {genre}</p>
          {userRating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs text-accent font-medium">{userRating}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};