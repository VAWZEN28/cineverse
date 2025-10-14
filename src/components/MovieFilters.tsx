import { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MovieService } from "@/lib/movieService";
import { MovieFilters } from "@/lib/types";

interface MovieFiltersProps {
  filters: MovieFilters;
  onFiltersChange: (filters: MovieFilters) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const MovieFilters = ({
  filters,
  onFiltersChange,
  onClose,
  isOpen,
}: MovieFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<MovieFilters>(filters);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const years = MovieService.getAvailableYears();

  // Load genres from TMDB API
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoadingGenres(true);
        const genreList = await MovieService.getAvailableGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error loading genres:', error);
        setGenres([]);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    loadGenres();
  }, []);

  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Genre</h3>
            <Select
              value={localFilters.genre || ""}
              onValueChange={(value) => handleFilterChange('genre', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All genres</SelectItem>
                {isLoadingGenres ? (
                  <SelectItem value="" disabled>Loading genres...</SelectItem>
                ) : (
                  genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Year</h3>
            <Select
              value={localFilters.year?.toString() || ""}
              onValueChange={(value) => handleFilterChange('year', value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-foreground">
              Minimum Rating: {localFilters.minRating || 0}
            </h3>
            <Slider
              value={[localFilters.minRating || 0]}
              onValueChange={([value]) => handleFilterChange('minRating', value)}
              max={10}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1 bg-gradient-primary">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
