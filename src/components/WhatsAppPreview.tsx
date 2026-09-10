import { useState } from "react";
import type { WhatsAppMessage } from "../types";

type Props = { messages: WhatsAppMessage[] };

export default function WhatsAppPreview({ messages }: Props) {
  const [lang, setLang] = useState<"en" | "mr">("en");
  return (
    <div className="rounded-xl border border-border1 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border1 bg-panel">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-white text-[11px] font-bold">WA</div>
          <div>
            <div className="text-[13px] font-semibold text-textPrimary leading-none">WhatsApp · Farmer preview</div>
            <div className="text-[11px] text-textMuted">Plain-text only — *bold via asterisks*</div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-page border border-border1 p-1">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${lang === "en" ? "bg-emeraldAccent text-page" : "text-textMuted hover:text-textPrimary"}`}
          >
            English
          </button>
          <button
            onClick={() => setLang("mr")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${lang === "mr" ? "bg-emeraldAccent text-page" : "text-textMuted hover:text-textPrimary"}`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* chat area */}
      <div className="bg-[#0b141a] px-4 py-4 space-y-3 min-h-[260px]" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "18px 18px" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "farmer" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-[10px] px-3 py-2 text-[13px] leading-[1.45] shadow-sm relative ${
                m.from === "farmer"
                  ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                  : "bg-[#202c33] text-[#e9edef] rounded-tl-none border border-white/5"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {/* Render *bold* as bold for demo clarity but keep honest */}
                {(lang === "en" ? m.textEn : m.textMr).split(/(\*[^*]+\*)/g).map((part, idx) =>
                  part.startsWith("*") && part.endsWith("*") ? (
                    <strong key={idx} className="font-semibold text-white">
                      {part.slice(1, -1)}
                    </strong>
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )}
              </div>
              <div className={`mt-1 text-[10px] font-mono ${m.from === "farmer" ? "text-white/60 text-right" : "text-white/50"}`}>{m.time} ✓✓</div>
            </div>
          </div>
        ))}
        <p className="text-center text-[10px] tracking-wide text-white/30 pt-2">
          Representation — WhatsApp renders plain text only. Gauges/charts stay in advisor dashboard.
        </p>
      </div>

      <div className="px-3 py-2 bg-panel border-t border-border1 flex items-center gap-2">
        <div className="flex-1 h-8 rounded-full bg-page border border-border1 flex items-center px-3 text-xs text-textMuted">Type a message (demo — read only)</div>
        <div className="h-8 w-8 rounded-full bg-emeraldAccent flex items-center justify-center text-page">›</div>
      </div>
    </div>
  );
}
