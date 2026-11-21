export type TabId = "library" | "store" | "patch" | "studio";
export type GameStatus = "live" | "development";
export type StoreFilter = "all" | GameStatus;

export interface Game {
  id: string;
  title: string;
  status: GameStatus;
  statusLabel: string;
  genre: string;
  description: string;
  tags: string[];
  build: string;
  variant?: 1 | 2 | 3;
  progress?: number;
  phase?: string;
  slot?: string;
  accent?: string;
}

export const GAME_URL = "https://crossfire-protocol-1.netlify.app/";
export const OWNER_PIN = "111415";

export const games: Game[] = [
  {
    id: "crossfire",
    title: "Crossfire Protocol",
    status: "live",
    statusLabel: "LIVE NOW",
    genre: "3D Tactical Shooter",
    description:
      "Tactical 3D shooter with custom skins, squad co-op rooms, and escalating enemy waves",
    tags: ["Squad Co-op", "Custom Skins", "Wave Survival"],
    build: "v1.0.0",
  },
  {
    id: "nightshift",
    title: "PROJECT UNKNOWN",
    status: "development",
    statusLabel: "IN DEVELOPMENT",
    genre: "Classified Prototype",
    description: "Encrypted prototype build. Full details are locked until the studio reveal.",
    tags: ["Prototype", "Classified"],
    build: "Build 0.4.2",
    variant: 1,
    progress: 64,
    phase: "Closed playtest",
    slot: "01",
    accent: "#ff6b2c",
  },
  {
    id: "overdrive",
    title: "PROJECT UNKNOWN",
    status: "development",
    statusLabel: "IN DEVELOPMENT",
    genre: "Classified Prototype",
    description: "An experimental build under internal review. Identity and mechanics remain classified.",
    tags: ["Arena", "Experimental"],
    build: "Build 0.2.8",
    variant: 2,
    progress: 38,
    phase: "Core systems",
    slot: "02",
    accent: "#ff3d5a",
  },
  {
    id: "eclipse",
    title: "PROJECT UNKNOWN",
    status: "development",
    statusLabel: "IN DEVELOPMENT",
    genre: "Classified Prototype",
    description: "Early concept files are sealed. Release information is currently unavailable.",
    tags: ["Co-op", "Concept Lab"],
    build: "Concept",
    variant: 3,
    progress: 21,
    phase: "Concept lab",
    slot: "03",
    accent: "#ff9b3d",
  },
];

export const liveGame = games[0];
export const upcomingGames = games.slice(1);

export const patchNotes = {
  version: "v1.0.0",
  title: "v1.0 Launch — Crossfire Protocol Now Live!",
  label: "INITIAL RELEASE",
  summary:
    "The first public deployment of Crossfire Protocol is online. Build your squad, customize your loadout, and hold the line against escalating enemy waves.",
  sections: [
    {
      title: "New",
      items: [
        "Crossfire Protocol is available to launch directly from the DangerGames Launcher.",
        "Squad co-op rooms with rapid matchmaking and private room codes.",
        "Custom skins and loadout customization for the initial operator roster.",
      ],
    },
    {
      title: "Gameplay",
      items: [
        "Escalating enemy waves with adaptive difficulty across every mission.",
        "Tactical 3D combat arenas with cover, flanking routes, and objective zones.",
        "Wave completion bonuses and persistent session statistics.",
      ],
    },
    {
      title: "Launcher",
      items: [
        "Embedded full-screen launch view and direct browser launch options.",
        "Library, Store / All Games, Patch Notes, and Studio Info workspaces.",
        "Owner PIN controls for adjusting classified project progress.",
      ],
    },
  ],
};
