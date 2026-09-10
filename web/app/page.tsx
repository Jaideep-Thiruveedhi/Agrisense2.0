"use client";
import Link from "next/link";
import { useState } from "react";

const LOCATIONS=[{label:"Akola",lat:20.70,lon:77.00},{label:"Nagpur",lat:21.15,lon:79.09},{label:"Warangal",lat:17.98,lon:79.6}];
export default function Home(){
  const [lang,setLang]=useState<"en"|"hi"|"mr">("en");
  const [location,setLocation]=useState(LOCATIONS[0]);
  const [area,setArea]=useState("1");
  const [unit,setUnit]=useState<"acre"|"hectare">("acre");
  const [crop,setCrop]=useState("cotton");
  const [top5,setTop5]=useState<any[]|null>(null);
  const t=(k:string)=>({en:{hero:"Know the right morning to spray.",cta:"View readiness",suggest:"Help me choose",choose:"I have a crop"},hi:{hero:"छिड़काव के लिए सही सुबह जानें।",cta:"रेडिनेस देखें",suggest:"मदद चाहिए",choose:"मेरी फसल है"},mr:{hero:"फवारणीसाठी योग्य सकाळ ओळखा.",cta:"रेडिनेस पहा",suggest:"मदत हवी",choose:"माझे पीक आहे"}}[lang] as any)[k]||k;

  const suggest=()=>{
    const candidates=[
      {crop:"cotton",suit:0.82,water_mm:680,roi:60,warnings:["heat 6.0"],sowing:"Jun 15-30"},
      {crop:"rice",suit:0.71,water_mm:1100,roi:55,warnings:["late sowing"] ,sowing:"Jun 10-Jul 10"},
      {crop:"wheat",suit:0,excluded:"off-season",warnings:[]},
    ].filter(c=>c.suit>0);
    setTop5(candidates);
  };

  return <div className="min-h-screen bg-page">
    <header className="border-b border-border1 bg-page/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-[1280px] px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-lg bg-emeraldAccent grid place-items-center text-page font-bold">A</div><span className="font-semibold">AgriSense</span><span className="ml-2 text-xs border border-border1 rounded-full px-2 py-1 text-textMuted">Advisor/Judge · demo</span></div>
        <div className="flex gap-2">
          <select value={lang} onChange={e=>setLang(e.target.value as any)} className="bg-card border border-border1 rounded-full px-3 py-2 text-sm"><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select>
          <Link href="/" className="hidden sm:inline-flex bg-emeraldAccent text-page px-4 py-2 rounded-full text-sm font-semibold">Agronomist</Link>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-[1280px] px-6 py-6 space-y-6">
      <section className="rounded-2xl border border-border1 bg-card p-6">
        <h1 className="text-2xl font-semibold">{t("hero")}</h1>
        <p className="text-sm text-textMuted mt-2">Rice · Wheat · Cotton biological timing for India. Choose or compare, see water+returns, get a spray window, log actions, close with real money.</p>
        <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="space-y-4">
            <label className="block text-sm">Location — Use my location (tap)</label>
            <div className="flex gap-2">
              <button onClick={()=>navigator.geolocation?.getCurrentPosition(p=>setLocation({label:`${p.coords.latitude.toFixed(2)},${p.coords.longitude.toFixed(2)}`,lat:p.coords.latitude,lon:p.coords.longitude}))} className="bg-emeraldAccent text-page px-4 py-2.5 rounded-lg font-semibold">Use my location</button>
              <select value={location.label} onChange={e=>setLocation(LOCATIONS.find(l=>l.label===e.target.value)!)} className="flex-1 bg-panel border border-border1 rounded-lg px-3 py-2.5">{LOCATIONS.map(l=><option key={l.label} value={l.label}>{l.label} {l.lat},{l.lon}</option>)}</select>
            </div>
            <label className="block text-sm">Land — area + unit <span className="text-textMuted font-mono">→ {area} {unit} = {(Number(area)*(unit==="acre"?0.404686:1)).toFixed(3)} ha</span></label>
            <div className="flex gap-2"><input value={area} onChange={e=>setArea(e.target.value)} inputMode="decimal" className="flex-1 bg-panel border border-border1 rounded-lg px-3 py-2.5" placeholder="1.5"/><select value={unit} onChange={e=>setUnit(e.target.value as any)} className="bg-panel border border-border1 rounded-lg px-3"><option value="acre">acre</option><option value="hectare">hectare</option></select></div>
            <div className="flex gap-2">
              <button onClick={suggest} className="flex-1 border border-emeraldAccent/30 bg-emeraldAccent/10 text-emeraldAccent py-3 rounded-xl font-semibold">{t("suggest")} — Top 5</button>
              <Link href="#existing" className="flex-1 bg-panel border border-border1 py-3 rounded-xl text-center font-medium">{t("choose")}</Link>
            </div>
            {top5&&<div className="grid gap-3">{top5.map(c=><div key={c.crop} className="rounded-xl border border-border1 bg-panel p-4 flex justify-between"><div><div className="font-semibold capitalize">{c.crop}</div><div className="text-xs text-textMuted">Sowing {c.sowing} · Water {c.water_mm} mm → {(c.water_mm*Number(area)*(unit==="hectare"?1:0.404686)*10).toFixed(0)}k L · Suit {c.suit}</div></div><div className="text-right"><div className="font-mono font-semibold">ROI {c.roi}%</div><div className="text-xs text-warning">{c.warnings.join(", ")}</div></div></div>)}</div>}
          </div>
          <div className="rounded-xl border border-emeraldAccent/30 bg-page p-5">
            <div className="text-xs tracking-widest uppercase text-emeraldAccent font-semibold">Selected window (demo)</div>
            <div className="mt-2 text-2xl font-semibold font-mono text-emeraldAccent">82/100 · 05:30–08:45</div>
            <div className="text-sm text-textMuted">Rain after 12 PM — spray now. +18% · ≈₹3,400/acre (always paired)</div>
            <Link href="/dashboard" className="mt-4 inline-flex bg-emeraldAccent text-page px-4 py-2.5 rounded-lg font-semibold">{t("cta")} →</Link>
            <div className="mt-4 text-xs text-textMuted">Provenance: demo fixtures · Soil pH 6.4 Estimated · Forecast horizon 14d daily</div>
          </div>
        </div>
      </section>
      <section id="existing" className="rounded-2xl border border-border1 bg-card p-6 grid md:grid-cols-3 gap-4">
        <div><div className="text-sm font-semibold">Needed water</div><div className="text-xs text-textMuted">Cotton 700–1300 mm seasonal, 680 mm demo → litres for {area} {unit}</div></div>
        <div><div className="text-sm font-semibold">Compatibility [B1]</div><div className="text-xs text-textMuted">Soil 6.4 + climate + water → suitable, not yield guarantee</div></div>
        <div><div className="text-sm font-semibold">Time to harvest</div><div className="text-xs text-textMuted">GDD 2200–2600 for Cotton, variety widened</div></div>
      </section>
    </main>
  </div>;
}
