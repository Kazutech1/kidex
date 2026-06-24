"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Heart } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const isReaderPage = pathname?.includes("/read/");

  if (isReaderPage) {
    return (
      <div className="min-h-screen w-full bg-black text-foreground relative z-10">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Floating Accent Glows (Apple TV Style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 animate-fade-in">
        {children}
      </main>

      {/* Modern Apple-style Footer */}
      <footer className="w-full mt-auto border-t border-white/5 bg-black/20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="text-sm font-semibold tracking-tight text-gradient">
              Kidex Reader
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-foreground/40 font-medium">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">API Docs</a>
          </div>

          <div className="flex items-center gap-3 text-foreground/40 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
            <span>by Apple Design fans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
