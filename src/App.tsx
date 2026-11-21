import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Crosshair,
  ExternalLink,
  Flame,
  Gamepad2,
  Globe2,
  KeyRound,
  Library,
  Lock,
  Mail,
  Maximize2,
  Monitor,
  Play,
  Radio,
  RefreshCw,
  Rocket,
  ScrollText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { BrandMark, PrototypeArtwork, TacticalArtwork } from "./components/Artwork";
import { OwnerDialog } from "./components/OwnerDialog";
import {
  OWNER_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  PROJECT_TEXT_STORAGE_KEY,
  applyProjectText,
  clampProgress,
  readOwnerUnlocked,
  readStoredProgress,
  readStoredProjectText,
  type ProjectText,
} from "./projectStore";
import {
  GAME_URL,
  games,
  liveGame,
  patchNotes,
  type Game,
  type StoreFilter,
  type TabId,
} from "./data";
import { cn } from "./utils/cn";

const navItems = [
  { id: "library", label: "Library", detail: "Your collection", icon: Library },
  { id: "store", label: "Store / All Games", detail: "Browse titles", icon: Store },
  { id: "patch", label: "Patch Notes", detail: "Latest updates", icon: ScrollText },
  { id: "studio", label: "Studio Info", detail: "About us", icon: Building2 },
] as const;

const pageMeta: Record<TabId, { eyebrow: string; title: string; description: string }> = {
  library: {
    eyebrow: "WORKSPACE / COLLECTION",
    title: "Your Library",
    description: "Launch a live deployment or keep an eye on what the studio is building next.",
  },
  store: {
    eyebrow: "WORKSPACE / CATALOG",
    title: "Store / All Games",
    description: "Every DangerGames title and classified prototype, all in one place.",
  },
  patch: {
    eyebrow: "WORKSPACE / RELEASE LOG",
    title: "Patch Notes",
    description: "Official release notes, gameplay changes, and launcher updates.",
  },
  studio: {
    eyebrow: "WORKSPACE / ABOUT",
    title: "Studio Info",
    description: "A small independent team building sharp, social, high-energy games.",
  },
};

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-orange-400/45 hover:bg-orange-500/10 hover:text-white";

function matchesGame(game: Game, query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return [game.title, game.genre, game.description, game.statusLabel, ...game.tags]
    .join(" ")
    .toLowerCase()
    .includes(term);
}

function SectionTitle({
  eyebrow,
  title,
  count,
  action,
}: {
  eyebrow: string;
  title: string;
  count?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-orange-400/80">{eyebrow}</p>
        <h2 className="font-display mt-1 flex items-center gap-3 text-xl font-bold tracking-wide text-white sm:text-2xl">
          {title}
          {count && (
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-sans text-[11px] font-semibold tracking-normal text-slate-400">
              {count}
            </span>
          )}
        </h2>
      </div>
      {action}
    </div>
  );
}

function HeroCard({ onPlay, onPatch }: { onPlay: () => void; onPatch: () => void }) {
  return (
    <article className="hero-sweep scanlines orange-outline relative min-h-[468px] overflow-hidden rounded-2xl border border-orange-500/25 bg-[#080d14]">
      <TacticalArtwork className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c12] via-[#080c12]/92 to-[#080c12]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06090e] via-transparent to-[#090d14]/40" />
      <div className="relative z-10 flex min-h-[468px] flex-col p-6 sm:p-8 lg:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-display text-[11px] font-bold tracking-[0.2em] text-emerald-300">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" />
            LIVE NOW
          </span>
          <span className="rounded-md border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 font-display text-[11px] font-semibold tracking-[0.16em] text-orange-300">
            3D TACTICAL SHOOTER
          </span>
          <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 font-display text-[11px] font-semibold tracking-[0.16em] text-slate-400">
            BUILD {liveGame.build}
          </span>
        </div>

        <div className="mt-auto pt-14">
          <p className="font-display text-xs font-semibold tracking-[0.3em] text-orange-300/80">DANGERGAMES ORIGINAL</p>
          <h2 className="font-display text-glow mt-2 text-[2.7rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-6xl">
            Crossfire
            <br />
            <span className="bg-gradient-to-r from-[#ffcf8a] via-[#ff782f] to-[#ff3b35] bg-clip-text text-transparent">Protocol</span>
          </h2>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <Crosshair className="h-4 w-4 text-orange-400" />
            {liveGame.genre}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">{liveGame.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {liveGame.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="play-glow group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-7 py-3.5 font-display text-sm font-bold tracking-[0.18em] text-white"
            >
              ▶ PLAY NOW
            </button>
            <a
              href={GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/35 px-4 py-3 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-orange-400/50 hover:text-white"
            >
              Open directly <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            <span className="inline-flex items-center gap-2 text-emerald-400/90">
              <Check className="h-3.5 w-3.5" /> Ready to deploy
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5" /> Squad co-op enabled
            </span>
            <button type="button" onClick={onPatch} className="ml-auto text-orange-300 transition hover:text-orange-200">
              View v1.0 notes →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function OperationsPanel({ onPatch, onDiagnostics }: { onPatch: () => void; onDiagnostics: () => void }) {
  return (
    <aside className="flex flex-col gap-5">
      <section className="panel rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-400" />
            <h3 className="font-display text-xs font-bold tracking-[0.22em] text-slate-300">LIVE OPERATIONS</h3>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
        </div>
        <div className="my-6 flex items-center gap-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.055] p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-bold tracking-wide text-white">Servers Online</p>
            <p className="mt-0.5 text-xs text-emerald-300/70">All regions operational</p>
          </div>
        </div>
        <dl className="divide-y divide-white/[0.07] text-sm">
          {[
            ["Matchmaking", "1.2s avg"],
            ["Launcher build", "1.0.0"],
            ["Active squads", "148"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3">
              <dt className="text-slate-400">{label}</dt>
              <dd className="font-display font-semibold text-slate-200">{value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={onDiagnostics}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-orange-400/40 hover:text-white"
        >
          <span className="inline-flex items-center gap-2"><Wifi className="h-3.5 w-3.5 text-orange-400" /> Run diagnostics</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      <section className="panel relative flex-1 overflow-hidden rounded-2xl p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="relative">
          <p className="font-display text-[11px] font-bold tracking-[0.22em] text-orange-400/80">LATEST DISPATCH</p>
          <h3 className="font-display mt-3 text-2xl font-bold tracking-wide text-white">v1.0 Launch</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Crossfire Protocol is now live. Squads, custom skins, and escalating waves are deployed.
          </p>
          <button
            type="button"
            onClick={onPatch}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-orange-200"
          >
            Read patch notes <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </aside>
  );
}

function ComingSoonCard({
  game,
  following,
  progress,
  ownerUnlocked,
  onFollow,
  onProgressChange,
}: {
  game: Game;
  following: boolean;
  progress: number;
  ownerUnlocked: boolean;
  onFollow: (game: Game) => void;
  onProgressChange: (id: string, value: number) => void;
}) {
  const accent = game.accent ?? "#ff6b2c";
  return (
    <article className="panel panel-hover flex h-full flex-col overflow-hidden rounded-xl">
      <div className="scanlines relative h-40 shrink-0 overflow-hidden border-b border-white/10">
        <PrototypeArtwork variant={game.variant ?? 1} accent={accent} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e15] via-transparent to-[#0a0e15]/20" />
        <span className="absolute left-3 top-3 rounded-md border border-orange-400/30 bg-black/55 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.16em] text-orange-300 backdrop-blur-sm">
          {game.statusLabel}
        </span>
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-black/55 text-slate-300 backdrop-blur-sm">
          <Lock className="h-3.5 w-3.5" />
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-[10px] font-semibold tracking-[0.22em] text-slate-500">
              CLASSIFIED PROJECT / SLOT {game.slot}
            </p>
            <h3 className="font-display mt-1 truncate text-xl font-bold tracking-wide text-white">{game.title}</h3>
          </div>
          {game.slot && (
            <span className="font-display rounded border border-orange-400/25 bg-black/45 px-2 py-1 text-[10px] font-bold text-orange-300">
              #{game.slot}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          <CircleDot className="h-3 w-3 text-orange-400" /> {game.genre}
        </div>
        <p className="text-sm leading-6 text-slate-400">{game.description}</p>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>{game.phase}</span>
            <span className="font-display text-slate-300">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff9f3d] to-[#ff3b35] shadow-[0_0_12px_rgba(255,92,35,.5)] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {ownerUnlocked && (
          <div className="mt-4 rounded-lg border border-orange-400/25 bg-orange-500/[0.06] p-3">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
              <SlidersHorizontal className="h-3 w-3" /> Owner progress control
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(event) => onProgressChange(game.id, Number(event.target.value))}
                aria-label={`Progress slider for Project Unknown slot ${game.slot}`}
                className="owner-range min-w-0 flex-1"
                style={{
                  background: `linear-gradient(to right, #ffad3d 0%, #ff3b35 ${progress}%, rgba(255,255,255,.09) ${progress}%, rgba(255,255,255,.09) 100%)`,
                }}
              />
              <div className="flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-black/35 px-2 py-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(event) => onProgressChange(game.id, Number(event.target.value))}
                  aria-label={`Progress percentage for Project Unknown slot ${game.slot}`}
                  className="font-display w-9 bg-transparent text-right text-xs font-bold text-white outline-none"
                />
                <span className="font-display text-[10px] text-slate-500">%</span>
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          aria-pressed={following}
          onClick={() => onFollow(game)}
          className={cn(
            "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition",
            following
              ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
              : "border-white/12 bg-white/[0.035] text-slate-300 hover:border-orange-400/45 hover:bg-orange-500/10 hover:text-white",
          )}
        >
          {following ? <Check className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
          {following ? "Alerts enabled" : "Notify me"}
        </button>
      </div>
    </article>
  );
}

function LiveStoreCard({ onPlay }: { onPlay: () => void }) {
  return (
    <article className="panel panel-hover flex h-full flex-col overflow-hidden rounded-xl">
      <div className="scanlines relative h-40 shrink-0 overflow-hidden border-b border-orange-500/20">
        <TacticalArtwork className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c12]/75 via-transparent to-[#080c12]/20" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-black/60 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.16em] text-emerald-300">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" /> LIVE NOW
        </span>
        <div className="absolute bottom-3 left-4">
          <p className="font-display text-[10px] font-semibold tracking-[0.22em] text-orange-300/80">DANGERGAMES ORIGINAL</p>
          <h3 className="font-display mt-1 text-2xl font-bold uppercase tracking-wide text-white">Crossfire Protocol</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-400">{liveGame.genre}</span>
          <span className="rounded border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 font-display text-[10px] font-bold tracking-wider text-emerald-300">
            FREE TO PLAY
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{liveGame.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-4 py-2.5 font-display text-xs font-bold tracking-[0.15em] text-white shadow-[0_0_24px_rgba(255,80,25,.3)] transition hover:brightness-110"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> PLAY NOW
          </button>
          <a
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Crossfire Protocol directly in a new tab"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.035] text-slate-300 transition hover:border-orange-400/45 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="panel flex flex-col items-center justify-center rounded-xl px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-orange-400">
        <Search className="h-5 w-5" />
      </div>
      <h3 className="font-display mt-4 text-lg font-bold text-white">No titles found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        {query ? <>No results for “{query}”. Try another title, genre, or status.</> : "Nothing to show in this category yet."}
      </p>
      <button type="button" onClick={onClear} className={cn(outlineButton, "mt-5")}>
        Clear search
      </button>
    </div>
  );
}

function PatchNotesBody({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-orange-400/35 bg-orange-500/10 px-3 py-1.5 font-display text-xs font-bold tracking-[0.18em] text-orange-300">
          {patchNotes.version}
        </span>
        <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-slate-500">{patchNotes.label}</span>
        <span className="ml-auto inline-flex items-center gap-2 text-xs font-medium text-emerald-300">
          <ShieldCheck className="h-4 w-4" /> Verified build
        </span>
      </div>
      <h2 className={cn("font-display mt-5 font-bold leading-tight text-white", compact ? "text-2xl" : "text-3xl sm:text-4xl")}>
        {patchNotes.title}
      </h2>
      <p className={cn("mt-3 max-w-3xl leading-7 text-slate-400", compact ? "text-sm" : "text-[15px]")}>{patchNotes.summary}</p>
      <div className={cn("mt-7 grid gap-4", compact ? "sm:grid-cols-2" : "md:grid-cols-3")}>
        {patchNotes.sections.map((section, index) => (
          <section key={section.title} className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-orange-500/12 text-orange-400">
                {index === 0 ? <Sparkles className="h-3.5 w-3.5" /> : index === 1 ? <Gamepad2 className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
              </span>
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-slate-200">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-slate-400">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-orange-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function LaunchDialog({
  onClose,
  onEmbedded,
  onPatchNotes,
}: {
  onClose: () => void;
  onEmbedded: () => void;
  onPatchNotes: () => void;
}) {
  return (
    <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4" onMouseDown={onClose}>
      <div
        className="modal-card panel relative w-full max-w-xl overflow-hidden rounded-2xl border-orange-400/25"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="scanlines relative h-36 overflow-hidden border-b border-white/10">
          <TacticalArtwork className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f16] via-[#0a0f16]/75 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close launch options"
            className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-black/50 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-6">
            <p className="font-display text-[10px] font-bold tracking-[0.25em] text-emerald-300">READY TO DEPLOY</p>
            <h2 id="launch-title" className="font-display mt-1 text-3xl font-bold uppercase tracking-wide text-white">
              Crossfire Protocol
            </h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm leading-6 text-slate-400">
            Choose your launch method. The game opens <span className="font-semibold text-slate-200">{GAME_URL}</span>.
          </p>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onEmbedded}
              className="group flex w-full items-center gap-4 rounded-xl border border-orange-400/35 bg-gradient-to-r from-orange-500/15 to-transparent p-4 text-left transition hover:border-orange-400/70 hover:bg-orange-500/20"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-orange-400/30 bg-orange-500/15 text-orange-300">
                <Monitor className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-sm font-bold tracking-wide text-white">Launch inside launcher</span>
                <span className="mt-0.5 block text-xs text-slate-400">Embedded full-screen session</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-orange-400 transition group-hover:translate-x-1" />
            </button>
            <a
              href={GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300">
                <ExternalLink className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-sm font-bold tracking-wide text-white">Open directly</span>
                <span className="mt-0.5 block text-xs text-slate-400">Launch in a new browser tab</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500">
            <span>Build {liveGame.build} • Servers online</span>
            <button type="button" onClick={onPatchNotes} className="font-semibold text-orange-300 transition hover:text-orange-200">
              View launch patch notes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatchNotesModal({ onClose, onPlay }: { onClose: () => void; onPlay: () => void }) {
  return (
    <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4" onMouseDown={onClose}>
      <div
        className="modal-card panel custom-scroll max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-orange-400/25"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patch-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111822]/95 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-orange-400" />
            <span id="patch-modal-title" className="font-display text-xs font-bold tracking-[0.22em] text-slate-300">OFFICIAL PATCH NOTES</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close patch notes" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <PatchNotesBody compact />
          <button
            type="button"
            onClick={onPlay}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-5 py-2.5 font-display text-xs font-bold tracking-[0.15em] text-white transition hover:brightness-110"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> LAUNCH GAME
          </button>
        </div>
      </div>
    </div>
  );
}

function EmbeddedSession({ onClose }: { onClose: () => void }) {
  const [frameKey, setFrameKey] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  const reload = () => {
    setFrameKey((key) => key + 1);
    setShowHint(false);
    window.setTimeout(() => setShowHint(true), 4500);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#05080d]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#0c121a] px-3 sm:px-5">
        <BrandMark className="h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <p className="font-display truncate text-sm font-bold tracking-wide text-white">CROSSFIRE PROTOCOL</p>
          <p className="hidden text-[10px] font-medium uppercase tracking-[0.17em] text-slate-500 sm:block">Embedded full-screen session • {GAME_URL}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-400/40 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reload</span>
          </button>
          <a
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-400/40 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Open directly</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit embedded session"
            className="grid h-9 w-9 place-items-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 bg-[#090d13]">
        <iframe
          key={frameKey}
          src={GAME_URL}
          title="Crossfire Protocol embedded game session"
          className="h-full w-full border-0"
          allow="fullscreen; gamepad; clipboard-read; clipboard-write"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/65 px-3 py-1.5 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
          <Maximize2 className="h-3 w-3 text-orange-400" /> Embedded view
        </div>
        {showHint && (
          <div className="toast-in absolute bottom-5 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-xl border border-orange-400/30 bg-[#151a22]/95 px-4 py-3 text-xs text-slate-300 shadow-2xl backdrop-blur-md">
            <span>Some external sites block embedded playback. If this view is blank, open it directly.</span>
            <a
              href={GAME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-orange-300 hover:text-orange-200"
            >
              Open directly <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("library");
  const [query, setQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<StoreFilter>("all");
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [launchOpen, setLaunchOpen] = useState(false);
  const [patchOpen, setPatchOpen] = useState(false);
  const [embeddedOpen, setEmbeddedOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerUnlocked, setOwnerUnlocked] = useState(readOwnerUnlocked);
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>(readStoredProgress);
  const [projectText, setProjectText] = useState<Record<string, ProjectText>>(readStoredProjectText);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string) => setToast({ id: Date.now(), message });
  const getProgress = (game: Game) => projectProgress[game.id] ?? game.progress ?? 0;

  // Catalog with owner-edited names and descriptions applied (live game is never overridden).
  const resolvedGames = useMemo(
    () => games.map((game) => applyProjectText(game, projectText[game.id])),
    [projectText],
  );
  const titleOf = (id: string) => resolvedGames.find((game) => game.id === id)?.title ?? "PROJECT UNKNOWN";

  const updateProjectProgress = (id: string, value: number) => {
    setProjectProgress((current) => ({ ...current, [id]: clampProgress(value) }));
  };

  const updateProjectText = (id: string, field: keyof ProjectText, value: string) => {
    setProjectText((current) => {
      const next: ProjectText = { ...current[id], [field]: value };
      return { ...current, [id]: next };
    });
  };

  const unlockOwner = () => {
    setOwnerUnlocked(true);
    showToast("Owner mode unlocked");
  };

  const lockOwner = () => {
    setOwnerUnlocked(false);
    showToast("Owner mode locked");
  };

  const resetProjectEdits = () => {
    setProjectProgress({});
    setProjectText({});
    showToast("Project settings reset to defaults");
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      window.localStorage.setItem(OWNER_STORAGE_KEY, ownerUnlocked ? "true" : "false");
    } catch {
      // Storage may be unavailable; owner mode still works for this session.
    }
  }, [ownerUnlocked]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(projectProgress));
    } catch {
      // Storage may be unavailable; percentages still work for this session.
    }
  }, [projectProgress]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECT_TEXT_STORAGE_KEY, JSON.stringify(projectText));
    } catch {
      // Storage may be unavailable; custom names still work for this session.
    }
  }, [projectText]);

  useEffect(() => {
    const locked = launchOpen || patchOpen || embeddedOpen || ownerOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [launchOpen, patchOpen, embeddedOpen, ownerOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (ownerOpen) setOwnerOpen(false);
        else if (embeddedOpen) setEmbeddedOpen(false);
        else if (launchOpen) setLaunchOpen(false);
        else if (patchOpen) setPatchOpen(false);
        else if (notifOpen) setNotifOpen(false);
        else if (profileOpen) setProfileOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [embeddedOpen, launchOpen, patchOpen, notifOpen, profileOpen, ownerOpen]);

  const changeTab = (tab: TabId) => {
    setActiveTab(tab);
    setNotifOpen(false);
    setProfileOpen(false);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateSearch = (value: string) => {
    setQuery(value);
    if (value.trim() && (activeTab === "patch" || activeTab === "studio")) setActiveTab("store");
  };

  const toggleFollow = (game: Game) => {
    const next = !following[game.id];
    const label = game.slot ? `${game.title} / SLOT ${game.slot}` : game.title;
    setFollowing((current) => ({ ...current, [game.id]: next }));
    showToast(next ? `Alerts enabled for ${label}` : `Alerts disabled for ${label}`);
  };

  const openPatchFromLaunch = () => {
    setLaunchOpen(false);
    setPatchOpen(true);
  };

  const openLaunchFromPatch = () => {
    setPatchOpen(false);
    setLaunchOpen(true);
  };

  const startEmbedded = () => {
    setLaunchOpen(false);
    setEmbeddedOpen(true);
    showToast("Embedded session started");
  };

  const libraryLiveVisible = matchesGame(liveGame, query);
  const libraryProjects = resolvedGames.filter((game) => game.status === "development" && matchesGame(game, query));
  const storeGames = resolvedGames.filter(
    (game) => (storeFilter === "all" || game.status === storeFilter) && matchesGame(game, query),
  );
  const libraryResultCount = Number(libraryLiveVisible) + libraryProjects.length;
  const filters: { id: StoreFilter; label: string; count: number }[] = [
    { id: "all", label: "All Games", count: games.length },
    { id: "live", label: "Available Now", count: games.filter((game) => game.status === "live").length },
    { id: "development", label: "In Development", count: games.filter((game) => game.status === "development").length },
  ];
  const meta = pageMeta[activeTab];

  return (
    <div className="app-backdrop relative min-h-screen p-0 sm:p-4 lg:p-6">
      <div className="window-shell relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col overflow-hidden rounded-none border border-white/10 sm:rounded-2xl lg:h-[calc(100vh-48px)] lg:min-h-[700px]">
        {/* Title bar */}
        <header className="relative z-40 flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.08] bg-[#0d131b]/95 px-4 sm:px-5">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
            <BrandMark className="h-7 w-7" />
            <div className="font-display leading-none">
              <p className="text-xs font-bold tracking-[0.2em] text-white">DANGERGAMES</p>
              <p className="mt-1 text-[9px] font-semibold tracking-[0.32em] text-orange-400/80">LAUNCHER</p>
            </div>
          </div>

          <div className="relative min-w-0 flex-1 md:mx-auto md:max-w-[430px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => updateSearch(event.target.value)}
              type="search"
              placeholder="Search games, genres, status..."
              aria-label="Search games"
              className="h-9 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-16 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-orange-400/50 focus:bg-black/50 focus:shadow-[0_0_0_3px_rgba(255,100,35,.08)]"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:block">
              ⌘ K
            </kbd>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => {
                  setNotifOpen((open) => !open);
                  setProfileOpen(false);
                }}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-slate-300 transition hover:border-orange-400/40 hover:text-white"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#ff6b2c]" />
              </button>
              {notifOpen && (
                <div className="panel absolute right-0 top-12 z-50 w-72 rounded-xl p-4">
                  <p className="font-display text-xs font-bold tracking-[0.2em] text-slate-300">NOTIFICATIONS</p>
                  <div className="mt-3 rounded-lg border border-orange-400/20 bg-orange-500/[0.07] p-3">
                    <p className="text-sm font-semibold text-white">Crossfire Protocol is live</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">v1.0 Launch is deployed and ready to play.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      setPatchOpen(true);
                    }}
                    className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-orange-300 transition hover:border-orange-400/40 hover:text-white"
                  >
                    Read launch notes
                  </button>
                </div>
              )}
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 lg:flex">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span className="font-display text-[10px] font-bold tracking-[0.16em] text-emerald-300">SERVERS ONLINE</span>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] py-1.5 pl-1.5 pr-2 transition hover:border-orange-400/40"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[#ffad3d] to-[#f43435] font-display text-[11px] font-bold text-white shadow-[0_0_16px_rgba(255,90,30,.35)]">
                  DG
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-xs font-bold text-white">DangerGamer</span>
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-emerald-400">Online</span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
              </button>
              {profileOpen && (
                <div className="panel absolute right-0 top-12 z-50 w-64 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#ffad3d] to-[#f43435] font-display text-sm font-bold text-white">DG</span>
                    <div>
                      <p className="font-display text-sm font-bold text-white">DangerGamer</p>
                      <p className="text-[11px] text-slate-400">Founder-level player</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                      <p className="font-display text-lg font-bold text-orange-300">24</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Level</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
                      <p className="font-display text-lg font-bold text-emerald-300">1</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Live title</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setLaunchOpen(true);
                    }}
                    className="mt-3 w-full rounded-lg border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300 transition hover:bg-orange-500/20 hover:text-white"
                  >
                    Launch Crossfire Protocol
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Desktop sidebar */}
          <aside className="hidden w-[248px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0a0f16]/80 lg:flex xl:w-[270px]">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-6">
              <BrandMark className="h-11 w-11 shrink-0 drop-shadow-[0_0_14px_rgba(255,90,35,.35)]" />
              <div className="min-w-0">
                <h1 className="font-display text-[15px] font-bold leading-tight tracking-[0.14em] text-white">DANGERGAMES</h1>
                <p className="font-display mt-0.5 text-[10px] font-semibold tracking-[0.3em] text-orange-400">LAUNCHER</p>
                <p className="mt-1.5 text-[10px] text-slate-500">by DangerGames Studio</p>
              </div>
            </div>

            <nav className="flex-1 px-3 py-6" aria-label="Main navigation">
              <p className="mb-3 px-3 font-display text-[10px] font-bold tracking-[0.24em] text-slate-600">WORKSPACE</p>
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => changeTab(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                        active
                          ? "border-orange-400/25 bg-gradient-to-r from-orange-500/15 to-transparent text-white shadow-[inset_0_0_22px_rgba(255,90,30,.06)]"
                          : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.035] hover:text-slate-200",
                      )}
                    >
                      {active && <span className="absolute -left-3 top-2 bottom-2 w-0.5 rounded-r bg-gradient-to-b from-[#ffad3d] to-[#f43435] shadow-[0_0_12px_#ff6524]" />}
                      <Icon className={cn("h-[18px] w-[18px] shrink-0 transition", active ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300")} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{item.label}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-600">{item.detail}</span>
                      </span>
                      {active && <ChevronRight className="h-3.5 w-3.5 text-orange-400/70" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-white/[0.07] p-4">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[10px] font-bold tracking-[0.2em] text-slate-500">SYSTEM</p>
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" /> All services online
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
                  <span>BUILD 1.0.0</span>
                  <span>4 TITLES</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile tabs */}
          <div className="custom-scroll flex shrink-0 gap-2 overflow-x-auto border-b border-white/[0.08] bg-[#0a0f16]/80 px-3 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                    activeTab === item.id
                      ? "border-orange-400/35 bg-orange-500/15 text-orange-200"
                      : "border-white/10 bg-white/[0.025] text-slate-400",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {item.label}
                </button>
              );
            })}
          </div>

          <main ref={mainRef} className="custom-scroll relative min-h-0 min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-display text-[11px] font-bold tracking-[0.25em] text-orange-400/80">{meta.eyebrow}</p>
                  <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{meta.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{meta.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOwnerOpen(true)}
                    className={cn(
                      outlineButton,
                      ownerUnlocked && "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-200",
                    )}
                  >
                    {ownerUnlocked ? (
                      <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <KeyRound className="h-4 w-4 text-orange-400" />
                    )}
                    {ownerUnlocked ? "Owner mode" : "Owner controls"}
                  </button>
                  {activeTab === "library" && (
                    <button type="button" onClick={() => setPatchOpen(true)} className={outlineButton}>
                      <ScrollText className="h-4 w-4 text-orange-400" /> Patch notes
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setLaunchOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-4 py-2.5 font-display text-xs font-bold tracking-[0.14em] text-white shadow-[0_0_24px_rgba(255,80,25,.28)] transition hover:brightness-110"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> LAUNCH GAME
                  </button>
                </div>
              </div>

              {activeTab === "library" && (
                <>
                  {query && (
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-slate-400">
                      <span>
                        Showing <span className="font-semibold text-white">{libraryResultCount}</span> library result{libraryResultCount === 1 ? "" : "s"} for “{query}”
                      </span>
                      <button type="button" onClick={() => setQuery("")} className="font-semibold text-orange-300 hover:text-orange-200">Clear search</button>
                    </div>
                  )}

                  {libraryLiveVisible && (
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
                      <HeroCard onPlay={() => setLaunchOpen(true)} onPatch={() => setPatchOpen(true)} />
                      <OperationsPanel
                        onPatch={() => setPatchOpen(true)}
                        onDiagnostics={() => showToast("Diagnostics complete — all systems operational")}
                      />
                    </div>
                  )}

                  <section className={libraryLiveVisible ? "mt-9" : ""}>
                    <SectionTitle
                      eyebrow="ENCRYPTED ARCHIVE"
                      title="Coming Soon"
                      count={`${libraryProjects.length} CLASSIFIED BUILDS`}
                      action={
                        <div className="flex flex-wrap items-center gap-3">
                          {ownerUnlocked && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/25 bg-emerald-400/[0.07] px-2 py-1 font-display text-[10px] font-bold tracking-[0.14em] text-emerald-300">
                              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" /> OWNER MODE ACTIVE
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setOwnerOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 transition hover:text-orange-200"
                          >
                            {ownerUnlocked ? <SlidersHorizontal className="h-3.5 w-3.5" /> : <KeyRound className="h-3.5 w-3.5" />}
                            {ownerUnlocked ? "Edit progress" : "Owner access"}
                          </button>
                          <button type="button" onClick={() => changeTab("store")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-orange-300">
                            View all games <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      }
                    />
                    {libraryProjects.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                        {libraryProjects.map((game) => (
                          <ComingSoonCard
                            key={game.id}
                            game={game}
                            following={Boolean(following[game.id])}
                            progress={getProgress(game)}
                            ownerUnlocked={ownerUnlocked}
                            onFollow={toggleFollow}
                            onProgressChange={updateProjectProgress}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState query={query} onClear={() => setQuery("")} />
                    )}
                  </section>
                </>
              )}

              {activeTab === "store" && (
                <>
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setStoreFilter(filter.id)}
                        aria-pressed={storeFilter === filter.id}
                        className={cn(
                          "rounded-lg border px-3.5 py-2 text-xs font-semibold transition",
                          storeFilter === filter.id
                            ? "border-orange-400/40 bg-orange-500/15 text-orange-200"
                            : "border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white",
                        )}
                      >
                        {filter.label} <span className="ml-1.5 opacity-60">{filter.count}</span>
                      </button>
                    ))}
                    {query && (
                      <span className="ml-auto text-xs text-slate-500">
                        {storeGames.length} result{storeGames.length === 1 ? "" : "s"} for “{query}”
                      </span>
                    )}
                  </div>
                  {storeGames.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                      {storeGames.map((game) =>
                        game.status === "live" ? (
                          <LiveStoreCard key={game.id} onPlay={() => setLaunchOpen(true)} />
                        ) : (
                          <ComingSoonCard
                            key={game.id}
                            game={game}
                            following={Boolean(following[game.id])}
                            progress={getProgress(game)}
                            ownerUnlocked={ownerUnlocked}
                            onFollow={toggleFollow}
                            onProgressChange={updateProjectProgress}
                          />
                        ),
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      query={query}
                      onClear={() => {
                        setQuery("");
                        setStoreFilter("all");
                      }}
                    />
                  )}
                  <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                      <Globe2 className="h-5 w-5 text-orange-400" />
                      <div>
                        <p className="font-display text-sm font-bold text-white">One catalog. Every deployment.</p>
                        <p className="mt-0.5 text-xs text-slate-400">Classified projects are updated as internal builds pass review.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => changeTab("studio")} className={outlineButton}>
                      About the studio <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {activeTab === "patch" && (
                <>
                  <div className="panel overflow-hidden rounded-2xl">
                    <div className="scanlines relative h-44 overflow-hidden border-b border-white/10 sm:h-52">
                      <TacticalArtwork className="absolute inset-0 h-full w-full opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1119] via-[#0b1119]/75 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1119] to-transparent" />
                      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                        <p className="font-display text-[11px] font-bold tracking-[0.26em] text-orange-400">OFFICIAL RELEASE LOG</p>
                        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Deployment v1.0</h2>
                        <p className="mt-2 text-sm text-slate-400">Crossfire Protocol • Initial public launch</p>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <PatchNotesBody />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setLaunchOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-5 py-2.5 font-display text-xs font-bold tracking-[0.15em] text-white transition hover:brightness-110">
                      <Play className="h-3.5 w-3.5 fill-current" /> LAUNCH GAME
                    </button>
                    <button type="button" onClick={() => changeTab("library")} className={outlineButton}>
                      Back to Library <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {activeTab === "studio" && (
                <>
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,.7fr)]">
                    <section className="panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
                      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/12 blur-3xl" />
                      <div className="relative">
                        <BrandMark className="float-slow h-16 w-16 drop-shadow-[0_0_24px_rgba(255,90,35,.4)]" />
                        <p className="font-display mt-6 text-[11px] font-bold tracking-[0.26em] text-orange-400">INDEPENDENT GAME STUDIO</p>
                        <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                          Built for fast squads,<br /><span className="text-orange-400">escalating chaos</span>, and late-night runs.
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                          DangerGames Studio is a small team focused on tactile, replayable multiplayer experiences. We prototype quickly, test with our community, and ship polished sessions that feel great from the first match.
                        </p>
                        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            { value: "4", label: "Projects", Icon: Rocket },
                            { value: "1", label: "Live title", Icon: Gamepad2 },
                            { value: "24/7", label: "Servers", Icon: Radio },
                            { value: "v1.0", label: "Launch", Icon: Zap },
                          ].map(({ value, label, Icon }) => (
                            <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                              <Icon className="h-4 w-4 text-orange-400" />
                              <p className="font-display mt-3 text-xl font-bold text-white">{value}</p>
                              <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-7 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setLaunchOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-5 py-2.5 font-display text-xs font-bold tracking-[0.15em] text-white transition hover:brightness-110">
                            <Play className="h-3.5 w-3.5 fill-current" /> PLAY OUR FIRST RELEASE
                          </button>
                          <a href="mailto:hello@dangergames.studio" className={outlineButton}>
                            <Mail className="h-4 w-4 text-orange-400" /> Contact studio
                          </a>
                        </div>
                      </div>
                    </section>

                    <section className="panel rounded-2xl p-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-orange-400" />
                        <h3 className="font-display text-sm font-bold tracking-[0.18em] text-white">STUDIO ROADMAP</h3>
                      </div>
                      <div className="mt-6 space-y-0">
                        {[
                          { slot: "00", title: "v1.0 — Crossfire Protocol", note: "Public launch and squad co-op rooms", state: "LIVE NOW", active: true },
                          { slot: "01", title: titleOf("nightshift"), note: "Classified slot 01 — encrypted build review", state: "IN DEVELOPMENT", active: false },
                          { slot: "02", title: titleOf("overdrive"), note: "Classified slot 02 — experimental systems", state: "IN DEVELOPMENT", active: false },
                          { slot: "03", title: titleOf("eclipse"), note: "Classified slot 03 — sealed concept files", state: "IN DEVELOPMENT", active: false },
                        ].map((item, index, array) => (
                          <div key={item.slot} className="relative flex gap-4 pb-6 last:pb-0">
                            {index < array.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-white/10" />}
                            <span className={cn("relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2", item.active ? "border-orange-400 bg-orange-500 shadow-[0_0_14px_#ff6524]" : "border-slate-600 bg-[#111822]")} />
                            <div>
                              <p className="font-display text-sm font-bold text-white">{item.title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                              <span className={cn("mt-2 inline-block font-display text-[10px] font-bold tracking-[0.16em]", item.active ? "text-emerald-300" : "text-slate-600")}>{item.state}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {[
                      { icon: Users, title: "Community first", text: "Private squad rooms, shared feedback, and rapid iteration with real players." },
                      { icon: ShieldCheck, title: "Stable by design", text: "Verified builds, live server monitoring, and clean launcher deployment." },
                      { icon: Flame, title: "Sharp aesthetics", text: "High-contrast worlds, punchy effects, and unmistakable fiery studio branding." },
                    ].map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <article key={feature.title} className="panel panel-hover rounded-xl p-5">
                          <span className="grid h-9 w-9 place-items-center rounded-lg border border-orange-400/25 bg-orange-500/10 text-orange-400"><Icon className="h-4 w-4" /></span>
                          <h3 className="font-display mt-4 text-base font-bold text-white">{feature.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>

        {/* Status bar */}
        <footer className="flex h-8 shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] bg-[#090e15] px-4 font-display text-[10px] font-semibold tracking-[0.14em] text-slate-600 sm:px-5">
          <span className="inline-flex items-center gap-2 text-emerald-400/80">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" /> ALL SYSTEMS OPERATIONAL
          </span>
          <span className="hidden md:block">DANGERGAMES STUDIO // LAUNCHER {liveGame.build}</span>
          <span>4 TITLES • 1 PLAYABLE</span>
        </footer>
      </div>

      {launchOpen && (
        <LaunchDialog
          onClose={() => setLaunchOpen(false)}
          onEmbedded={startEmbedded}
          onPatchNotes={openPatchFromLaunch}
        />
      )}
      {patchOpen && <PatchNotesModal onClose={() => setPatchOpen(false)} onPlay={openLaunchFromPatch} />}
      {ownerOpen && (
        <OwnerDialog
          unlocked={ownerUnlocked}
          progress={projectProgress}
          texts={projectText}
          onClose={() => setOwnerOpen(false)}
          onUnlock={unlockOwner}
          onLock={lockOwner}
          onProgressChange={updateProjectProgress}
          onTextChange={updateProjectText}
          onReset={resetProjectEdits}
        />
      )}
      {embeddedOpen && <EmbeddedSession onClose={() => setEmbeddedOpen(false)} />}
      {toast && (
        <div role="status" className="toast-in fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 rounded-xl border border-orange-400/30 bg-[#151b24]/95 px-4 py-3 text-sm font-medium text-slate-200 shadow-2xl backdrop-blur-md">
          <Check className="h-4 w-4 text-emerald-400" /> {toast.message}
        </div>
      )}
    </div>
  );
}
