"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SignIn(){
  const r=useRouter();
  const [email,setEmail]=useState(process.env.NEXT_PUBLIC_DEV_TEST_EMAIL||"");
  const [password,setPassword]=useState("");
  const [show,setShow]=useState(false);
  const [err,setErr]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const onSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr(null); setLoading(true);
    try{ await signInWithEmailAndPassword(auth,email,password); const t=await auth.currentUser?.getIdToken(); localStorage.setItem("agrisense_token",t||""); r.push("/onboarding"); }
    catch(ex:any){ setErr(ex.message?.includes("auth")?"Invalid email or password.":ex.message); setLoading(false); }
  };
  return <div className="min-h-screen bg-page grid place-items-center px-6 py-12">
    <form onSubmit={onSubmit} className="w-full max-w-[420px] rounded-2xl border border-border1 bg-card p-6 space-y-4">
      <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-lg bg-emeraldAccent grid place-items-center text-page font-bold">A</div><span className="font-semibold">AgriSense</span><span className="ml-auto text-xs border border-border1 rounded-full px-2 py-1 text-textMuted">EN/HI/MR/PA/TE</span></div>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="text-sm text-textMuted">Use the dev account created via this screen — no bypass. Second tenant will be denied.</p>
      <label className="block text-sm">Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="device1@example.test" required className="mt-1 w-full bg-panel border border-border1 rounded-lg px-3 py-2.5" /></label>
      <label className="block text-sm">Password<div className="mt-1 flex gap-2"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required className="flex-1 bg-panel border border-border1 rounded-lg px-3 py-2.5"/><button type="button" onClick={()=>setShow(s=>!s)} className="px-3 rounded-lg border border-border1 text-sm">{show?"Hide":"Show"}</button></div></label>
      {err&&<div className="rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm p-3" role="alert">{err}</div>}
      <button type="submit" disabled={loading} className="w-full bg-emeraldAccent text-page font-semibold py-3 rounded-xl disabled:opacity-60">{loading?"Signing in…":"Sign in"}</button>
      <div className="text-sm text-center"><Link href="/sign-up" className="text-emeraldAccent underline">Create account</Link> · <Link href="/" className="text-textMuted underline">Home</Link></div>
      <div className="text-xs text-textMuted border-t border-border1 pt-3">Emulator: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL||"not set (prod needs real Firebase)"} — <Link href="/dev/verify" className="underline">/dev/verify harness</Link></div>
    </form>
  </div>;
}
