export type ReadinessFactor = {
  id: string;
  label: string;
  weight: number; // 0-100
  value: string;
  detail: string;
  status: "favorable" | "neutral" | "unfavorable";
};

export type ReadinessData = {
  score: number; // 0-100
  statusLabel: string;
  window: string; // e.g. "05:30–08:45 AM"
  windowDateLabel: string; // e.g. "Tomorrow"
  crop: string;
  location: string;
  product: string;
  efficacyGainPercent: number; // +18
  efficacyGainRupeesPerAcre: number; // 3400
  wasteAvoidedPercent: number; // 54
  yieldProtectionTPerHa: number; // 2.2
  factors: ReadinessFactor[];
  weather: {
    temp: string;
    humidity: string;
    rainChance: string;
    wind: string;
  };
  cropStage: {
    stage: string;
    daysAfterSowing: number;
    vigor: string;
  };
  pestStatus: {
    pest: string;
    stage: string;
    pressure: string;
  };
  lastUpdated: string;
};

export type FitMetric = {
  id: string;
  label: string;
  value: string;
  range: string;
  status: "pass" | "fail" | "concern";
  note: string;
};

export type FitCheckData = {
  verdict: "fit" | "concern" | "not-fit";
  verdictLabel: string;
  summary: string;
  product: string;
  crop: string;
  metrics: FitMetric[];
  recommendation: string;
};

export type AlertItem = {
  id: string;
  type: "rain" | "heat" | "window" | "pest" | "wind";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  time: string;
  field: string;
  action: string;
};

export type JournalEntry = {
  id: string;
  type: "application" | "photo" | "voice" | "outcome";
  title: string;
  description: string;
  timestamp: string;
  timeLabel: string;
  meta?: string;
  image?: string;
};

export type SeasonHistoryPoint = {
  season: string;
  confidence: number;
  yield: number;
};

export type SeasonHistoryData = {
  points: SeasonHistoryPoint[];
  stats: {
    outcomesLogged: number;
    confidenceGainPercent: number;
    fieldsContributing: number;
  };
};

export type DashboardStats = {
  activeApplications: number;
  fieldsMonitored: number;
  highRiskAlerts: number;
  avgReadiness: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  dot: string; // color hex
};

export type WhatsAppMessage = {
  from: "farmer" | "agrisense";
  textEn: string;
  textMr: string;
  time: string;
};
