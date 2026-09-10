import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Readiness from "./pages/Readiness";
import FitCheck from "./pages/FitCheck";
import Alerts from "./pages/Alerts";
import Journal from "./pages/Journal";
import Learning from "./pages/Learning";
import Settings from "./pages/Settings";
import { useTour } from "./hooks/useTour";

// Wrapper to use useTour inside BrowserRouter
function AppRoutes({ demoWatermark, setDemoWatermark }: { demoWatermark: boolean; setDemoWatermark: (v:boolean)=>void }) {
  const tour = useTour();
  return (
    <Routes>
      <Route element={<AppLayout tour={tour} demoWatermark={demoWatermark} setDemoWatermark={setDemoWatermark} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/readiness" element={<Readiness />} />
        <Route path="/fit-check" element={<FitCheck />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/settings" element={<Settings demoWatermark={demoWatermark} setDemoWatermark={setDemoWatermark} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [demoWatermark, setDemoWatermark] = useState(false);
  return (
    <BrowserRouter>
      <AppRoutes demoWatermark={demoWatermark} setDemoWatermark={setDemoWatermark} />
    </BrowserRouter>
  );
}
