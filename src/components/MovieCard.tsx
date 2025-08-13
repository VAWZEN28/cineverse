import { Star, Heart, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  year: number;
  genre: string;
  rating: number;
  userRating?: number;
  poster: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export const MovieCard = ({
  title,
  year,
  genre,
  rating,
  userRating,
  poster,
  isLiked = false,
  isBookmarked = false,
}: MovieCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card hover:scale-105 cursor-pointer">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={poster}
          alt={`${title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/80 hover:bg-background border-border/50"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${liked ? 'fill-accent text-accent' : 'text-foreground'}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/80 hover:bg-background border-border/50"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
          >
            <Bookmark 
              className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : 'text-foreground'}`} 
            />
          </Button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground">{year} • {genre}</p>
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