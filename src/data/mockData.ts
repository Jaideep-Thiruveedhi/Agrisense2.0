import type {
  ReadinessData,
  FitCheckData,
  AlertItem,
  JournalEntry,
  SeasonHistoryData,
  DashboardStats,
  ActivityItem,
  WhatsAppMessage,
} from "../types";

export const readinessMock: ReadinessData = {
  score: 82,
  statusLabel: "Ready — optimal window open",
  window: "05:30–08:45 AM",
  windowDateLabel: "Tomorrow",
  crop: "Cotton · BG-II",
  location: "Akola, MH · 20.70°N, 77.00°E",
  product: "Beauveria bassiana · WP",
  efficacyGainPercent: 18,
  efficacyGainRupeesPerAcre: 3400,
  wasteAvoidedPercent: 54,
  yieldProtectionTPerHa: 2.2,
  factors: [
    {
      id: "rain",
      label: "Rain probability",
      weight: 34,
      value: "12% before 12 PM",
      detail: "Dry window holds until noon, then 68% risk",
      status: "favorable",
    },
    {
      id: "temp",
      label: "Temperature band",
      weight: 26,
      value: "24–28°C at spray time",
      detail: "Inside 22–30°C viability band for B. bassiana",
      status: "favorable",
    },
    {
      id: "pest",
      label: "Pest life-stage",
      weight: 24,
      value: "2nd instar dominant",
      detail: "Most susceptible larval window — next 36h critical",
      status: "favorable",
    },
    {
      id: "decay",
      label: "Application decay",
      weight: 16,
      value: "UV low before 09:00",
      detail: "Spore viability drops 40% after 10:30 AM sun",
      status: "neutral",
    },
  ],
  weather: {
    temp: "26°C · Partly cloudy",
    humidity: "62% RH",
    rainChance: "12% until 12 PM → 68% after",
    wind: "8 km/h NE · ideal",
  },
  cropStage: {
    stage: "Square formation",
    daysAfterSowing: 48,
    vigor: "Vigorous · 92% canopy",
  },
  pestStatus: {
    pest: "Pink bollworm",
    stage: "2nd instar · 62% of sample",
    pressure: "Moderate · 8 larvae / 20 bolls",
  },
  lastUpdated: "09 Sep · 12:30 PM IST",
};

export const fitCheckMock: FitCheckData = {
  verdict: "fit",
  verdictLabel: "Fit — conditions favorable",
  summary:
    "Beauveria bassiana is well-suited for the current field microclimate. All 3 critical tolerances pass.",
  product: "Beauveria bassiana · WP (1×10⁸ CFU/g)",
  crop: "Cotton — Akola Plot 3B",
  metrics: [
    {
      id: "ph",
      label: "Soil pH",
      value: "6.4",
      range: "Tolerance 5.5 – 7.5",
      status: "pass",
      note: "Optimal for spore germination. No amendment needed.",
    },
    {
      id: "humidity",
      label: "Humidity",
      value: "62% RH",
      range: "Required ≥ 55% for 6h",
      status: "pass",
      note: "Morning RH holds above threshold until 11 AM.",
    },
    {
      id: "uv",
      label: "UV exposure",
      value: "Low · 2.8 UVI",
      range: "Safe < 4.0 before 09:00",
      status: "pass",
      note: "Early window avoids lethal UV. Spray before 08:45.",
    },
  ],
  recommendation:
    "Proceed in the 05:30–08:45 window with 0.5% jaggery sticker. Avoid mixing with copper fungicides 48h either side.",
};

export const alertsMock: AlertItem[] = [
  {
    id: "a1",
    type: "rain",
    severity: "high",
    title: "Rain closing window — spray now",
    description:
      "IMD now shows 68% rain after 12 PM tomorrow. Efficacy drops 40% if applied within 4h of rain.",
    time: "2h ago",
    field: "Plot 3B · Akola",
    action: "Advise 05:30–08:45 window",
  },
  {
    id: "a2",
    type: "heat",
    severity: "medium",
    title: "Heat stress after 10:30 AM",
    description:
      "UV index rises to 7.2 by 11 AM. Beauveria viability falls 40% in direct sun — early morning only.",
    time: "5h ago",
    field: "All cotton · Akola",
    action: "Restrict to early window",
  },
  {
    id: "a3",
    type: "window",
    severity: "medium",
    title: "Pest window narrowing — 36h left",
    description:
      "2nd instar larvae will moult to 3rd instar within 36h. Later control needs 2× dose — act this window.",
    time: "8h ago",
    field: "Plot 3B · 8 larvae/20 bolls",
    action: "Prioritize application",
  },
  {
    id: "a4",
    type: "wind",
    severity: "low",
    title: "Wind drift risk — gentle 14 km/h after 10 AM",
    description: "Drift risk increases after 10 AM. Current 8 km/h is ideal for even canopy coverage.",
    time: "Yesterday",
    field: "Plot 3B",
    action: "Monitor, no action needed",
  },
];

export const journalMock: JournalEntry[] = [
  {
    id: "j1",
    type: "application",
    title: "Application recorded",
    description:
      "Beauveria bassiana WP · 400g/acre with jaggery sticker. Spray volume 200L/acre. Operator: R. Pawar.",
    timestamp: "2026-09-08T05:45:00+05:30",
    timeLabel: "08 Sep · 05:45 AM",
    meta: "Plot 3B · 05:30–08:45 window · 82/100 readiness",
  },
  {
    id: "j2",
    type: "photo",
    title: "Field photo logged",
    description: "Canopy & boll status — square formation, 92% vigor. Photo verified via WhatsApp.",
    timestamp: "2026-09-08T06:15:00+05:30",
    timeLabel: "08 Sep · 06:15 AM",
    meta: "WhatsApp · +91 98•••••321 · 1 image",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "j3",
    type: "voice",
    title: "Voice update — farmer",
    description:
      '"Pichkari ho gayi, mausam saaf tha. Kal subah dekhenge." → Spray done, weather was clear. Will check tomorrow morning.',
    timestamp: "2026-09-08T07:02:00+05:30",
    timeLabel: "08 Sep · 07:02 AM",
    meta: "WhatsApp voice · 0:18 · Marathi → translated",
  },
  {
    id: "j4",
    type: "outcome",
    title: "Outcome logged — Day 3 observation",
    description:
      "Larval count down from 8 to 3 per 20 bolls (–62%). No phytotoxicity. Efficacy gain validated at +18%.",
    timestamp: "2026-09-11T09:30:00+05:30",
    timeLabel: "11 Sep · 09:30 AM",
    meta: "Field visit · Advisor: Dr. Deshmukh · +₹3,400/acre realized",
  },
];

export const seasonHistoryMock: SeasonHistoryData = {
  points: [
    { season: "Kharif 2024", confidence: 62, yield: 1.8 },
    { season: "Rabi 2024", confidence: 71, yield: 2.0 },
    { season: "Kharif 2025", confidence: 79, yield: 2.3 },
    { season: "Rabi 2025", confidence: 87, yield: 2.5 },
  ],
  stats: {
    outcomesLogged: 128,
    confidenceGainPercent: 25,
    fieldsContributing: 34,
  },
};

export const dashboardStatsMock: DashboardStats = {
  activeApplications: 12,
  fieldsMonitored: 34,
  highRiskAlerts: 3,
  avgReadiness: 76,
};

export const activityMock: ActivityItem[] = [
  {
    id: "ac1",
    title: "Readiness updated — Plot 3B → 82/100",
    desc: "Window opened: Tomorrow 05:30–08:45 AM · +18% efficacy",
    time: "12:30 PM",
    dot: "#2ED9A0",
  },
  {
    id: "ac2",
    title: "Fit check passed — Plot 7A",
    desc: "B. bassiana fit for humidity & UV · all 3 metrics pass",
    time: "11:15 AM",
    dot: "#2ED9A0",
  },
  {
    id: "ac3",
    title: "Alert triggered — rain after 12 PM",
    desc: "High severity · Akola block · advise early window",
    time: "09:40 AM",
    dot: "#E8A33D",
  },
  {
    id: "ac4",
    title: "Voice update transcribed — Marathi",
    desc: "Farmer confirmed spray completion · auto-logged to journal",
    time: "07:02 AM",
    dot: "#8B9490",
  },
];

export const whatsappMock: WhatsAppMessage[] = [
  {
    from: "farmer",
    textEn: "Sahab, should I spray today? Worms in cotton.",
    textMr: "साहेब, आज फवारणी करावी का? कापसात अळी आहे.",
    time: "06:02 AM",
  },
  {
    from: "agrisense",
    textEn: "*Best window: Tomorrow, 05:30–08:45 AM.* Rain after 12 PM — spray now, not later. (+18% efficacy · ≈₹3,400/acre)",
    textMr: "*उत्तम वेळ: उद्या सकाळी 05:30–08:45.* दुपारी 12 नंतर पाऊस — आजच फवारा. (+18% परिणाम · ≈₹3,400/एकर)",
    time: "06:03 AM",
  },
  {
    from: "farmer",
    textEn: "Okay, will spray at 6 AM. Which medicine?",
    textMr: "ठीक आहे, सकाळी 6 वाजता फवारणी करतो. कोणते औषध?",
    time: "06:04 AM",
  },
  {
    from: "agrisense",
    textEn: "Beauveria bassiana 400g/acre + jaggery 0.5%. *Avoid after 10:30 AM — sun kills it.*",
    textMr: "ब्युव्हेरिया बॅसियाना 400ग्रॅम/एकर + गूळ 0.5%. *सकाळी 10:30 नंतर नको — उन्हाने औषध खराब होते.*",
    time: "06:04 AM",
  },
];
