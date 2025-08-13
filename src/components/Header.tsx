import { Star, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Star className="h-8 w-8 fill-primary text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Flimm Fiesta
            </h1>
            <p className="text-xs text-muted-foreground leading-none">Rate • Discover • Enjoy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Discover
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            My Lists
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Reviews
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Trending
          </Button>
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};