"use client";
import { useState } from "react";

const actions = ["watered","fertilizer_applied","biostimulant_applied","pesticide_applied","weed_removed","observation","harvest"] as const;
type Entry = {id:string; action: typeof actions[number]; occurred_at:string; entered_by:"farmer"|"system"; text:string; status:"draft"|"uploading"|"needs_confirmation"|"saved"|"failed"; season:"s_active_cotton"};
export default function Journal(){
  const [entries,setEntries]=useState<Entry[]>([
    {id:"j1",action:"watered",occurred_at:"2026-09-08T04:30:00Z",entered_by:"farmer",text:"Watered 12mm — diesel pump 2h",status:"saved",season:"s_active_cotton"},
    {id:"j2",action:"biostimulant_applied",occurred_at:"2026-09-08T00:15:00Z",entered_by:"farmer",text:"Sprayed Quantis 0.5 L/ha — actual 05:45 not 06:30 rec",status:"saved",season:"s_active_cotton"},
  ]);
  const [draft,setDraft]=useState({action:"watered" as typeof actions[number], occurred_at:"2026-09-10T05:30", text:"", qty:"", cost:""});
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6 grid lg:grid-cols-[1.7fr_0.9fr] gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm"><span className="font-semibold">Season Journal — s_active_cotton</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1">Timeline filters</span></div>
        <div className="mt-2 flex gap-1 flex-wrap">{actions.map(a=><button key={a} className="text-xs border border-border1 rounded-full px-2 py-1 text-textMuted capitalize">{a.replace("_"," ")}</button>)}</div>
        <div className="mt-4 space-y-3">{entries.map(e=><div key={e.id} className="rounded-xl border border-border1 bg-card p-4">
          <div className="flex items-center gap-2"><span className="text-xs font-mono border border-border1 rounded-full px-2 py-1">{e.action}</span><span className="text-xs text-textMuted">{new Date(e.occurred_at).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST · {e.season}</span><span className={"ml-auto text-xs px-2 py-1 rounded-full border "+(e.status==="saved"?"bg-emeraldAccent/15 text-emeraldAccent border-emeraldAccent/20":"bg-warning/15 text-warning border-warning/20")}>{e.status}</span></div>
          <div className="mt-1 text-sm">{e.text}</div>
          <div className="text-xs text-textMuted">Audit: revision 1, adherence: {e.occurred_at.slice(0,10)} vs rec 2026-09-11 05:30 — on-time</div>
        </div>)}</div>
      </div>
      <form onSubmit={e=>{e.preventDefault(); setEntries([...entries,{id:"j"+(entries.length+1), action:draft.action, occurred_at:new Date(draft.occurred_at).toISOString(), entered_by:"farmer", text:draft.text, status:"needs_confirmation", season:"s_active_cotton"}])}} className="rounded-2xl border border-border1 bg-card p-4 space-y-3">
        <div className="text-sm font-semibold">Add entry — {draft.action}</div>
        <select value={draft.action} onChange={e=>setDraft({...draft,action:e.target.value as any})} className="w-full bg-panel border border-border1 rounded-lg px-3 py-2.5">{actions.map(a=><option key={a} value={a}>{a}</option>)}</select>
        <label className="block text-sm">When (occurred_at)<input type="datetime-local" value={draft.occurred_at} onChange={e=>setDraft({...draft,occurred_at:e.target.value})} className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/></label>
        <label className="block text-sm">What + qty/cost<input value={draft.text} onChange={e=>setDraft({...draft,text:e.target.value})} placeholder="Watered 10mm" className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5"/><div className="mt-1 flex gap-2"><input value={draft.qty} onChange={e=>setDraft({...draft,qty:e.target.value})} placeholder="Qty + unit" className="flex-1 bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"/><input value={draft.cost} onChange={e=>setDraft({...draft,cost:e.target.value})} placeholder="Cost ₹" className="flex-1 bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"/></div></label>
        <div className="flex gap-2"><label className="flex-1 border border-dashed border-border1 bg-panel rounded-lg p-3 text-center text-sm">📷 Photo / 🎤 Voice — creates REVIEWABLE draft<input type="file" className="hidden"/></label></div>
        <div className="text-xs text-warning border border-warning/20 bg-warning/10 rounded-lg p-2">Photo shows canopy/symptom with uncertainty — not proof product caused yield.</div>
        <div className="flex gap-2"><span className="text-xs border border-border1 rounded-full px-2 py-1">Draft</span><span className="text-xs border border-border1 rounded-full px-2 py-1">Uploading…</span><span className="text-xs bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/20 rounded-full px-2 py-1">Needs confirmation</span></div>
        <button type="submit" className="w-full bg-emeraldAccent text-page font-semibold py-2.5 rounded-lg">Save — co-persists cost+irrigation atomically</button>
        <div className="text-xs text-textMuted">“Done notification” ≠ “Task done” — apply asks what actually occurred.</div>
      </form>
    </div>
  </div>;
}
