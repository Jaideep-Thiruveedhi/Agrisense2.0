import type { TourHook } from "../hooks/useTour";

export default function GuidedTour({ tour }: { tour: TourHook }) {
  if (!tour.active) return null;
  const pct = ((tour.step + 1) / tour.total) * 100;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(640px,92vw)]">
      <div className="rounded-2xl border border-emeraldAccent/30 bg-card shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="h-1 bg-border1">
          <div className="h-full bg-emeraldAccent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="hidden sm:flex h-8 w-8 rounded-full bg-emeraldAccent text-page items-center justify-center text-xs font-bold shrink-0">
            {tour.step + 1}/{tour.total}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-emeraldAccent">
              Judge mode · {tour.current.label}
            </div>
            <div className="text-[13px] leading-snug text-textPrimary truncate sm:whitespace-normal">{tour.current.caption}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={tour.prev} disabled={tour.step === 0} className="h-8 w-8 rounded-full border border-border2 text-textMuted hover:text-textPrimary disabled:opacity-30 grid place-items-center">
              ‹
            </button>
            <button onClick={tour.next} className="h-8 px-3 rounded-full bg-emeraldAccent text-page text-xs font-semibold hover:brightness-110">
              {tour.step === tour.total - 1 ? "Finish" : "Next →"}
            </button>
            <button onClick={tour.stop} className="h-8 w-8 rounded-full border border-border2 text-textMuted hover:text-danger grid place-items-center text-sm">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
