"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mangaList, allGenres, Manga } from "@/lib/mangaData";
import { fetchTrendingManga } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";
import { ChevronLeft, ChevronRight, Play, BookOpen, Star, Sparkles, Flame, Clock, Compass } from "lucide-react";

export default function Home() {
  const [trending, setTrending] = useState<Manga[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const continueReading = mangaList.filter((m) => m.continueProgress !== undefined);

  // Load live trending manga from MangaDex on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchTrendingManga(10);
        if (data && data.length > 0) {
          setTrending(data);
        } else {
          setTrending(mangaList);
        }
      } catch (err) {
        console.error("Failed to load MangaDex trending, falling back", err);
        setTrending(mangaList);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredMangas = trending.length > 0 ? trending.slice(0, 3) : mangaList.slice(0, 3);

  // Auto slide effect
  useEffect(() => {
    if (featuredMangas.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMangas.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMangas.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMangas.length) % featuredMangas.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMangas.length);
  };

  // Fallback banners styling mapping
  const getBannerGradient = (id: string) => {
    switch (id) {
      case "shadows-edge":
        return "from-[#8E2DE2]/45 via-[#4A00E0]/30 to-zinc-950/90";
      case "neo-tokyo-2099":
        return "from-indigo-600/35 via-indigo-950/20 to-zinc-950/90";
      default:
        return "from-orange-800/35 via-orange-950/20 to-zinc-950/90";
    }
  };

  const activeSlide = featuredMangas[currentSlide];

  return (
    <div className="space-y-12">
      {/* 1. Hero Spotlight Carousel Section */}
      {activeSlide && (
        <section className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden glass-panel shadow-2xl group/hero">
          {/* Banner Image or Gradient Mesh */}
          <div className="absolute inset-0 z-0 bg-zinc-950">
            <div className={`absolute inset-0 bg-gradient-to-r ${getBannerGradient(activeSlide.id)}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSlide.bannerUrl}
              alt={activeSlide.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-lighten opacity-30 group-hover/hero:scale-101 transition-transform duration-[10s]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Edge vignettes to soften shadows for premium contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-zinc-950/70 to-transparent hidden md:block" />
          </div>

          {/* Slide Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-2xl text-left">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-orange-300" />
                Spotlight
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-panel text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{activeSlide.rating.toFixed(2)}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3 line-clamp-2">
              {activeSlide.title}
            </h1>

            {/* Metadata */}
            <p className="text-xs sm:text-sm font-semibold text-orange-300/80 mb-4">
              Story by <span className="text-white">{activeSlide.author}</span> • Art by <span className="text-white">{activeSlide.artist}</span>
            </p>

            {/* Description */}
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-6 font-medium max-w-xl">
              {activeSlide.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={`/manga/${activeSlide.id}`}
                className="px-6 py-3 rounded-2xl bg-gradient-premium hover:opacity-95 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Details & Chapters
              </Link>
            </div>
          </div>

          {/* Sliding Buttons */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 border border-white/5 hover:text-white transition-all active:scale-95 backdrop-blur-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <div className="text-[10px] font-bold text-white/40 tracking-widest px-2 select-none">
              {currentSlide + 1} / {featuredMangas.length}
            </div>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 border border-white/5 hover:text-white transition-all active:scale-95 backdrop-blur-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </section>
      )}

      {/* 2. Genre Chips Ribbon */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-foreground/80">
          <Compass className="w-4.5 h-4.5 text-orange-400" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-foreground/50">
            Quick Browse Genres
          </h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {allGenres.map((genre) => (
            <Link
              key={genre}
              href={`/search?genre=${genre}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 text-foreground/80 hover:text-white transition-all whitespace-nowrap active:scale-95"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Continue Reading Section */}
      {continueReading.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-black tracking-tight">
                Continue Reading
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {continueReading.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="group flex gap-4 p-3 rounded-2xl glass-panel border border-white/5 hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
              >
                {/* Small Cover Art */}
                <div className="w-16 h-20 rounded-xl overflow-hidden relative bg-zinc-900 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-950 to-zinc-900" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                </div>

                {/* Progress Detail */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-orange-400 transition-colors line-clamp-1">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    Currently reading: {manga.continueChapter}
                  </p>

                  {/* Progress Bar Container */}
                  <div className="w-full mt-3">
                    <div className="flex justify-between items-center text-[9px] font-bold text-foreground/40 mb-1">
                      <span>Progress</span>
                      <span>{manga.continueProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-premium"
                        style={{ width: `${manga.continueProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Trending Manga Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-black tracking-tight">
              Trending Releases
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            See All →
          </Link>
        </div>

        {/* Loader or Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full h-[360px] rounded-2xl bg-white/5 border border-white/5 animate-pulse flex flex-col justify-end p-4 gap-3">
                <div className="h-4 bg-white/10 rounded-md w-3/4"></div>
                <div className="h-3 bg-white/10 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {trending.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
