import { Star, User, Menu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <Star className="h-8 w-8 fill-primary text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Cineverse
            </h1>
            <p className="text-xs text-muted-foreground leading-none">Rate • Discover • Enjoy</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/discover">
            <Button 
              variant="ghost" 
              className={`${isActive('/discover') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary'}`}
            >
              Discover
            </Button>
          </Link>
          <Link to="/my-lists">
            <Button 
              variant="ghost" 
              className={`${isActive('/my-lists') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary'}`}
            >
              My Lists
            </Button>
          </Link>
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden md:block text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`hidden md:flex ${isActive('/profile') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary'}`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};