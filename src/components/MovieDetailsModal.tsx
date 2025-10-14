import { useState } from "react";
import { Star, Heart, Bookmark, Clock, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Movie, MovieService } from "@/lib/movieService";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle: (movieId: string) => void;
  onBookmarkToggle: (movieId: string) => void;
}

export const MovieDetailsModal = ({
  movie,
  isOpen,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
}: MovieDetailsModalProps) => {
  const [userRating, setUserRating] = useState(movie?.userRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!movie) return null;

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    MovieService.rateMovie(movie.id, rating);
  };

  const handleLikeToggle = () => {
    onLikeToggle(movie.id);
  };

  const handleBookmarkToggle = () => {
    onBookmarkToggle(movie.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {movie.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-background/90 backdrop-blur-sm text-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                  {movie.rating}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className={`flex-1 ${movie.isLiked ? 'bg-accent text-accent-foreground' : ''}`}
                onClick={handleLikeToggle}
              >
                <Heart className={`h-4 w-4 mr-2 ${movie.isLiked ? 'fill-current' : ''}`} />
                {movie.isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${movie.isBookmarked ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={handleBookmarkToggle}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${movie.isBookmarked ? 'fill-current' : ''}`} />
                {movie.isBookmarked ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{movie.genre}</Badge>
                <Badge variant="outline">{movie.year}</Badge>
                {movie.runtime && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{movie.runtime} min</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.description}
              </p>
            </div>

            <Separator />

            {/* Cast & Crew */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Cast & Crew</h3>
              <div className="space-y-3">
                {movie.director && (
                  <div>
                    <span className="font-medium text-foreground">Director: </span>
                    <span className="text-muted-foreground">{movie.director}</span>
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Cast: </span>
                    <span className="text-muted-foreground">
                      {movie.cast.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Rating Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Rating</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= (hoveredRating || userRating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  <span className="text-accent font-medium">
                    {userRating > 0 ? `${userRating}/10` : 'Not rated'}
                  </span>
                </div>
              </div>
              {userRating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Thanks for rating {movie.title}!
                </p>
              )}
            </div>

            <Separator />

            {/* Community Rating */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Community Rating</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-2xl font-bold">{movie.rating}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
                <Badge variant="secondary">
                  Based on community ratings
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
