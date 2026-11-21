import { useState, type FormEvent } from "react";
import { Check, KeyRound, Lock, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { OWNER_PIN, upcomingGames } from "../data";
import { DESCRIPTION_MAX, TITLE_MAX, type ProjectText } from "../projectStore";
import { cn } from "../utils/cn";

interface OwnerDialogProps {
  unlocked: boolean;
  progress: Record<string, number>;
  texts: Record<string, ProjectText>;
  onClose: () => void;
  onUnlock: () => void;
  onLock: () => void;
  onProgressChange: (id: string, value: number) => void;
  onTextChange: (id: string, field: keyof ProjectText, value: string) => void;
  onReset: () => void;
}

const labelClass = "font-display text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400";
const counterClass = "text-[10px] font-medium text-slate-600";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/12 bg-black/35 px-3 text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400/60 focus:shadow-[0_0_0_3px_rgba(255,100,35,.1)]";

export function OwnerDialog({
  unlocked,
  progress,
  texts,
  onClose,
  onUnlock,
  onLock,
  onProgressChange,
  onTextChange,
  onReset,
}: OwnerDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accepted = pin === OWNER_PIN;
    setPin("");
    if (accepted) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect owner PIN. Access denied.");
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[85] flex items-center justify-center p-4" onMouseDown={onClose}>
      <div
        className="modal-card panel custom-scroll max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-orange-400/30"
        role="dialog"
        aria-modal="true"
        aria-labelledby="owner-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111822]/95 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {unlocked ? <SlidersHorizontal className="h-4 w-4 text-orange-400" /> : <KeyRound className="h-4 w-4 text-orange-400" />}
            <span id="owner-dialog-title" className="font-display text-xs font-bold tracking-[0.22em] text-slate-300">
              OWNER CONTROLS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close owner controls"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!unlocked ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-orange-400/30 bg-orange-500/10 text-orange-400">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-display mt-5 text-2xl font-bold tracking-tight text-white">Owner verification</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter the 6-digit owner PIN to unlock name, description, and progress controls for the classified projects.
            </p>
            <label htmlFor="owner-pin" className="font-display mt-6 block text-[11px] font-bold tracking-[0.2em] text-slate-400">
              OWNER PIN
            </label>
            <input
              id="owner-pin"
              autoFocus
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, 6));
                if (error) setError("");
              }}
              placeholder="••••••"
              aria-invalid={Boolean(error)}
              className={cn(
                "font-display mt-2 h-12 w-full rounded-lg border bg-black/35 px-4 text-center text-xl tracking-[0.65em] text-white outline-none transition placeholder:text-slate-600",
                error
                  ? "border-red-400/60 focus:shadow-[0_0_0_3px_rgba(248,113,113,.12)]"
                  : "border-white/12 focus:border-orange-400/60 focus:shadow-[0_0_0_3px_rgba(255,100,35,.1)]",
              )}
            />
            {error && (
              <p role="alert" className="mt-2 text-xs font-semibold text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#ffad3d] via-[#ff6524] to-[#f43435] px-4 py-3 font-display text-xs font-bold tracking-[0.18em] text-white transition hover:brightness-110"
            >
              UNLOCK CONTROLS
            </button>
            <p className="mt-4 text-center text-[11px] text-slate-600">Owner tools only affect classified project details.</p>
          </form>
        ) : (
          <div className="p-6">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] p-3.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="font-display text-sm font-bold text-white">Owner access granted</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Rename each classified project, rewrite its description, and set its development percentage. Changes
                  appear across the launcher immediately and are saved in this browser.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {upcomingGames.map((game) => {
                const title = texts[game.id]?.title ?? game.title;
                const description = texts[game.id]?.description ?? game.description;
                const value = progress[game.id] ?? game.progress ?? 0;

                return (
                  <section key={game.id} className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-[11px] font-bold tracking-[0.2em] text-orange-400">
                        SLOT {game.slot}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {game.build} • {game.phase}
                      </span>
                    </div>

                    <label className="mt-4 block">
                      <span className="flex items-center justify-between gap-2">
                        <span className={labelClass}>Project name</span>
                        <span className={counterClass}>
                          {title.length}/{TITLE_MAX}
                        </span>
                      </span>
                      <input
                        type="text"
                        value={title}
                        maxLength={TITLE_MAX}
                        placeholder={game.title}
                        onChange={(event) => onTextChange(game.id, "title", event.target.value)}
                        className={cn(inputClass, "h-10 font-display text-sm font-bold tracking-wide")}
                      />
                    </label>

                    <label className="mt-4 block">
                      <span className="flex items-center justify-between gap-2">
                        <span className={labelClass}>Description</span>
                        <span className={counterClass}>
                          {description.length}/{DESCRIPTION_MAX}
                        </span>
                      </span>
                      <textarea
                        rows={2}
                        value={description}
                        maxLength={DESCRIPTION_MAX}
                        placeholder={game.description}
                        onChange={(event) => onTextChange(game.id, "description", event.target.value)}
                        className={cn(inputClass, "resize-none py-2.5 text-sm leading-6")}
                      />
                    </label>

                    <div className="mt-4 rounded-lg border border-orange-400/20 bg-orange-500/[0.05] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className={labelClass}>Development progress</span>
                        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/35 px-2 py-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={value}
                            onChange={(event) => onProgressChange(game.id, Number(event.target.value))}
                            aria-label={`Progress percentage for slot ${game.slot}`}
                            className="font-display w-10 bg-transparent text-right text-sm font-bold text-white outline-none"
                          />
                          <span className="font-display text-xs text-slate-500">%</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(event) => onProgressChange(game.id, Number(event.target.value))}
                        aria-label={`Progress slider for slot ${game.slot}`}
                        className="owner-range mt-3 w-full"
                        style={{
                          background: `linear-gradient(to right, #ffad3d 0%, #ff3b35 ${value}%, rgba(255,255,255,.09) ${value}%, rgba(255,255,255,.09) 100%)`,
                        }}
                      />
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-400/40 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5 text-orange-400" /> Reset all defaults
              </button>
              <button
                type="button"
                onClick={onLock}
                className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-white"
              >
                <Lock className="h-3.5 w-3.5" /> Lock owner mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
