"use client";
import { useState } from "react";
import Link from "next/link";
type Task = {id:string; title:string; due:string; importance:"high"|"medium"|"low"; field:string; status:"pending"|"snoozed"|"done"|"cancelled"; reason:string;};
const seed: Task[] = [
  {id:"t1",title:"Spray Quantis 05:30-08:45", due:"2026-09-11", importance:"high", field:"Akola cotton", status:"pending", reason:"Heat 6.0 onset in 3d + delta_t window"},
  {id:"t2",title:"Water cotton 12mm", due:"2026-09-12", importance:"medium", field:"Akola cotton", status:"pending", reason:"Dr 45% TAW, Ks=0.82"},
  {id:"t3",title:"Log sowing date", due:"2026-09-11", importance:"high", field:"Akola cotton", status:"pending", reason:"Need more data vs GDD estimate"},
  {id:"t4",title:"Overdue: review soil card", due:"2026-09-09", importance:"high", field:"Akola cotton", status:"pending", reason:"OCR draft awaiting confirm"},
];
export default function Todo(){
  const [tasks,setTasks]=useState<Task[]>(seed);
  const [filter,setFilter]=useState<"pending"|"done"|"all">("pending");
  const patch=(id:string, patch:Partial<Task>)=>setTasks(s=>s.map(t=>t.id===id?{...t,...patch}:t));
  const byDay = tasks.reduce((acc:Record<string,Task[]>,t)=>{(acc[t.due]??=[]).push(t); return acc;},{});
  return <div className="min-h-screen bg-page">
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <div className="flex items-center gap-2 text-sm"><Link href="/dashboard" className="underline">Dashboard</Link><span>/</span><span className="font-semibold">7-day Plan + Notifications</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1 text-textMuted">Task distinct from Notification distinct from Reminder</span></div>
      <div className="mt-4 grid lg:grid-cols-[1.7fr_0.9fr] gap-6">
        <div className="rounded-2xl border border-border1 bg-card p-4">
          <div className="flex items-center gap-2"><span className="text-sm font-semibold">Next 7 days — grouped by day + importance</span><select value={filter} onChange={e=>setFilter(e.target.value as any)} className="ml-auto bg-panel border border-border1 rounded-full px-2 py-1 text-xs"><option value="pending">pending</option><option value="done">done</option><option value="all">all</option></select></div>
          <div className="mt-3 space-y-3">
            {Object.entries(byDay).sort().map(([day,list])=><div key={day} className="rounded-xl border border-border1 bg-panel p-3"><div className="text-xs font-mono text-textMuted">{day} {day<"2026-09-10"&&"· Overdue"}</div><div className="mt-2 space-y-2">{list.filter(t=>filter==="all"||t.status===filter).map(t=><div key={t.id} className="rounded-lg bg-page border border-border1 p-3 flex items-start gap-3"><span className={"h-2 w-2 rounded-full mt-1 "+(t.importance==="high"?"bg-danger":t.importance==="medium"?"bg-warning":"bg-textMuted")}/><div className="flex-1"><div className="text-sm font-medium">{t.title} <span className="text-xs text-textMuted">· {t.field}</span></div><div className="text-xs text-textMuted">Why: {t.reason}</div><div className="text-[11px] text-textMuted">Status {t.status} · Snooze cancels obsolete delivery; read Notification ≠ done Task</div></div><div className="flex gap-1"><button onClick={()=>patch(t.id,{status:"done"})} className="text-xs bg-emeraldAccent text-page rounded-full px-2 py-1 font-semibold">Done</button><button onClick={()=>patch(t.id,{status:"snoozed"})} className="text-xs border border-border1 rounded-full px-2 py-1">Snooze</button><button onClick={()=>patch(t.id,{status:"cancelled"})} className="text-xs border border-border1 rounded-full px-2 py-1">Cancel</button></div></div>)}</div></div>)}
            <div className="text-xs text-textMuted mt-2">Weather change can cancel/supersede spray task — preserves old audit, shows new window. Stale reminder never instructs blocked spray. Season closed cancels pending season-specific actions.</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border1 bg-card p-4">
            <div className="text-sm font-semibold">Notifications — history + delivery/read/ack</div>
            <div className="mt-2 space-y-2 text-sm">
              <div className="rounded-lg bg-panel border border-border1 p-3"><div className="flex items-center gap-2"><span className="text-xs bg-warning/15 text-warning border border-warning/20 rounded-full px-2 py-0.5">Risk</span><span className="text-xs text-textMuted">2026-09-10 06:10 IST</span><button className="ml-auto text-xs border border-border1 rounded-full px-2 py-1">History</button></div><div className="mt-1">Heat stress 7.1/9 for Akola cotton</div><div className="text-xs text-textMuted">Read ≠ performed. <button className="underline text-emeraldAccent">Done completes task</button> vs <button className="underline">Mark read only acknowledges</button></div></div>
              <div className="rounded-lg bg-panel border border-border1 p-3">Spray reminder 05:30 IST — Akola cotton <span className="text-xs border border-border1 rounded-full px-2 py-1 ml-2">Set for 05:00</span></div>
            </div>
            <div className="mt-3">
              <label className="block text-sm">Set reminder: time + channel + quiet hours</label>
              <div className="mt-1 flex gap-2"><input type="time" defaultValue="05:00" className="bg-panel border border-border1 rounded-lg px-2 py-1.5"/><select className="bg-panel border border-border1 rounded-lg px-2 py-1.5 text-sm"><option>Push+In-app</option><option>In-app only</option></select><button className="bg-emeraldAccent text-page rounded-full px-3 py-1.5 text-sm font-semibold">Save</button></div>
              <div className="text-xs text-textMuted mt-1">Browser push requested only after explicit opt-in; denied → in-app keeps working. Quiet hours 22:00-06:00 IST.</div>
            </div>
          </div>
          <div className="rounded-xl border border-border1 bg-panel p-3 text-xs text-textMuted">Send-time rechecks recommendation expiry/season/opt-in before sending; stale cancelled. BigQuery exports async — operational save works if BigQuery down.</div>
        </div>
      </div>
    </div>
  </div>;
}
