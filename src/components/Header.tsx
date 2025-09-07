import { Search, Upload, Home, User, Trophy, Book, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import newLogo from "../assets/shiningStar.png";
import { useState } from "react";

interface HeaderProps {
  user: any;
  activeView: string;
  setActiveView: (view: "feed" | "dashboard" | "leaderboard" | "manual") => void;
  onUpload: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onSearch?: (term: string) => void;
}

export function Header({ user, activeView, setActiveView, onUpload, onLogout, onOpenChat, onSearch }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Example: Call this function in parent to filter submissions
  // You may need to lift this up and pass a prop like onSearch(term)
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      console.log("Search for:", searchTerm);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close search when opening menu
    if (!isMobileMenuOpen && showMobileSearch) setShowMobileSearch(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="py-1 md:py-[16px] px-4">
        <div className="container mx-auto lg:flex lg:justify-around">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile Menu Button and Logo */}
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden mr-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <img src={newLogo} alt="Logo" className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover" />
            </div>

            {/* Search Bar - Desktop */}
            <form className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8" onSubmit={handleSearch}>
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by employee number, name..."
                  className="pl-10 bg-gray-50 border-gray-200 py-2 text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white w-8 h-8 flex items-center justify-center">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowMobileSearch(!showMobileSearch);
                  // Close menu when opening search
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Upload Button (Desktop) */}
              <Button onClick={onUpload} className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Upload Entry</span>
              </Button>

              {/* Notifications */}
              {/* <Button variant="ghost" size="icon" className="relative" onClick={onOpenNotifications}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-xs">3</Badge>
              </Button> */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm lg:text-base">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveView("dashboard")}>Profile & Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={onOpenChat}>Open Chat Support</DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Navigation (Desktop) */}
          <div className="hidden md:flex items-center justify-center space-x-1 py-2 lg:border-0 border-t">
            <a href="/">
              <Button
                variant={activeView === "feed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("feed")}
                className="text-xs sm:text-sm">
                <Home className="h-4 w-4 mr-1 sm:mr-2" />
                Explore
              </Button>
            </a>

            <Button
              variant={activeView === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("dashboard")}
              className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              Dashboard
            </Button>

            <Button
              variant={activeView === "leaderboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("leaderboard")}
              className="text-xs sm:text-sm">
              <Trophy className="h-4 w-4 mr-1 sm:mr-2" />
              Leaderboard
            </Button>

            <Button
              variant={activeView === "manual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("manual")}
              className="text-xs sm:text-sm">
              <Book className="h-4 w-4 mr-1 sm:mr-2" />
              Manual
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Positioned below top bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-t py-3 px-4">
          <div className="container mx-auto">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by employee number, name..."
                  className="pl-10 bg-gray-50 border-gray-200 py-2 text-sm w-full"
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
                Search
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu - Full-width below search bar */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={activeView === "feed" ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => {
                  setActiveView("feed");
                  setIsMobileMenuOpen(false);
                }}>
                <Home className="h-5 w-5 mr-2" />
                Explore
              </Button>

              <Button
                variant={activeView === "dashboard" ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => {
                  setActiveView("dashboard");
                  setIsMobileMenuOpen(false);
                }}>
                <User className="h-5 w-5 mr-2" />
                Dashboard
              </Button>

              <Button
                variant={activeView === "leaderboard" ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => {
                  setActiveView("leaderboard");
                  setIsMobileMenuOpen(false);
                }}>
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </Button>

              <Button
                variant={activeView === "manual" ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => {
                  setActiveView("manual");
                  setIsMobileMenuOpen(false);
                }}>
                <Book className="h-5 w-5 mr-2" />
                Manual
              </Button>
            </div>

            <Button
              onClick={() => {
                onUpload();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 mt-4">
              <Upload className="h-5 w-5 mr-2" />
              Upload Entry
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
