import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "AgriSense — Biological Timing", description: "India-first farm planning companion" };
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
