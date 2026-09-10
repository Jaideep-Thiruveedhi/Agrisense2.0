import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOUR_STEPS = [
  { path: "/", label: "Dashboard", caption: "Live field pulse — 4 stats, WhatsApp reply, and activity in one glance." },
  { path: "/readiness", label: "Readiness", caption: "The score judges stare at — 82/100 with the window, gain, and why it’s ready." },
  { path: "/fit-check", label: "Fit check", caption: "Pass/fail biology — soil, humidity, UV verdict before you waste a spray." },
  { path: "/alerts", label: "Alerts", caption: "Early warnings that compress to one WhatsApp line: rain after 12, spray now." },
  { path: "/journal", label: "Season journal", caption: "From WhatsApp voice to outcome — every step timestamped, no data lost." },
  { path: "/learning", label: "Learning", caption: "Proof it learns — confidence climbing 62 → 87 across 4 seasons." },
] as const;

export function useTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const start = useCallback(() => {
    setActive(true);
    setStep(0);
    navigate(TOUR_STEPS[0].path);
  }, [navigate]);

  const stop = useCallback(() => setActive(false), []);
  const next = useCallback(() => {
    setStep((s) => {
      const ns = s + 1;
      if (ns >= TOUR_STEPS.length) {
        setActive(false);
        return s;
      }
      navigate(TOUR_STEPS[ns].path);
      return ns;
    });
  }, [navigate]);
  const prev = useCallback(() => {
    setStep((s) => {
      const ns = Math.max(0, s - 1);
      navigate(TOUR_STEPS[ns].path);
      return ns;
    });
  }, [navigate]);

  // auto-advance every 3.5s when active
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setStep((s) => {
        const ns = s + 1;
        if (ns >= TOUR_STEPS.length) {
          setActive(false);
          return s;
        }
        navigate(TOUR_STEPS[ns].path);
        return ns;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [active, navigate]);

  return {
    active,
    step,
    current: TOUR_STEPS[step],
    steps: TOUR_STEPS,
    total: TOUR_STEPS.length,
    start,
    stop,
    next,
    prev,
  };
}

export type TourHook = ReturnType<typeof useTour>;
