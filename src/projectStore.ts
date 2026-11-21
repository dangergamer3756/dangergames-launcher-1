import { upcomingGames, type Game } from "./data";

export const OWNER_STORAGE_KEY = "dangergames-owner-unlocked";
export const PROGRESS_STORAGE_KEY = "dangergames-project-progress";
export const PROJECT_TEXT_STORAGE_KEY = "dangergames-project-text";

export const TITLE_MAX = 32;
export const DESCRIPTION_MAX = 160;

export interface ProjectText {
  title?: string;
  description?: string;
}

type UnknownRecord = Record<string, unknown>;

const upcomingIds = new Set(upcomingGames.map((game) => game.id));

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function readOwnerUnlocked() {
  try {
    return window.localStorage.getItem(OWNER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function readStoredProgress(): Record<string, number> {
  const result: Record<string, number> = {};
  const parsed = readJson(PROGRESS_STORAGE_KEY);
  if (!isRecord(parsed)) return result;

  for (const [id, value] of Object.entries(parsed)) {
    if (upcomingIds.has(id) && typeof value === "number" && Number.isFinite(value)) {
      result[id] = clampProgress(value);
    }
  }
  return result;
}

export function readStoredProjectText(): Record<string, ProjectText> {
  const result: Record<string, ProjectText> = {};
  const parsed = readJson(PROJECT_TEXT_STORAGE_KEY);
  if (!isRecord(parsed)) return result;

  for (const [id, value] of Object.entries(parsed)) {
    if (!upcomingIds.has(id) || !isRecord(value)) continue;

    const entry: ProjectText = {};
    if (typeof value.title === "string") entry.title = value.title.slice(0, TITLE_MAX);
    if (typeof value.description === "string") {
      entry.description = value.description.slice(0, DESCRIPTION_MAX);
    }
    result[id] = entry;
  }
  return result;
}

/** Applies owner-edited name and description. Empty values fall back to the original text. */
export function applyProjectText(game: Game, text?: ProjectText): Game {
  const title = text?.title?.trim();
  const description = text?.description?.trim();
  return {
    ...game,
    title: title || game.title,
    description: description || game.description,
  };
}
