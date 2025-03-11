import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Bookmark,
  Film,
  Menu,
  X,
  Globe,
  User,
  Bell,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Track scroll position for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Film, label: "Movies", path: "/movies" },
    { icon: Bookmark, label: "TV Shows", path: "/tv" },
    { icon: Search, label: "Discover", path: "/discover" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <div className="text-xl font-bold text-indigo-400">CineVerse</div>
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 text-sm transition-all duration-300 border-b-2 py-1",
                  isActive(item.path)
                    ? "text-white border-indigo-500 font-medium"
                    : "text-gray-400 border-transparent hover:text-white hover:border-indigo-400"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Right section - controls */}
        <div className="flex items-center space-x-4">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="h-8 w-8 rounded-full text-gray-400 hover:text-primary transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* User profile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-400 hover:text-primary transition-colors"
          >
            <User className="h-4 w-4" />
          </Button>

          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 w-8 rounded-full text-gray-400 hover:text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-zinc-800/50 bg-black/80 backdrop-blur-md"
          >
            <div className="container mx-auto py-4 px-4 sm:px-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for movies, TV shows, actors..."
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-800/50"
          >
            <nav className="flex flex-col px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200",
                    isActive(item.path)
                      ? "bg-indigo-500/10 text-white font-medium border-l-2 border-indigo-500 pl-4"
                      : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* User avatar */}
              <div className="flex items-center space-x-2 px-3 py-3 text-gray-400 border-t border-zinc-800/50 ext-white cursor-pointer transition-all duration-300 hover:bg-indigo-500/40 hover:text-white rounded-lg mt-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
