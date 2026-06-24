"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  BookMarked,
  History,
  Settings,
  HelpCircle,
  TrendingUp,
  X,
  Compass,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [currentQuery, setCurrentQuery] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentQuery(window.location.search);
    }
  }, [pathname]);

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/search", icon: Compass },
    { name: "Bookmarks", href: "/search?filter=bookmarks", icon: BookMarked },
    { name: "History", href: "/search?filter=history", icon: History }
  ];

  const quickGenres = [
    { name: "Action", href: "/search?genre=Action" },
    { name: "Dark Fantasy", href: "/search?genre=Dark Fantasy" },
    { name: "Sci-Fi", href: "/search?genre=Sci-Fi" },
    { name: "Romance", href: "/search?genre=Romance" },
    { name: "Mystery", href: "/search?genre=Mystery" }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel-heavy border-r border-white/5 transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                K
              </div>
              <span className="text-lg font-bold tracking-tight text-gradient">
                Kidex
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 no-scrollbar">
            {/* Main Menu */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-widest text-foreground/40 uppercase mb-2">
                Discover
              </p>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href.includes("?") && pathname + currentQuery === item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-gradient-premium text-white shadow-lg shadow-orange-500/15"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-foreground/50 group-hover:text-foreground"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Quick Genres */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                  Popular Genres
                </p>
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              </div>
              {quickGenres.map((genre) => (
                <Link
                  key={genre.name}
                  href={genre.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <span>{genre.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-orange-500 transition-colors"></span>
                </Link>
              ))}
            </div>

            {/* Sub-Actions */}
            <div className="space-y-1 pt-4 border-t border-white/5">
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all text-left"
                onClick={() => alert("Settings - customization settings coming soon in the demo!")}
              >
                <Settings className="w-4.5 h-4.5 text-foreground/50" />
                Settings
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all text-left"
                onClick={() => alert("Kidex v1.0.0. An Apple-style manga reader dashboard.")}
              >
                <HelpCircle className="w-4.5 h-4.5 text-foreground/50" />
                About App
              </button>
            </div>
          </nav>

          {/* Footer Info */}
          <div className="p-5 border-t border-white/5 text-center">
            <p className="text-[11px] text-foreground/30">
              © 2026 Kidex Reader.
            </p>
            <p className="text-[9px] text-orange-400/40 mt-0.5">
              Designed with Apple aesthetics
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
