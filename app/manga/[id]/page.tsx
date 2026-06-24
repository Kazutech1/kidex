"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mangaList, Manga } from "@/lib/mangaData";
import { fetchMangaDetails } from "@/lib/mangadex";
import {
  Star,
  Eye,
  BookOpen,
  Calendar,
  Heart,
  Bookmark,
  ChevronRight,
  MessageSquare,
  Users,
  BookmarkCheck
} from "lucide-react";

export default function MangaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [manga, setManga] = useState<Manga | null>(null);
  const [activeTab, setActiveTab] = useState<"chapters" | "characters" | "comments">("chapters");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    
    async function loadManga() {
      setLoading(true);
      try {
        const idStr = (Array.isArray(params.id) ? params.id[0] : params.id) || "";
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr);
        
        if (isUuid) {
          const liveManga = await fetchMangaDetails(idStr);
          if (liveManga) {
            setManga(liveManga);
            const likesMap: Record<string, number> = {};
            liveManga.comments.forEach((c) => {
              likesMap[c.id] = c.likes;
            });
            setLikesCount(likesMap);
          }
        } else {
          // Fallback to local database if slug matching static titles
          const localManga = mangaList.find((m) => m.id === idStr);
          if (localManga) {
            setManga(localManga);
            const likesMap: Record<string, number> = {};
            localManga.comments.forEach((c) => {
              likesMap[c.id] = c.likes;
            });
            setLikesCount(likesMap);
            setIsBookmarked(localManga.continueProgress !== undefined);
          }
        }
      } catch (err) {
        console.error("Failed to load details page", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadManga();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-orange-500 border-white/10 animate-spin"></div>
        <p className="text-sm text-foreground/50">Loading manga details...</p>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-lg font-bold">Manga Not Found</h2>
        <p className="text-sm text-foreground/50">We couldn&apos;t load details for this title.</p>
        <Link href="/" className="px-4 py-2 bg-gradient-premium rounded-xl text-xs font-bold text-white">
          Back Home
        </Link>
      </div>
    );
  }

  // Fallback banners styling mapping
  const getBannerGradient = (id: string) => {
    switch (id) {
      case "shadows-edge":
        return "from-[#8E2DE2]/20 via-[#4A00E0]/10 to-zinc-950/90";
      case "neo-tokyo-2099":
        return "from-indigo-600/20 via-indigo-950/10 to-zinc-950/90";
      default:
        return "from-orange-800/20 via-orange-950/10 to-zinc-950/90";
    }
  };

  const getFallbackGradient = (id: string) => {
    switch (id) {
      case "shadows-edge":
        return "from-slate-900 via-[#18122B] to-[#392467]";
      case "neo-tokyo-2099":
        return "from-indigo-950 via-[#0B2447] to-[#19376D]";
      case "whispers-of-autumn":
        return "from-orange-950 via-[#4E3629] to-[#765827]";
      case "chronicles-of-the-wind-king":
        return "from-cyan-950 via-[#176B87] to-[#64CCC5]";
      case "the-last-detective":
        return "from-zinc-900 via-[#1C1F26] to-[#3A4750]";
      default:
        return "from-stone-900 via-[#ea580c]/10 to-stone-950";
    }
  };

  const handleLike = (commentId: string) => {
    setLikesCount((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1
    }));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Backdrop Glow Container */}
      <div className="absolute inset-x-0 top-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <div className={`absolute inset-0 bg-gradient-to-b ${getBannerGradient(manga.id)}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={manga.coverUrl}
          alt={manga.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-15 filter blur-3xl scale-120 transform saturate-150"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* Breadcrumb path navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/40 relative z-10 w-full max-w-full overflow-hidden min-w-0">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/search" className="hover:text-foreground transition-colors">Manga</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground/75 truncate">{manga.title}</span>
      </div>

      {/* 2. Manga Info Header Card */}
      <section className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end w-full max-w-full overflow-hidden">
        {/* Cover image wrap */}
        <div className="w-48 sm:w-56 h-[290px] sm:h-[330px] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative shrink-0 mx-auto md:mx-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(manga.id)}`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={manga.coverUrl}
            alt={manga.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
            onLoad={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          />
        </div>

        {/* Text descriptions */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          {/* Status & Genres */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
              {manga.status}
            </span>
            {manga.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-panel text-foreground/70"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title & Creators */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {manga.title}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/50 font-medium">
              Written by <span className="text-foreground/90 font-semibold">{manga.author}</span> • Illustrated by <span className="text-foreground/90 font-semibold">{manga.artist}</span>
            </p>
          </div>

          {/* Statistics Block */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6 py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl glass-panel border border-white/5 w-fit mx-auto md:mx-0">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <div className="text-left">
                <p className="text-xs font-black text-white leading-none">
                  {manga.rating.toFixed(2)}
                </p>
                <p className="text-[9px] font-bold text-foreground/30 uppercase mt-0.5">
                  Rating
                </p>
              </div>
            </div>
            {/* Views */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 sm:pl-6">
              <Eye className="w-4 h-4 text-orange-400" />
              <div className="text-left">
                <p className="text-xs font-black text-white leading-none">
                  {manga.views}
                </p>
                <p className="text-[9px] font-bold text-foreground/30 uppercase mt-0.5">
                  Follows
                </p>
              </div>
            </div>
            {/* Chapters */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 sm:pl-6">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <div className="text-left">
                <p className="text-xs font-black text-white leading-none">
                  {manga.chapters.length}
                </p>
                <p className="text-[9px] font-bold text-foreground/30 uppercase mt-0.5">
                  Chapters
                </p>
              </div>
            </div>
          </div>

          {/* User Interaction Actions */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {manga.chapters.length > 0 && (
              <Link
                href={`/manga/${manga.id}/read/${manga.chapters[manga.chapters.length - 1].id}`}
                className="px-6 py-3 rounded-2xl bg-gradient-premium hover:opacity-95 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Read First Chapter
              </Link>
            )}

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border active:scale-98 transition-all backdrop-blur-md ${
                isBookmarked
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/15"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-orange-400" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Manga Synopsis description */}
      <section className="relative z-10 p-6 rounded-3xl glass-panel border border-white/5 space-y-3 w-full max-w-full overflow-hidden">
        <h2 className="text-sm font-black tracking-widest uppercase text-foreground/45">
          Synopsis
        </h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-medium">
          {manga.description}
        </p>
      </section>

      {/* 4. Tab selectors (Chapters, Characters, Reviews) */}
      <section className="relative z-10 space-y-6 w-full max-w-full overflow-hidden">
        {/* Apple Segmented Controls */}
        <div className="flex overflow-x-auto no-scrollbar max-w-full p-1 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-fit whitespace-nowrap">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              activeTab === "chapters"
                ? "bg-white/10 text-white shadow-xs"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            Chapters ({manga.chapters.length})
          </button>
          <button
            onClick={() => setActiveTab("characters")}
            className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              activeTab === "characters"
                ? "bg-white/10 text-white shadow-xs"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            Characters ({manga.characters.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              activeTab === "comments"
                ? "bg-white/10 text-white shadow-xs"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            Comments ({manga.comments.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="transition-all duration-300">
          {/* Tab 1: Chapters List */}
          {activeTab === "chapters" && (
            manga.chapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {manga.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${manga.id}/read/${chapter.id}`}
                    className="group flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/5 hover:border-orange-500/20 hover:bg-white/5 transition-all"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-orange-400 transition-colors line-clamp-1">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {chapter.date}
                        </span>
                        {chapter.pages.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{chapter.pages.length} Pages</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-400 group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5 shrink-0">
                      Read →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center glass-panel border border-white/5 rounded-2xl">
                <p className="text-xs text-foreground/40 font-medium">No English translations released for this title yet.</p>
              </div>
            )
          )}

          {/* Tab 2: Character scroller */}
          {activeTab === "characters" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
              {manga.characters.map((char) => (
                <div
                  key={char.name}
                  className="p-4 rounded-2xl glass-panel border border-white/5 text-center flex flex-col items-center gap-3 group hover:border-orange-500/10 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-orange-900 to-indigo-950 flex items-center justify-center border-2 border-white/5 shadow-md shrink-0 relative">
                    <span className="text-2xl">👤</span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground">{char.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/5 border border-white/5 text-foreground/40">
                      {char.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Discussion Comments */}
          {activeTab === "comments" && (
            <div className="space-y-4 animate-fade-in">
              {manga.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3 flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg shadow-inner shrink-0">
                    {comment.avatar}
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground">{comment.user}</h4>
                      <span className="text-[10px] text-foreground/30 font-semibold">{comment.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
                      {comment.content}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/5 text-foreground/60 hover:text-white transition-all animate-none"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500/10 text-foreground/40 hover:text-red-500" />
                        <span>{likesCount[comment.id] || 0} Likes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
