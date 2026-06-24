export interface Character {
  name: string;
  role: "Main" | "Supporting";
  imageUrl: string;
}

export interface ChapterPage {
  pageNumber: number;
  imageUrl: string;
  dialogue?: string;
  panelStyle?: string; // CSS styling configurations for creative look
}

export interface Chapter {
  id: string;
  title: string;
  date: string;
  pages: ChapterPage[];
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  artist: string;
  rating: number;
  status: "Ongoing" | "Completed";
  views: string;
  description: string;
  coverUrl: string;
  bannerUrl: string;
  genres: string[];
  chapters: Chapter[];
  characters: Character[];
  comments: Comment[];
  isFeatured?: boolean;
  continueProgress?: number; // percentage read, if started
  continueChapter?: string;  // e.g. "Chapter 12"
}

export const mangaList: Manga[] = [
  {
    id: "shadows-edge",
    title: "Shadow's Edge",
    author: "Kyohei Takahashi",
    artist: "Takeshi Obata",
    rating: 4.9,
    status: "Ongoing",
    views: "1.2M",
    description: "In a world swallowed by eternal darkness, humanity clings to survival inside walled cities lit by artificial suns. Ren, a rogue scavenger, stumbles upon the 'Shadow's Edge'—a legendary blade that eats shadow-beasts and grants the user forbidden abilities. But as Ren's power grows, he realizes the weapon is slowly consuming his own soul.",
    coverUrl: "/images/covers/shadows-edge.png",
    bannerUrl: "/images/banners/shadows-edge-banner.png",
    genres: ["Action", "Dark Fantasy", "Supernatural", "Shonen"],
    isFeatured: true,
    continueProgress: 75,
    continueChapter: "Chapter 3",
    characters: [
      { name: "Ren", role: "Main", imageUrl: "/images/characters/ren.webp" },
      { name: "Sariel", role: "Main", imageUrl: "/images/characters/sariel.webp" },
      { name: "Elder Vance", role: "Supporting", imageUrl: "/images/characters/vance.webp" },
      { name: "Kage", role: "Supporting", imageUrl: "/images/characters/kage.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "The Dying Light",
        date: "June 12, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-dark-1", dialogue: "In the beginning, there was light... and then, the shadows learned to hunt." },
          { pageNumber: 2, imageUrl: "gradient-dark-2", dialogue: " scavengers like me don't seek glory. We seek battery cells to live another day." },
          { pageNumber: 3, imageUrl: "gradient-dark-3", dialogue: "Wait... what's that glow under the obsidian rubble?" },
          { pageNumber: 4, imageUrl: "gradient-dark-4", dialogue: "CRACK! The seal is broken. The blade speaks: 'Who dares awaken the end?'" }
        ]
      },
      {
        id: "ch-2",
        title: "Blood of the Eclipse",
        date: "June 18, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-dark-2", dialogue: "The sword binds to my flesh. I can feel its cold pulse running up my arm." },
          { pageNumber: 2, imageUrl: "gradient-dark-3", dialogue: "'Look out, Ren! A Lurker is dropping from the rafters!'" },
          { pageNumber: 3, imageUrl: "gradient-dark-4", dialogue: "With a single swing, the shadow splits. No blood... only void." },
          { pageNumber: 4, imageUrl: "gradient-dark-1", dialogue: "But the blade demands more. 'Feast,' it whispers. 'FEAST!'" }
        ]
      },
      {
        id: "ch-3",
        title: "The Iron Sanctum",
        date: "June 24, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-dark-3", dialogue: "We reached the gates of the Sanctum. The sentries have their pulse bows drawn." },
          { pageNumber: 2, imageUrl: "gradient-dark-4", dialogue: "'Identify yourself, scavenger, or be purged!'" },
          { pageNumber: 3, imageUrl: "gradient-dark-1", dialogue: "Ren hides the dark glow of the sword. 'Just a cargo run. Let us through.'" },
          { pageNumber: 4, imageUrl: "gradient-dark-2", dialogue: "Deep inside the sanctum, the alarms start to wail. They know what he brought in." }
        ]
      }
    ],
    comments: [
      { id: "c1", user: "GamerKen", avatar: "🤖", content: "This art is insane! The detail on the blade is top tier.", date: "2 hours ago", likes: 342 },
      { id: "c2", user: "MangaLover99", avatar: "🦊", content: "Ren is already such a badass protagonist. Hope Sariel gets more screentime.", date: "5 hours ago", likes: 112 },
      { id: "c3", user: "Lurker_404", avatar: "👻", content: "The atmosphere reminds me of a blend of Berserk and Solo Leveling. I'm hooked!", date: "1 day ago", likes: 58 }
    ]
  },
  {
    id: "neo-tokyo-2099",
    title: "Neo Tokyo 2099",
    author: "Shinji Mikami",
    artist: "Yusuke Murata",
    rating: 4.8,
    status: "Ongoing",
    views: "980K",
    description: "In the neon-drenched skies of Neo Tokyo, cybernetic enhancements are mandatory to compete. Luna, a street-racer with outdated chrome, gets tangled up in a corporate heist when a datadrive containing files on the city's corrupt oligarchy is stored in her cybernetic eye. Now, every mercenary and corporate ninja is tracking her down.",
    coverUrl: "/images/covers/neo-tokyo-2099.png",
    bannerUrl: "/images/banners/neo-tokyo-2099-banner.png",
    genres: ["Sci-Fi", "Cyberpunk", "Action", "Mecha"],
    continueProgress: 20,
    continueChapter: "Chapter 1",
    characters: [
      { name: "Luna", role: "Main", imageUrl: "/images/characters/luna.webp" },
      { name: "Jax", role: "Main", imageUrl: "/images/characters/jax.webp" },
      { name: "Director Tanaka", role: "Supporting", imageUrl: "/images/characters/tanaka.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "Neon Overdrive",
        date: "May 29, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-cyber-1", dialogue: "In 2099, the sky isn't blue. It's a billboard advertising digital heaven." },
          { pageNumber: 2, imageUrl: "gradient-cyber-2", dialogue: "My eye feels warm. The data transfer finished, but who sent it?" },
          { pageNumber: 3, imageUrl: "gradient-cyber-3", dialogue: "Tires screeching. 'They found us, Luna! Floor it!'" },
          { pageNumber: 4, imageUrl: "gradient-cyber-4", dialogue: "A plasma blast melts the dashboard. The chase is on." }
        ]
      },
      {
        id: "ch-2",
        title: "The Megacorp Heist",
        date: "June 10, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-cyber-2", dialogue: "Jax patch-wired the drive. 'This is Arasaka-level black file stuff, Luna.'" },
          { pageNumber: 2, imageUrl: "gradient-cyber-3", dialogue: "Suddenly, the lights cut. Monomolecular wires spark in the dark." },
          { pageNumber: 3, imageUrl: "gradient-cyber-4", dialogue: "A corporate assassin drops: 'Return the asset, street rat.'" },
          { pageNumber: 4, imageUrl: "gradient-cyber-1", dialogue: "Luna grins, revving her cybernetic arm. 'Come and get it!'" }
        ]
      }
    ],
    comments: [
      { id: "nc1", user: "CyberPunked", avatar: "🦾", content: "The cybernetic details are breathtaking. I need an anime adaptation ASAP!", date: "3 days ago", likes: 231 },
      { id: "nc2", user: "RetroFuture", avatar: "🏍️", content: "The speedlines in the racing panels! Yusuke Murata does it again.", date: "1 week ago", likes: 89 }
    ]
  },
  {
    id: "whispers-of-autumn",
    title: "Whispers of Autumn",
    author: "Yuki Urushibara",
    artist: "Yuki Urushibara",
    rating: 4.7,
    status: "Completed",
    views: "540K",
    description: "A calming slice-of-life romance following Haru, a traditional tea-maker, and Aki, a bustling urban landscape architect. When Aki relocates to Haru's quiet mountain village to restore a historic garden, their contrasting paces of life clash, then gently weave together under the falling autumn leaves.",
    coverUrl: "/images/covers/whispers-of-autumn.webp",
    bannerUrl: "/images/banners/whispers-of-autumn-banner.webp",
    genres: ["Romance", "Slice of Life", "Drama"],
    characters: [
      { name: "Haru", role: "Main", imageUrl: "/images/characters/haru.webp" },
      { name: "Aki", role: "Main", imageUrl: "/images/characters/aki.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "The Fallen Leaf",
        date: "April 1, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-warm-1", dialogue: "The wind brings the scent of roasted green tea and damp cedar." },
          { pageNumber: 2, imageUrl: "gradient-warm-2", dialogue: "'Is this the old garden? It's completely overgrown...'" },
          { pageNumber: 3, imageUrl: "gradient-warm-3", dialogue: "Our eyes met across the bamboo fence. She had autumn leaves in her hair." },
          { pageNumber: 4, imageUrl: "gradient-warm-4", dialogue: "'Need some help?' I offered. She smiled, and the season changed." }
        ]
      }
    ],
    comments: [
      { id: "wo1", user: "SoftVibes", avatar: "🍁", content: "This is so soothing to read. Absolute therapeutic masterpiece.", date: "2 weeks ago", likes: 145 }
    ]
  },
  {
    id: "chronicles-of-the-wind-king",
    title: "Chronicles of the Wind King",
    author: "Eiichiro Oda",
    artist: "Kohei Horikoshi",
    rating: 4.95,
    status: "Ongoing",
    views: "2.4M",
    description: "Zephyr is a boy born in the Sky Islands who cannot bend the winds—a fatal flaw in a society that lives on floating rocks. Cast down to the dangerous, forgotten 'Under-World' below the clouds, Zephyr discovers that the surface is not empty, but filled with ancient elemental spirits that choose him to inherit the power of the Wind King.",
    coverUrl: "/images/covers/chronicles-of-the-wind-king.webp",
    bannerUrl: "/images/banners/chronicles-of-the-wind-king-banner.webp",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    characters: [
      { name: "Zephyr", role: "Main", imageUrl: "/images/characters/zephyr.webp" },
      { name: "Breeze", role: "Main", imageUrl: "/images/characters/breeze.webp" },
      { name: "Lord Tempest", role: "Supporting", imageUrl: "/images/characters/tempest.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "Cast Down",
        date: "May 10, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-sky-1", dialogue: "In the Sky Islands, if you cannot bend the air, you are dead weight." },
          { pageNumber: 2, imageUrl: "gradient-sky-2", dialogue: "'Zephyr, by decree of the High Council, you are exiled to the abyss!'" },
          { pageNumber: 3, imageUrl: "gradient-sky-3", dialogue: "Falling... falling through the clouds... The air rushes past, deafening." },
          { pageNumber: 4, imageUrl: "gradient-sky-4", dialogue: "I hit the soft forest canopy. The ground is solid. And something is watching." }
        ]
      }
    ],
    comments: [
      { id: "wk1", user: "AdventureAwaits", avatar: "🦅", content: "The world-building is huge! Surpassing the clouds is such a cool concept.", date: "1 month ago", likes: 512 }
    ]
  },
  {
    id: "the-last-detective",
    title: "The Last Detective",
    author: "Naoki Urasawa",
    artist: "Naoki Urasawa",
    rating: 4.88,
    status: "Completed",
    views: "810K",
    description: "A psychological mystery thriller set in a futuristic neo-noir metropolis. Detective Roy is the last human inspector in an agency run entirely by predictive AI algorithms. When a series of bizarre murders occurs that the AI fails to predict or solve, Roy must go old-school to track down an elusive killer who leaves handwritten notes.",
    coverUrl: "/images/covers/the-last-detective.webp",
    bannerUrl: "/images/banners/the-last-detective-banner.webp",
    genres: ["Mystery", "Psychological", "Drama", "Sci-Fi"],
    characters: [
      { name: "Roy", role: "Main", imageUrl: "/images/characters/roy.webp" },
      { name: "AI Unit 7", role: "Main", imageUrl: "/images/characters/ai7.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "Anomaly 0x00",
        date: "March 15, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-detective-1", dialogue: "AI predicted 0.003% crime rate tonight. The AI was wrong." },
          { pageNumber: 2, imageUrl: "gradient-detective-2", dialogue: "Victim is a high-ranking synth developer. No trace digital footprints." },
          { pageNumber: 3, imageUrl: "gradient-detective-3", dialogue: "Under the victim's collar... a physical slip of paper. Ink." },
          { pageNumber: 4, imageUrl: "gradient-detective-4", dialogue: "'I think, therefore I murder. Find me, detective.'" }
        ]
      }
    ],
    comments: [
      { id: "td1", user: "SherlockClone", avatar: "🔍", content: "This is a masterpiece in the making! Urasawa's face drawings are so detailed.", date: "3 weeks ago", likes: 219 }
    ]
  },
  {
    id: "starbound-voyager",
    title: "Starbound Voyager",
    author: "Makoto Yukimura",
    artist: "Makoto Yukimura",
    rating: 4.75,
    status: "Ongoing",
    views: "430K",
    description: "Centuries after leaving a dying Earth, a massive colony ship, the Ark-04, wanders the outer rim. Captain Arthur leads a misfit crew of miners and outcasts as they investigate a massive, hollow Dyson sphere that seems to share an uncanny connection to Earth's ancient mythologies.",
    coverUrl: "/images/covers/starbound-voyager.webp",
    bannerUrl: "/images/banners/starbound-voyager-banner.webp",
    genres: ["Sci-Fi", "Adventure", "Space"],
    characters: [
      { name: "Capt. Arthur", role: "Main", imageUrl: "/images/characters/arthur.webp" },
      { name: "Lyra", role: "Main", imageUrl: "/images/characters/lyra.webp" }
    ],
    chapters: [
      {
        id: "ch-1",
        title: "The Silent Megastructure",
        date: "June 5, 2026",
        pages: [
          { pageNumber: 1, imageUrl: "gradient-space-1", dialogue: "Earth is a distant myth. The stars are our only neighbors." },
          { pageNumber: 2, imageUrl: "gradient-space-2", dialogue: "'Captain, scanner telemetry is spiking. There's a structure ahead.'" },
          { pageNumber: 3, imageUrl: "gradient-space-3", dialogue: "It's a sphere... massive enough to swallow a sun, yet it is completely cold." },
          { pageNumber: 4, imageUrl: "gradient-space-4", dialogue: "'Prepare the boarding pod. Let's see what's inside.'" }
        ]
      }
    ],
    comments: [
      { id: "sv1", user: "CosmoFan", avatar: "🚀", content: "The sheer scale of the Dyson sphere is captured beautifully. Recommended!", date: "2 weeks ago", likes: 83 }
    ]
  }
];

export const allGenres = Array.from(
  new Set(mangaList.flatMap((manga) => manga.genres))
);

// Map of reader page background styles for dynamic rendering in components
export const readerThemes = [
  { id: "dark", name: "Slate Dark", bg: "bg-[#0f0f13]", text: "text-zinc-200", border: "border-white/10" },
  { id: "pitch", name: "Pitch Black", bg: "bg-black", text: "text-zinc-300", border: "border-zinc-800" },
  { id: "sepia", name: "Warm Sepia", bg: "bg-[#f4eedb]", text: "text-[#433422]", border: "border-[#e3d7bb]" },
  { id: "light", name: "Soft Light", bg: "bg-[#fafafa]", text: "text-zinc-900", border: "border-zinc-300" }
];
