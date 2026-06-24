"use client";

import React from "react";
import Link from "next/link";
import { Star, Eye } from "lucide-react";
import { Manga } from "@/lib/mangaData";

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  // Safe mapping of gradients based on ID for fallback covers if image files aren't ready
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
        return "from-fuchsia-950 via-[#4A0E4E] to-[#7A1F7C]";
    }
  };

  return (
    <Link
      href={`/manga/${manga.id}`}
      className="group relative flex flex-col w-full h-[360px] rounded-2xl overflow-hidden glass-panel border border-white/5 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Cover Image or Fallback Mesh */}
      <div className="absolute inset-0 w-full h-full bg-zinc-950">
        {/* We combine a CSS Mesh Gradient as the backdrop, and place the cover on top.
            This creates a beautiful pre-loader/fallback experience. */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(manga.id)} opacity-90`} />
        
        {/* Actual Image (Once generated, this displays. For now, the stylized meshes act as the cover artwork backdrop) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={manga.coverUrl}
          alt={manga.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // If the physical image file is not found yet, keep opacity 0 to show the stylized gradient mesh
            e.currentTarget.style.opacity = "0";
          }}
          onLoad={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        />

        {/* Soft shadow vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Badges (Top) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase glass-panel text-white bg-black/40 backdrop-blur-md">
          {manga.status}
        </span>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-panel text-amber-400 bg-black/40 backdrop-blur-md">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{manga.rating.toFixed(2)}</span>
        </div>
      </div>

      {/* Info Block (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col justify-end">
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-2">
          {manga.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[9px] font-semibold text-white/70 px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-tight group-hover:text-orange-400 transition-colors line-clamp-1">
          {manga.title}
        </h3>

        {/* Author / Artist */}
        <p className="text-xs text-white/50 mt-0.5 font-medium line-clamp-1">
          By {manga.author}
        </p>

        {/* Dynamic Hover Detail */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-semibold text-orange-400 flex items-center gap-1">
            Read Now →
          </span>
          <span className="text-[9px] text-white/40 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {manga.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
