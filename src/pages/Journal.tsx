import { useEffect, useState } from "react";
import { getSeasonJournal } from "../services/api";
import type { JournalEntry } from "../types";

function iconFor(t: JournalEntry["type"]) {
  if (t === "application") return { bg: "bg-emeraldAccent text-page", icon: "◆" };
  if (t === "photo") return { bg: "bg-[#3B82F6] text-white", icon: "▣" };
  if (t === "voice") return { bg: "bg-warning text-page", icon: "◐" };
  return { bg: "bg-emeraldAccent/20 text-emeraldAccent border border-emeraldAccent/30", icon: "✓" };
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  useEffect(() => { getSeasonJournal().then(setEntries); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-semibold text-textPrimary">Season journal · Outcome logging</h1>
          <p className="text-sm text-textMuted">Vertical timeline — application → photo → voice → outcome, each timestamped.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="rounded-full border border-border1 bg-card px-3 py-1.5 text-textMuted">Plot 3B · Cotton BG-II</span>
          <span className="rounded-full bg-emeraldAccent text-page px-3 py-1.5 font-semibold">4 entries</span>
        </div>
      </div>

      <div className="rounded-xl border border-border1 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border1 flex items-center justify-between">
          <span className="text-sm font-semibold text-textPrimary">Rabi 2025 · Akola Plot 3B</span>
          <span className="text-[11px] font-mono text-textMuted">WhatsApp + field visit → journal</span>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border1 hidden sm:block" />

            <div className="space-y-6">
              {entries.map((e) => {
                const ic = iconFor(e.type);
                return (
                  <div key={e.id} className="relative flex gap-4">
                    <div className={`h-9 w-9 rounded-full grid place-items-center text-xs font-bold shrink-0 z-10 ${ic.bg}`}>{ic.icon}</div>
                    <div className="flex-1 min-w-0 rounded-xl border border-border1 bg-panel p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-textPrimary">{e.title}</div>
                          <div className="text-[11px] font-mono text-textMuted mt-0.5">{e.timeLabel} · {e.meta}</div>
                        </div>
                        <span className="text-[11px] font-mono rounded-full border border-border1 bg-page px-2 py-1 text-textMuted">{e.type}</span>
                      </div>
                      <p className="text-sm text-textMuted leading-relaxed mt-3">{e.description}</p>
                      {e.image && (
                        <img src={e.image} alt="field" className="mt-3 rounded-lg border border-border1 w-full max-h-[220px] object-cover" />
                      )}
                      {e.type === "voice" && (
                        <div className="mt-3 flex items-center gap-3 rounded-lg bg-page border border-border1 px-3 py-2.5">
                          <div className="h-8 w-8 rounded-full bg-warning grid place-items-center text-page text-xs">▶</div>
                          <div className="flex-1">
                            <div className="h-1.5 bg-border1 rounded-full overflow-hidden">
                              <div className="h-full w-[42%] bg-warning" />
                            </div>
                            <div className="text-[11px] font-mono text-textMuted mt-1">0:18 · Marathi · auto-transcribed</div>
                          </div>
                          <span className="text-[11px] font-mono text-textMuted">18s</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-panel border-t border-border1 flex items-center justify-between text-xs">
          <span className="text-textMuted">Every WhatsApp interaction is logged — no data lost between farmer and advisor.</span>
          <span className="font-mono text-emeraldAccent font-medium hidden sm:inline">Next: Learning → confidence over seasons</span>
        </div>
      </div>
    </div>
  );
}
