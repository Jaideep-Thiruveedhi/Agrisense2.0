/**
 * Mock service layer — named to match real backend endpoints
 * so swapping to real fetch is a drop-in replacement.
 *
 * Endpoint mapping:
 * getReadiness()     → GET /readiness
 * getFitCheck()      → GET /fit-check
 * getSeasonJournal() → GET /journal
 * getSeasonHistory() → GET /history
 * getAlerts()        → GET /alerts
 * getDashboardStats()→ GET /dashboard (aggregation)
 * getWhatsAppPreview()→ GET /whatsapp/preview (mock)
 */

import {
  readinessMock,
  fitCheckMock,
  alertsMock,
  journalMock,
  seasonHistoryMock,
  dashboardStatsMock,
  activityMock,
  whatsappMock,
} from "../data/mockData";
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

// Simulate tiny network latency for realism
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function getReadiness(): Promise<ReadinessData> {
  await delay(80);
  return readinessMock;
}

export async function getFitCheck(): Promise<FitCheckData> {
  await delay(80);
  return fitCheckMock;
}

export async function getSeasonJournal(): Promise<JournalEntry[]> {
  await delay(80);
  return journalMock;
}

export async function getSeasonHistory(): Promise<SeasonHistoryData> {
  await delay(80);
  return seasonHistoryMock;
}

export async function getAlerts(): Promise<AlertItem[]> {
  await delay(80);
  return alertsMock;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(80);
  return dashboardStatsMock;
}

export async function getActivity(): Promise<ActivityItem[]> {
  await delay(60);
  return activityMock;
}

export async function getWhatsAppPreview(): Promise<WhatsAppMessage[]> {
  await delay(60);
  return whatsappMock;
}
