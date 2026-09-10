import { useEffect, useState } from "react";
import { getReadiness } from "../services/api";
import type { ReadinessData } from "../types";
import CircularGauge from "../components/CircularGauge";

export default function Readiness() {
  const [data, setData] = useState<ReadinessData | null>(null);
  useEffect(() => { getReadiness().then(setData); }, []);
  if (!data) return <div className="text-textMuted font-mono text-sm p-8">Loading readiness…</div>;

  return (
    <div className="space-y-4">
      {/* Chips header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-emeraldAccent/20 bg-emeraldAccent/10 px-3 py-1.5 text-xs font-medium text-emeraldAccent">
          <span className="h-2 w-2 rounded-full bg-emeraldAccent" /> {data.crop}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border1 bg-card px-3 py-1.5 text-xs font-mono text-textMuted">{data.location}</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border1 bg-card px-3 py-1.5 text-xs font-medium text-textPrimary">{data.product}</span>
        <span className="ml-auto text-[11px] font-mono text-textMuted hidden sm:inline">Updated {data.lastUpdated} · Mock</span>
      </div>

      {/* Hero + expected outcome */}
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
        {/* Hero gauge */}
        <div className="rounded-xl border border-border1 bg-card p-5 lg:p-6 flex flex-col sm:flex-row items-center gap-6">
          <CircularGauge value={data.score} label="Readiness" size={184} />
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emeraldAccent text-page text-xs font-bold px-3 py-1">
              ● {data.statusLabel}
            </div>
            <h1 className="mt-3 text-[22px] font-semibold text-textPrimary leading-tight">
              Recommended window<br />
              <span className="font-mono text-emeraldAccent">{data.windowDateLabel}, {data.window}</span>
            </h1>
            <p className="text-sm text-textMuted mt-2">Rain after 12 PM — spray now, not later. Every hour past 10:30 AM loses 18% viability.</p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="text-xs font-mono rounded-full border border-border1 bg-panel px-3 py-1.5 text-textMuted">Waste avoided <b className="text-textPrimary">54%</b></span>
              <span className="text-xs font-mono rounded-full border border-border1 bg-panel px-3 py-1.5 text-textMuted">Yield protection <b className="text-textPrimary">+2.2 t/ha</b></span>
            </div>
          </div>
        </div>

        {/* Expected outcome card — % and ₹ together */}
        <div className="rounded-xl border border-emeraldAccent/30 bg-card p-5 flex flex-col">
          <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-emeraldAccent">Expected outcome — if sprayed in window</div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-panel border border-border1 p-4 text-center">
              <div className="text-[11px] tracking-wide uppercase text-textMuted font-medium">Efficacy gain</div>
              <div className="font-mono text-[36px] font-bold text-emeraldAccent leading-none mt-2">+{data.efficacyGainPercent}%</div>
              <div className="text-[11px] text-textMuted mt-1">vs. off-window spray</div>
            </div>
            <div className="rounded-xl bg-panel border border-border1 p-4 text-center">
              <div className="text-[11px] tracking-wide uppercase text-textMuted font-medium">Value per acre</div>
              <div className="font-mono text-[28px] font-bold text-textPrimary leading-none mt-2">≈₹{data.efficacyGainRupeesPerAcre.toLocaleString("en-IN")}<span className="text-sm font-normal text-textMuted">/acre</span></div>
              <div className="text-[11px] text-textMuted mt-1">At MSP · net of product</div>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-emeraldAccent/10 border border-emeraldAccent/20 px-3 py-2.5 flex items-center gap-2 text-xs text-emeraldAccent">
            <span>✓</span> Both numbers always shown together — design rule.
          </div>
          <div className="mt-3 text-[11px] font-mono text-textMuted leading-relaxed bg-page border border-border1 rounded-lg p-3">
            WhatsApp compresses to: <span className="text-textPrimary">*Best window: Tomorrow, 05:30–08:45 AM. Rain after 12 PM — spray now, not later. (+18% · ≈₹3,400/acre)*</span>
          </div>
          <div className="mt-auto pt-3 text-[11px] text-textMuted">Model: scoring shell — weights visible below, not a black box. Final formula not hard-coded.</div>
        </div>
      </div>

      {/* Explainability panel */}
      <div className="rounded-xl border border-border1 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-textPrimary">Reasoning behind the window — explainability</h2>
          <span className="text-[11px] font-mono text-textMuted hidden sm:inline">Weights are visible, not just a sentence</span>
        </div>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.factors.map((f) => (
            <div key={f.id} className="rounded-xl bg-panel border border-border1 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-textPrimary">{f.label}</span>
                <span className={`h-2 w-2 rounded-full ${f.status === "favorable" ? "bg-emeraldAccent" : f.status === "neutral" ? "bg-warning" : "bg-danger"}`} />
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-page border border-border1 overflow-hidden">
                <div className={`h-full ${f.status === "favorable" ? "bg-emeraldAccent" : f.status === "neutral" ? "bg-warning" : "bg-danger"}`} style={{ width: `${f.weight}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-textMuted">Weight {f.weight}%</span>
                <span className={`text-[11px] font-medium ${f.status === "favorable" ? "text-emeraldAccent" : f.status === "neutral" ? "text-warning" : "text-danger"}`}>{f.status}</span>
              </div>
              <div className="mt-3 font-mono text-xs font-semibold text-textPrimary">{f.value}</div>
              <div className="text-[11px] text-textMuted leading-snug mt-1">{f.detail}</div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4 text-[11px] text-textMuted">Scoring is a flexible shell — research incomplete. Weights adapt as learning accrues; no final formula claimed.</div>
      </div>

      {/* Supporting row */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border1 bg-card p-4">
          <div className="text-[11px] tracking-[0.12em] uppercase font-semibold text-textMuted">Weather · IMD + field sensor</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-textMuted">Temp</span><span className="font-mono font-medium text-textPrimary">{data.weather.temp}</span></div>
            <div className="flex justify-between"><span className="text-textMuted">Humidity</span><span className="font-mono font-medium text-textPrimary">{data.weather.humidity}</span></div>
            <div className="flex justify-between"><span className="text-textMuted">Rain</span><span className="font-mono font-medium text-textPrimary">{data.weather.rainChance}</span></div>
            <div className="flex justify-between"><span className="text-textMuted">Wind</span><span className="font-mono font-medium text-textPrimary">{data.weather.wind}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-border1 bg-card p-4">
          <div className="text-[11px] tracking-[0.12em] uppercase font-semibold text-textMuted">Crop stage · Plot 3B</div>
          <div className="mt-3">
            <div className="text-sm font-medium text-textPrimary">{data.cropStage.stage}</div>
            <div className="text-xs text-textMuted">Days after sowing · <span className="font-mono text-textPrimary">{data.cropStage.daysAfterSowing}</span></div>
            <div className="mt-3 inline-flex rounded-full bg-emeraldAccent/15 border border-emeraldAccent/20 px-3 py-1 text-xs font-medium text-emeraldAccent">{data.cropStage.vigor}</div>
            <div className="mt-3 h-1.5 bg-page border border-border1 rounded-full overflow-hidden"><div className="h-full bg-emeraldAccent" style={{ width: "68%" }} /></div>
            <div className="text-[11px] font-mono text-textMuted mt-1">68% to flowering</div>
          </div>
        </div>
        <div className="rounded-xl border border-border1 bg-card p-4">
          <div className="text-[11px] tracking-[0.12em] uppercase font-semibold text-textMuted">Pest status · Pink bollworm</div>
          <div className="mt-3">
            <div className="text-sm font-medium text-textPrimary">{data.pestStatus.stage}</div>
            <div className="text-xs text-textMuted">{data.pestStatus.pressure}</div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-warning/15 border border-warning/20 text-warning font-medium">{data.pestStatus.pressure.split("·")[0]}</span>
              <span className="text-xs font-mono text-textMuted">Next moult &lt;36h</span>
            </div>
            <div className="mt-3 text-xs leading-snug text-textMuted">Scout sample 20 bolls · 10:00 AM today — photo logged</div>
          </div>
        </div>
      </div>
    </div>
  );
}
