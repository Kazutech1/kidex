"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu, Bell, BookOpen, Compass } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check local storage or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass-navbar py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all active:scale-95 md:flex"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gradient group-hover:opacity-90 transition-opacity">
              Kidex
            </span>
          </Link>
        </div>

        {/* Center Section: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 glass-panel">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-gradient-premium text-white shadow-md"
                : "text-foreground/70 hover:text-foreground hover:bg-white/5"
            }`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === "/search"
                ? "bg-gradient-premium text-white shadow-md"
                : "text-foreground/70 hover:text-foreground hover:bg-white/5"
            }`}
          >
            Explore
          </Link>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <Link
            href="/search"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/80 hover:text-foreground transition-all active:scale-95"
            title="Search Manga"
          >
            <Search className="w-4.5 h-4.5" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/80 hover:text-foreground transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>

          {/* Notification Button */}
          <button
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground/80 hover:text-foreground transition-all active:scale-95 hidden sm:block relative"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>

          {/* Avatar Profile */}
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-orange-500 transition-colors shadow-inner flex items-center justify-center bg-zinc-800">
            <span className="text-sm font-semibold">User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
