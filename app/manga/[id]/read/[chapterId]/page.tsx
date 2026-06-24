"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mangaList, readerThemes, Manga, Chapter, ChapterPage } from "@/lib/mangaData";
import { fetchChapterPages, fetchMangaChapters } from "@/lib/mangadex";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  EyeOff,
  ArrowLeft,
  MessageSquare,
  Undo
} from "lucide-react";

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  
  // Settings States
  const [readMode, setReadMode] = useState<"webtoon" | "manga">("webtoon");
  const [themeId, setThemeId] = useState<string>("dark");
  const [zoomLevel, setZoomLevel] = useState<number>(100); // percent width (50% to 100%) - defaults to 100% full screen
  const [zenMode, setZenMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Navigation States
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // for horizontal manga mode
  const [loading, setLoading] = useState(true);
  
  // DOM Refs
  const readerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringControlsRef = useRef<boolean>(false);

  useEffect(() => {
    if (!params?.id || !params?.chapterId) return;

    async function loadReaderData() {
      setLoading(true);
      try {
        const idStr = (Array.isArray(params.id) ? params.id[0] : params.id) || "";
        const chapIdStr = (Array.isArray(params.chapterId) ? params.chapterId[0] : params.chapterId) || "";
        
        const isMangaUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr);
        const isChapterUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chapIdStr);

        let activeManga: Manga | null = null;
        let activeChapters: Chapter[] = [];
        let activePages: ChapterPage[] = [];
        let activeChapter: Chapter | null = null;

        if (isMangaUuid) {
          // Live MangaDetails fetch
          const res = await fetch(`/api/mangadex/manga/${idStr}?includes[]=cover_art&includes[]=author&includes[]=artist`);
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              const attrs = data.data.attributes;
              activeManga = {
                id: data.data.id,
                title: attrs.title?.en || "Untitled Live Manga",
                author: "MangaDex",
                artist: "MangaDex",
                rating: 4.8,
                status: attrs.status === "ongoing" ? "Ongoing" : "Completed",
                views: "Live",
                description: attrs.description?.en || "",
                coverUrl: "",
                bannerUrl: "",
                genres: [],
                chapters: [],
                characters: [],
                comments: []
              };
            }
          }
          activeChapters = await fetchMangaChapters(idStr);
        } else {
          // Fallback to local
          const found = mangaList.find((m) => m.id === idStr);
          if (found) {
            activeManga = found;
            activeChapters = found.chapters;
          }
        }

        if (isChapterUuid) {
          // Live Chapter pages fetch
          activePages = await fetchChapterPages(chapIdStr);
          const matchedChap = activeChapters.find((c) => c.id === chapIdStr);
          activeChapter = matchedChap || {
            id: chapIdStr,
            title: `Chapter ${chapIdStr.slice(0, 8)}`,
            date: "Today",
            pages: activePages
          };
        } else {
          // Local chapter load
          if (activeManga) {
            const foundChap = activeManga.chapters.find((c) => c.id === chapIdStr);
            if (foundChap) {
              activeChapter = foundChap;
              activePages = foundChap.pages;
            }
          }
        }

        if (activeManga && activeChapter) {
          setManga(activeManga);
          setChaptersList(activeChapters);
          setChapter(activeChapter);
          setPages(activePages);
          setCurrentPageIndex(0);
          setShowControls(true);
        }
      } catch (err) {
        console.error("Failed to load reader information", err);
      } finally {
        setLoading(false);
      }
    }

    loadReaderData();
  }, [params?.id, params?.chapterId]);

  // Auto-hide controls on mouse idle or show on mouse movement/hover
  useEffect(() => {
    if (zenMode) return;

    const handleMouseMove = () => {
      setShowControls(true);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      if (isHoveringControlsRef.current || showSettings) {
        return;
      }

      inactivityTimerRef.current = setTimeout(() => {
        if (!isHoveringControlsRef.current && !showSettings) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [zenMode, showSettings]);

  if (loading || !manga || !chapter) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-orange-500 border-white/10 animate-spin"></div>
        <p className="text-sm text-foreground/50">Loading reader panels...</p>
      </div>
    );
  }

  // Get active theme style
  const activeTheme = readerThemes.find((t) => t.id === themeId) || readerThemes[0];

  // Index of current chapter
  const currentChapterIndex = chaptersList.findIndex((c) => c.id === chapter.id);
  // In descending array order (newest chapters are index 0)
  const prevChapter = chaptersList[currentChapterIndex + 1];
  const nextChapter = chaptersList[currentChapterIndex - 1];

  const navigateToChapter = (chapId: string) => {
    router.push(`/manga/${manga.id}/read/${chapId}`);
  };

  // Toggle Controls handler
  const toggleControls = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".interactive-control")) return;
    setShowControls((prev) => !prev);
  };

  // Manga Mode Pagination
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    } else if (prevChapter) {
      if (confirm("Go to the previous chapter?")) {
        router.push(`/manga/${manga.id}/read/${prevChapter.id}`);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else if (nextChapter) {
      if (confirm("Go to the next chapter?")) {
        router.push(`/manga/${manga.id}/read/${nextChapter.id}`);
      }
    }
  };

  // Helper for stylized panels matching the mood
  const getPanelGradients = (colorTag: string) => {
    if (colorTag.includes("dark-1")) return "from-zinc-900 to-zinc-950 border-orange-500/20";
    if (colorTag.includes("dark-2")) return "from-slate-900 to-slate-950 border-indigo-500/20";
    if (colorTag.includes("dark-3")) return "from-orange-950 to-zinc-900 border-pink-500/20";
    if (colorTag.includes("dark-4")) return "from-zinc-900 via-[#1C1A27] to-zinc-950 border-violet-500/25";

    if (colorTag.includes("cyber-1")) return "from-zinc-950 via-[#0B1A30] to-zinc-950 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]";
    if (colorTag.includes("cyber-2")) return "from-zinc-950 via-[#150F30] to-zinc-950 border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)]";
    if (colorTag.includes("cyber-3")) return "from-zinc-950 via-[#072F30] to-zinc-950 border-teal-500/30";
    if (colorTag.includes("cyber-4")) return "from-zinc-950 via-[#270F30] to-zinc-950 border-pink-500/30";

    return "from-orange-950/60 to-zinc-900 border-amber-500/20";
  };

  // Helper for dialog positions to make comics dynamic
  const getBubblePosition = (idx: number) => {
    switch (idx) {
      case 0: return "top-8 left-8 text-left";
      case 1: return "bottom-8 right-8 text-right";
      case 2: return "top-8 right-8 text-left";
      default: return "bottom-8 left-8 text-left";
    }
  };

  // Renders a high-fidelity comic panel
  const renderComicPanel = (page: ChapterPage) => {
    const isDarkBg = themeId === "dark" || themeId === "pitch";
    return (
      <div
        key={page.pageNumber}
        className={`w-full aspect-[3/4] sm:aspect-[2/3] rounded-2xl border-4 relative overflow-hidden bg-gradient-to-br ${getPanelGradients(
          page.imageUrl
        )} flex flex-col justify-between p-6 sm:p-10 select-none shadow-2xl`}
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 opacity-10 pointer-events-none">
          <div className="border-r border-b border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-r border-white"></div>
          <div></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-wider text-white/30">
          Page {page.pageNumber} • Panel #{page.pageNumber * 2}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white/3 opacity-[0.04] uppercase pointer-events-none select-none tracking-tighter">
          {manga.title.split(" ")[0]}
        </div>

        {page.dialogue && (
          <div className={`absolute max-w-[70%] sm:max-w-[50%] p-4 rounded-3xl text-xs font-bold leading-normal shadow-lg ${getBubblePosition(page.pageNumber % 4)} ${
            isDarkBg 
              ? "bg-white text-zinc-950 border border-zinc-200" 
              : "bg-zinc-900 text-white border border-zinc-800"
          } transition-all duration-300 transform scale-95 hover:scale-100 z-10`}>
            <div className={`absolute w-3 h-3 rotate-45 ${
              isDarkBg ? "bg-white" : "bg-zinc-900"
            } ${
              getBubblePosition(page.pageNumber % 4).includes("top-8") 
                ? "-bottom-1.5 left-6" 
                : "-top-1.5 right-6"
            }`} />
            {page.dialogue}
          </div>
        )}

        <div className="absolute top-1/3 right-12 text-3xl sm:text-4xl font-extrabold italic text-orange-400/30 uppercase tracking-widest pointer-events-none select-none transform rotate-12">
          {page.pageNumber === 1 ? "WHOOSH" : page.pageNumber === 2 ? "GASP!" : page.pageNumber === 3 ? "SHATTER" : "THUD!"}
        </div>

        <div className="mt-auto flex items-end justify-between relative z-10">
          <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">
            {manga.title} Chapter {chapter.title}
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/10 text-white border border-white/10 backdrop-blur-md">
            P.{page.pageNumber}
          </div>
        </div>
      </div>
    );
  };

  // Top level renderer routing real image feeds vs mock graphics
  const drawPage = (page: ChapterPage) => {
    if (page.imageUrl.startsWith("http")) {
      return (
        <div key={page.pageNumber} className="relative w-full bg-zinc-950 flex justify-center p-0 m-0 border-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrl}
            alt={`Page ${page.pageNumber}`}
            referrerPolicy="no-referrer"
            className="w-full object-contain select-none p-0 m-0 border-0"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      );
    }
    return (
      <div key={page.pageNumber} className="py-2 px-2 sm:py-4 sm:px-4 w-full flex justify-center interactive-control">
        {renderComicPanel(page)}
      </div>
    );
  };

  return (
    <div
      onClick={toggleControls}
      className={`min-h-screen w-full flex flex-col items-center justify-start relative select-none cursor-pointer overflow-x-hidden ${activeTheme.bg} ${activeTheme.text} transition-colors duration-300`}
    >
      {/* 1. Header controls (Top Overlay Bar) */}
      <div
        onMouseEnter={() => { isHoveringControlsRef.current = true; setShowControls(true); }}
        onMouseLeave={() => { isHoveringControlsRef.current = false; }}
        className={`fixed top-0 left-0 right-0 z-50 glass-navbar px-3 py-3 md:px-6 md:py-4 flex flex-col gap-2 transition-all duration-300 ease-in-out interactive-control shadow-md ${
          showControls && !zenMode ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-row items-center justify-between gap-2">
          {/* Back to Manga Details */}
          <div className="flex items-center gap-2 max-w-[35%] sm:max-w-[45%]">
            <Link
              href={`/manga/${manga.id}`}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all flex items-center gap-1 active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">Back</span>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-foreground truncate">{manga.title}</h1>
              <p className="text-[10px] sm:text-xs text-foreground/40 font-semibold truncate">{chapter.title}</p>
            </div>
          </div>

          {/* Navigation Controls & Dropdowns */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-end shrink-0">
            {/* Previous Chapter */}
            <button
              onClick={(e) => { e.stopPropagation(); prevChapter && navigateToChapter(prevChapter.id); }}
              disabled={!prevChapter}
              className={`p-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
                prevChapter
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Chapter Selection Dropdown */}
            {chaptersList.length > 0 && (
              <div className="relative shrink-0">
                <select
                  value={chapter.id}
                  onChange={(e) => { e.stopPropagation(); navigateToChapter(e.target.value); }}
                  className="appearance-none pr-8 pl-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-foreground focus:outline-hidden focus:border-orange-500 cursor-pointer max-w-[85px] xs:max-w-[110px] sm:max-w-[150px]"
                >
                  {chaptersList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title.length > 12 ? c.title.slice(0, 12) + "..." : c.title}
                    </option>
                  ))}
                </select>
                <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 -rotate-90 text-foreground/40 pointer-events-none" />
              </div>
            )}

            {/* Next Chapter */}
            <button
              onClick={(e) => { e.stopPropagation(); nextChapter && navigateToChapter(nextChapter.id); }}
              disabled={!nextChapter}
              className={`p-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
                nextChapter
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Control Panel Settings Trigger */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
              className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center shrink-0 ${
                showSettings
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-foreground"
              }`}
              title="Reader Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Zen Mode Trigger */}
            <button
              onClick={(e) => { e.stopPropagation(); setZenMode(true); }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all active:scale-95 hidden xs:flex items-center shrink-0"
              title="Zen Mode (Hide Overlays)"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Floating Settings panel (Nested in top bar) */}
        {showSettings && (
          <div className="max-w-7xl mx-auto w-full mt-2 p-3 sm:mt-3 sm:p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
            {/* Theme selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-widest text-foreground/45 uppercase block">
                Theme
              </label>
              <div className="grid grid-cols-4 gap-1">
                {readerThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={(e) => { e.stopPropagation(); setThemeId(t.id); }}
                    className={`py-1.5 px-0.5 rounded-lg text-[9px] font-bold border text-center transition-all ${
                      themeId === t.id
                        ? "border-orange-500 text-orange-400 bg-orange-500/5 shadow-xs"
                        : "bg-white/5 border-white/10 text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {t.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-widest text-foreground/45 uppercase block">
                Layout
              </label>
              <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); setReadMode("webtoon"); }}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                    readMode === "webtoon"
                      ? "bg-white/10 text-white"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  Scroll
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setReadMode("manga"); }}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                    readMode === "manga"
                      ? "bg-white/10 text-white"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  Slide
                </button>
              </div>
            </div>

            {/* Width selection */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-foreground/45 uppercase">
                <span>Width</span>
                <span className="text-foreground/60">{zoomLevel}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-foreground/30 font-bold">Slim</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={zoomLevel}
                  onChange={(e) => { e.stopPropagation(); setZoomLevel(parseInt(e.target.value)); }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-[9px] text-foreground/30 font-bold">Wide</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Immersive Bottom Bar Overlay */}
      <div
        onMouseEnter={() => { isHoveringControlsRef.current = true; setShowControls(true); }}
        onMouseLeave={() => { isHoveringControlsRef.current = false; }}
        className={`fixed bottom-0 left-0 right-0 z-50 glass-navbar px-4 py-3 md:px-6 md:py-4 flex items-center justify-between transition-all duration-300 ease-in-out interactive-control shadow-md ${
          showControls && !zenMode ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevPage(); }}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] sm:text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Chapter/Page</span>
            <span className="inline sm:hidden">Prev</span>
          </button>

          <span className="text-[10px] sm:text-xs font-bold text-foreground/50 tracking-wider truncate text-center max-w-[40%] sm:max-w-none">
            {readMode === "webtoon" ? (
              <>
                <span className="hidden xs:inline">Continuous Vertical Scroll</span>
                <span className="inline xs:hidden">Scroll Mode</span>
              </>
            ) : `Page ${currentPageIndex + 1} of ${pages.length}`}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); handleNextPage(); }}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] sm:text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 text-white"
          >
            <span className="hidden sm:inline">Next Chapter/Page</span>
            <span className="inline sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zen exit button */}
      {zenMode && (
        <button
          onClick={(e) => { e.stopPropagation(); setZenMode(false); }}
          className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-xs font-bold text-orange-400 hover:text-orange-300 transition-all flex items-center gap-1.5 active:scale-95 shadow-2xl interactive-control animate-fade-in"
        >
          <Undo className="w-3.5 h-3.5" />
          Exit Zen Mode
        </button>
      )}

      {/* 4. Full screen Manga Canvas */}
      {pages.length > 0 ? (
        <div
          ref={readerRef}
          className="w-full flex-1 flex flex-col items-center justify-start transition-all duration-500 py-0 max-md:!max-w-full"
          style={{
            maxWidth: `${zoomLevel}%`
          }}
        >
          {readMode === "webtoon" ? (
            /* Webtoon Vertical Layout scroll: Stack pages with zero padding, borders, gaps */
            <div className="w-full flex flex-col gap-0">
              {pages.map((page) => drawPage(page))}

              {/* End of Chapter Section */}
              <div className="py-24 text-center space-y-4 px-6 interactive-control">
                <h3 className="text-lg font-black tracking-tight">End of Chapter</h3>
                <p className="text-xs text-foreground/40 max-w-xs mx-auto font-medium">
                  You reached the end of this chapter. Continue onto the next release.
                </p>
                <div className="flex items-center justify-center gap-3">
                  {nextChapter ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateToChapter(nextChapter.id); }}
                      className="px-6 py-3 rounded-2xl bg-gradient-premium text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                    >
                      Next Chapter →
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-foreground/30 py-2">No newer chapters released.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Manga Page Sliding Mode */
            <div className="w-full h-full flex flex-col items-center justify-center py-10 px-4 md:px-0">
              {drawPage(pages[currentPageIndex])}
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel border border-white/5 rounded-3xl interactive-control">
          <p className="text-sm text-foreground/50">This chapter contains no pages to display.</p>
        </div>
      )}

      {/* 5. Compact Quick Comments Panel for interactive reading */}
      {showControls && !zenMode && (
        <section className="w-full max-w-7xl mx-auto px-6 py-8 interactive-control border-t border-white/5 mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4.5 h-4.5 text-orange-400" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-foreground/45">
              Chapter Discussions
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-lg">🤖</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-[11px] font-bold text-foreground">Reader_Guest</h4>
                  <span className="text-[9px] text-foreground/30">Just now</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-semibold">
                  This reader is incredible! The layouts are super responsive, and sepia theme makes reading in high bright environments very comfortable. Great UI!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
