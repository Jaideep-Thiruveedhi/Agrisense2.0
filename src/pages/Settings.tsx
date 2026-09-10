type Props = { demoWatermark: boolean; setDemoWatermark: (v: boolean) => void };

export default function Settings({ demoWatermark, setDemoWatermark }: Props) {
  return (
    <div className="max-w-[720px] space-y-4">
      <div>
        <h1 className="text-[20px] font-semibold text-textPrimary">Settings</h1>
        <p className="text-sm text-textMuted">Minimal — as briefed. No overbuild.</p>
      </div>

      <div className="rounded-xl border border-border1 bg-card overflow-hidden divide-y divide-border1/60">
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-textPrimary">Language default</div>
            <div className="text-xs text-textMuted">WhatsApp replies and journal transcription</div>
          </div>
          <select defaultValue="bilingual" className="bg-panel border border-border1 rounded-lg px-3 py-2 text-sm text-textPrimary">
            <option value="bilingual">Bilingual (EN + मराठी)</option>
            <option value="en">English only</option>
            <option value="mr">मराठी only</option>
          </select>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-textPrimary">Notifications</div>
            <div className="text-xs text-textMuted">High-severity alerts → WhatsApp + push</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-panel border border-border1 rounded-full peer peer-checked:bg-emeraldAccent peer-checked:border-emeraldAccent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-textPrimary">Demo-mode watermark</div>
            <div className="text-xs text-textMuted">Overlay “Demo · Mock Data” on every screen for judging</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={demoWatermark} onChange={(e) => setDemoWatermark(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-panel border border-border1 rounded-full peer peer-checked:bg-emeraldAccent peer-checked:border-emeraldAccent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border1 bg-panel p-4 text-xs leading-relaxed text-textMuted">
        <div className="font-semibold text-textPrimary">Scope reminder</div>
        This web app is advisor/judge-facing only. Farmers never see this — they interact purely through WhatsApp text. The backend (scoring + WhatsApp) is separate and not touched.
      </div>

      <div className="rounded-xl border border-emeraldAccent/20 bg-card p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emeraldAccent grid place-items-center text-page font-bold">✓</div>
        <div>
          <div className="text-sm font-semibold text-textPrimary">All 8 services have a home</div>
          <div className="text-xs text-textMuted">Readiness · Explainability · Efficacy (always paired) · Warnings · Fit check · Journal · History · Learning</div>
        </div>
      </div>
    </div>
  );
}
