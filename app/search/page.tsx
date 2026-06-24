"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mangaList, allGenres, Manga } from "@/lib/mangaData";
import { searchManga } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";
import { Search as SearchIcon, X, ChevronDown, Info } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Ongoing" | "Completed">("All");
  const [sortBy, setSortBy] = useState<"Popular" | "Rating" | "Title">("Popular");

  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  // Check URL parameters on mount/update
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const filterParam = searchParams.get("filter");

    if (genreParam && allGenres.includes(genreParam)) {
      setSelectedGenres([genreParam]);
    } else {
      setSelectedGenres([]);
    }

    if (filterParam === "bookmarks" || filterParam === "history") {
      setSearchQuery("");
      setSelectedStatus("All");
    }
  }, [searchParams]);

  // Debounced search logic to query MangaDex proxy API
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const queryList = await searchManga(
          searchQuery,
          selectedGenres,
          selectedStatus,
          sortBy,
          20
        );
        // Fallback to static mock filters if no query and API failed
        if (queryList.length === 0 && !searchQuery && selectedGenres.length === 0 && selectedStatus === "All") {
          setResults(mangaList);
        } else {
          setResults(queryList);
        }
      } catch (err) {
        console.error("Search failed, falling back to mock search", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce to prevent hammering api

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedGenres, selectedStatus, sortBy]);

  // Handle Genre Toggle
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Clear All Filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedStatus("All");
    setSortBy("Popular");
    router.replace("/search");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {searchParams.get("filter") === "bookmarks"
              ? "My Bookmarks"
              : searchParams.get("filter") === "history"
              ? "Reading History"
              : "Explore Library"}
          </h1>
          <p className="text-sm text-foreground/50 font-medium">
            Browse through our premium database of curated mangas.
          </p>
        </div>

        {/* Clear Filters Indicator */}
        {(searchQuery || selectedGenres.length > 0 || selectedStatus !== "All" || sortBy !== "Popular") && (
          <button
            onClick={clearFilters}
            className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/15  text-red-400 border border-red-500/20 transition-all flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-white/5 shadow-inner">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, author, description..."
          className="w-full pl-13 pr-6 py-4 bg-transparent text-sm font-medium text-foreground focus:outline-hidden placeholder:text-foreground/30"
        />
      </div>

      {/* Advanced Filters Drawer */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
        {/* Genre Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold tracking-widest text-foreground/40 uppercase">
            Filter Genres
          </label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => {
              const isActive = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                    isActive
                      ? "bg-gradient-premium border-transparent text-white shadow-md shadow-orange-500/15"
                      : "bg-white/5 border-white/10 hover:border-white/20 text-foreground/70"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row Filters: Status and Sorting */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Status */}
          <div className="flex-1 space-y-3">
            <label className="text-xs font-bold tracking-widest text-foreground/40 uppercase block">
              Manga Status
            </label>
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
              {(["All", "Ongoing", "Completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStatus === status
                      ? "bg-white/10 text-white shadow-xs"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-widest text-foreground/40 uppercase block">
              Sort Results By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-foreground focus:outline-hidden focus:border-orange-500 cursor-pointer"
              >
                <option value="Popular">Most Popular</option>
                <option value="Rating">Highest Rated</option>
                <option value="Title">Alphabetical</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Result Output */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider">
            Found {results.length} results
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full h-[360px] rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-end p-4 gap-3">
                <div className="h-4 bg-white/10 rounded-md w-3/4"></div>
                <div className="h-3 bg-white/10 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 animate-fade-in">
            {results.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl glass-panel border border-white/5 flex flex-col items-center justify-center gap-3">
            <Info className="w-10 h-10 text-orange-400" />
            <h3 className="text-base font-bold text-foreground">No matches found</h3>
            <p className="text-xs text-foreground/40 max-w-xs font-medium">
              We couldn&apos;t find any manga fitting those filters. Try searching for something else or clearing the filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-premium text-white shadow-md active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-t-orange-500 border-white/10 animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
