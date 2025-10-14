import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MovieFilters } from "@/lib/types";
import { MovieFilters as MovieFiltersComponent } from "./MovieFilters";

interface SearchBarProps {
  onSearch: (query: string, filters?: MovieFilters) => void;
  onFilterClick: () => void;
  filters: MovieFilters;
  onFiltersChange: (filters: MovieFilters) => void;
  isFiltersOpen: boolean;
  onFiltersClose: () => void;
}

export const SearchBar = ({ 
  onSearch, 
  onFilterClick, 
  filters, 
  onFiltersChange, 
  isFiltersOpen, 
  onFiltersClose 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies, directors, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg bg-card border-border focus:border-primary focus:ring-primary/20 rounded-xl"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onFilterClick}
          className="px-6 py-6 bg-card hover:bg-card-hover border-border rounded-xl"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </Button>
        <Button
          type="submit"
          size="lg"
          className="px-8 py-6 bg-gradient-primary hover:shadow-glow rounded-xl font-semibold"
        >
          Search
        </Button>
      </form>

      <MovieFiltersComponent
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClose={onFiltersClose}
        isOpen={isFiltersOpen}
      />
    </>
  );
};