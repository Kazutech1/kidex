import { Manga, Chapter, Character, Comment, ChapterPage } from "./mangaData";

const GENRE_MAP: Record<string, string> = {
  "Action": "391b0423-d847-456f-aff0-8b0cfc03066b",
  "Adventure": "87cef0a7-76fe-4562-b270-b087071f479e",
  "Romance": "423e2eae-977e-4143-ac72-9b2264883525",
  "Sci-Fi": "256c8064-7c8f-49c3-afc9-a481ee77ec15",
  "Drama": "b9a11145-d88d-4f19-8702-6bb3047b6d51",
  "Mystery": "ee96339f-2a40-438d-883a-507ff5067441",
  "Supernatural": "e5c7d17a-68de-4786-8f2d-c1017ecf2e33",
  "Psychological": "3b27de20-ae61-41d1-97b0-cfa94e8e1824",
  "Slice of Life": "e197df38-d0e7-43b5-9b09-2842d0302675",
  "Dark Fantasy": "cdc58593-87dd-415e-bbc0-2ec27bf404cc", // mapping Dark Fantasy to Fantasy in MangaDex
  "Shonen": "531fb4dc-e4ee-4821-9b70-f56e02cf153d", // Shonen demographic tag
  "Mecha": "50880a90-be15-4a52-bc7a-d0aa7022f860"
};

// Maps MangaDex api object to our unified front-end Manga interface
function mapMangaDexToManga(item: any): Manga {
  const attrs = item.attributes;
  
  // Find cover fileName in relationships
  const coverRelationship = item.relationships?.find((r: any) => r.type === "cover_art");
  const coverFileName = coverRelationship?.attributes?.fileName;
  const coverUrl = coverFileName 
    ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}.512.jpg`
    : "";

  // Find author/artist in relationships
  const authorRelationship = item.relationships?.find((r: any) => r.type === "author");
  const authorName = authorRelationship?.attributes?.name || "Unknown Author";

  const artistRelationship = item.relationships?.find((r: any) => r.type === "artist");
  const artistName = artistRelationship?.attributes?.name || authorName;

  // Extract genre list
  const genres = attrs.tags
    ?.filter((t: any) => t.attributes?.group === "genre" || t.attributes?.group === "theme")
    ?.map((t: any) => t.attributes?.name?.en)
    ?.filter(Boolean)
    .slice(0, 4) || [];

  // Generate views count from followed count
  const follows = attrs.followedCount || Math.floor(1000 + Math.random() * 250000);
  const views = follows >= 1000000 
    ? `${(follows / 1000000).toFixed(1)}M` 
    : follows >= 1000 
      ? `${(follows / 1000).toFixed(0)}K` 
      : `${follows}`;

  // Fallback rating
  const rating = 4.0 + (follows % 10) * 0.1;

  // Description (handling multiple languages)
  const description = attrs.description?.en || attrs.description?.[Object.keys(attrs.description || {})[0]] || "No description available.";

  // Dynamic mock characters based on genres
  const characters: Character[] = [
    { name: "Protagonist", role: "Main", imageUrl: "/images/characters/ren.png" },
    { name: "Companion", role: "Main", imageUrl: "/images/characters/sariel.png" },
    { name: "Mentor", role: "Supporting", imageUrl: "/images/characters/vance.png" }
  ];

  // Dynamic mock comments
  const comments: Comment[] = [
    { id: `${item.id}-c1`, user: "MangaDexReader", avatar: "🤖", content: "Highly recommend reading this series! The plot twist in chapter 5 is top notch.", date: "3 days ago", likes: 84 },
    { id: `${item.id}-c2`, user: "KidexFan", avatar: "🦊", content: "I love the art style here. Very clean scanlation too.", date: "1 week ago", likes: 32 }
  ];

  return {
    id: item.id,
    title: attrs.title?.en || attrs.title?.[Object.keys(attrs.title || {})[0]] || "Untitled Manga",
    author: authorName,
    artist: artistName,
    rating,
    status: attrs.status === "ongoing" ? "Ongoing" : "Completed",
    views,
    description,
    coverUrl,
    bannerUrl: coverUrl, // fallback to coverUrl as banner backdrop
    genres,
    chapters: [],
    characters,
    comments
  };
}

// 1. Fetch Trending Manga (for Hero & list shelves)
export async function fetchTrendingManga(limit = 10): Promise<Manga[]> {
  try {
    const res = await fetch(`/api/mangadex/manga?limit=${limit}&includes[]=cover_art&includes[]=author&includes[]=artist&order[followedCount]=desc&contentRating[]=safe&availableTranslatedLanguage[]=en`);
    if (!res.ok) throw new Error("Failed to fetch trending");
    const data = await res.json();
    return data.data?.map(mapMangaDexToManga) || [];
  } catch (error) {
    console.error("fetchTrendingManga error:", error);
    return [];
  }
}

// 2. Advanced Search & Filter manga
export async function searchManga(
  query: string,
  genres: string[],
  status: string,
  sortBy: string,
  limit = 15
): Promise<Manga[]> {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("includes[]", "cover_art");
    params.append("includes[]", "author");
    params.append("includes[]", "artist");
    params.append("contentRating[]", "safe");
    params.append("availableTranslatedLanguage[]", "en");

    if (query) {
      params.append("title", query);
    }

    if (status && status !== "All") {
      params.append("status[]", status.toLowerCase());
    }

    // Map genres to tags
    genres.forEach((genre) => {
      const tagId = GENRE_MAP[genre];
      if (tagId) {
        params.append("includedTags[]", tagId);
      }
    });

    // Sorting
    if (sortBy === "Popular") {
      params.append("order[followedCount]", "desc");
    } else if (sortBy === "Rating") {
      params.append("order[rating]", "desc");
    } else if (sortBy === "Title") {
      params.append("order[title]", "asc");
    }

    const res = await fetch(`/api/mangadex/manga?${params.toString()}`);
    if (!res.ok) throw new Error("Search request failed");
    const data = await res.json();
    return data.data?.map(mapMangaDexToManga) || [];
  } catch (error) {
    console.error("searchManga error:", error);
    return [];
  }
}

// 3. Fetch detailed manga by UUID
export async function fetchMangaDetails(id: string): Promise<Manga | null> {
  try {
    const res = await fetch(`/api/mangadex/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`);
    if (!res.ok) throw new Error("Failed to fetch details");
    const data = await res.json();
    if (!data.data) return null;
    
    const manga = mapMangaDexToManga(data.data);
    
    // Attach chapters list
    manga.chapters = await fetchMangaChapters(id);
    return manga;
  } catch (error) {
    console.error("fetchMangaDetails error:", error);
    return null;
  }
}

// 4. Fetch English chapters feed
export async function fetchMangaChapters(mangaId: string): Promise<Chapter[]> {
  try {
    const res = await fetch(`/api/mangadex/manga/${mangaId}/feed?translatedLanguage[]=en&limit=100&order[chapter]=desc&contentRating[]=safe`);
    if (!res.ok) throw new Error("Failed to fetch chapters feed");
    const data = await res.json();
    
    // Filter duplicates and map
    const chapterMap = new Map<string, any>();
    data.data?.forEach((chap: any) => {
      const num = chap.attributes.chapter || "0";
      // keep only one translation per chapter (prefer items with higher details/versions)
      if (!chapterMap.has(num)) {
        chapterMap.set(num, chap);
      }
    });

    const chaptersList = Array.from(chapterMap.values()).map((chap: any) => {
      const attrs = chap.attributes;
      const dateObj = new Date(attrs.publishAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      return {
        id: chap.id,
        title: attrs.chapter ? `Chapter ${attrs.chapter}${attrs.title ? `: ${attrs.title}` : ""}` : attrs.title || "Chapter Detail",
        date: formattedDate,
        pages: Array.from({ length: attrs.pages || 0 }, (_, i) => ({
          pageNumber: i + 1,
          imageUrl: "" // lazy resolved in reader
        }))
      };
    });

    // Sort chapters in descending order by parsing chapter number
    return chaptersList.sort((a, b) => {
      const getNum = (str: string) => {
        const match = str.match(/Chapter\s+([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
      };
      return getNum(b.title) - getNum(a.title);
    });
  } catch (error) {
    console.error("fetchMangaChapters error:", error);
    return [];
  }
}

// 5. Fetch chapter pages from MangaDex@Home server
export async function fetchChapterPages(chapterId: string): Promise<ChapterPage[]> {
  try {
    const res = await fetch(`/api/mangadex/at-home/server/${chapterId}`);
    if (!res.ok) throw new Error("Failed to load chapter server");
    const data = await res.json();
    
    if (!data.baseUrl || !data.chapter?.data) {
      throw new Error("Invalid at-home response");
    }

    const { baseUrl, chapter } = data;
    
    // Construct page lists
    return chapter.data.map((fileName: string, idx: number) => ({
      pageNumber: idx + 1,
      imageUrl: `${baseUrl}/data/${chapter.hash}/${fileName}`,
      dialogue: "" // Live images don't require mock dialogue overlays
    }));
  } catch (error) {
    console.error("fetchChapterPages error:", error);
    return [];
  }
}
