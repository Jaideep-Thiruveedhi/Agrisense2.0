"use client";
import { useState } from "react";
type Msg = {role:"user"|"assistant"; text:string; proposal?:{id:string; old:string; new:string; field:string; expected_version:number}};
export default function Ask(){
  const [msgs,setMsgs]=useState<Msg[]>([{role:"assistant",text:"I have your active field Akola cotton (s_active_cotton), last rec 2026-09-11 05:30 ready 68, 3 journal entries. Ask: Why wait? What did I spend? I watered today."}]);
  const [input,setInput]=useState("");
  const [proposal,setProposal]=useState<Msg["proposal"]|null>(null);
  const send=()=>{
    const t=input.trim(); if(!t) return;
    setMsgs(m=>[...m,{role:"user",text:t}]);
    // mock propose sowing date edit
    if(t.toLowerCase().includes("sowing")){
      setTimeout(()=>{ setProposal({id:"prop_1",old:"2026-06-15",new:"2026-06-18",field:"s_active_cotton",expected_version:3}); setMsgs(m=>[...m,{role:"assistant",text:`Proposed change — sowing date: 2026-06-15 → 2026-06-18 (field ${"s_active_cotton"}). Confirm will POST /proposals/prop_1/confirm.`,proposal:{id:"prop_1",old:"2026-06-15",new:"2026-06-18",field:"s_active_cotton",expected_version:3}}]);},600);
    } else {
      setTimeout(()=> setMsgs(m=>[...m,{role:"assistant",text:`Fact from journal: you watered 12mm on 2026-09-08. Cost ledger: ₹12k spent of ₹50k budget. [source: journal.j2] — server facts, not invented.`}]),600);
    }
    setInput("");
  };
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[800px] px-6 py-6">
      <div className="rounded-2xl border border-border1 bg-card overflow-hidden flex flex-col h-[72vh]">
        <div className="border-b border-border1 p-3 flex items-center gap-2"><span className="text-sm font-semibold">Ask — full authorized context</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1">Field s_active_cotton</span></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m,i)=><div key={i} className={"max-w-[78%] rounded-2xl px-3 py-2 text-sm "+(m.role==="user"?"bg-emeraldAccent text-page ml-auto":"bg-panel border border-border1")}>{m.text}{m.proposal&&<div className="mt-2 rounded-xl border border-emeraldAccent/30 bg-card p-3 text-xs"><div className="font-semibold text-emeraldAccent">Proposed change awaiting confirm</div><div className="font-mono">old {m.proposal.old} → new {m.proposal.new} · v{m.proposal.expected_version}</div><div className="flex gap-2 mt-2"><button onClick={()=>{setMsgs(s=>[...s,{role:"assistant",text:"Confirmed — DB updated once, idempotent. Recommendation now stale, re-evaluate."}]); setProposal(null);}} className="bg-emeraldAccent text-page px-3 py-1.5 rounded-full font-semibold">Confirm</button><button onClick={()=>{setMsgs(s=>[...s,{role:"assistant",text:"Cancelled — DB unchanged."}]); setProposal(null);}} className="border border-border1 px-3 py-1.5 rounded-full">Cancel</button></div><div className="text-[11px] text-textMuted mt-1">Repeated clicks blocked · version conflict → fresh confirm.</div></div>}</div>)}
        </div>
        <div className="border-t border-border1 p-3 flex gap-2">
          <button className="border border-border1 rounded-full px-2 py-1.5 text-xs">📷 Photo</button>
          <button className="border border-border1 rounded-full px-2 py-1.5 text-xs">🎤 Voice</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="I watered today 10mm" className="flex-1 bg-panel border border-border1 rounded-full px-3 py-1.5 text-sm"/>
          <button onClick={send} className="bg-emeraldAccent text-page px-4 py-1.5 rounded-full text-sm font-semibold">Send</button>
        </div>
      </div>
      <div className="mt-2 text-xs text-textMuted">Suggestions: Why wait to spray? · What did I spend? · Compare crops · Show my last season — text streams only if backend supports it.</div>
    </div>
  </div>;
}
