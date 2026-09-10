# PRD Gap Analysis — Handwritten PRD vs Current Commits

Date: 2026-09-10  
Sources: 5 handwritten PRD grids (WINNING TEAM → R1/R2), `01-PHASE-1` master prompt, `AgriSense-AnnamAI b94a311e` snapshot, local `AgriSense` Vite mock (`#0D1013` 7-screen dark), `Agrisense2.0` empty.

> Current repo is a **visual shell**. It proves dark SaaS polish, not the product the PRD demands. Below is what the PRD says must exist and what is **still 0% in code or intentionally stubbed**.

## 1. Interface & Data — Backend contract missing
- **PRD:** `Interface: WhatsApp → Image+Text → Season Journal → Learning algo → Update context → AI model`.  
  **Have:** `WhatsAppPreview.tsx:1` renders 4 canned bubbles. No `POST /webhook`, no `X-Hub-Signature-256`, no media fetch, no `value.statuses[]`.
- **Data meteoblue:** `Location+Date → Temp/Rain/Humidity/Wind/Solar`. **Have:** `readinessMock.weather:26°C/62%/12→68%/8km/h` hard-coded. No `cehub/meteoblue/openmeteo` client, no `ForecastBundle` provenance.
- **Data CE Hub:** `1-14d Forecast → Temp High/Low, Rain, Humidity, Sunlight, Wind, Evaporation`. **Have:** static chips only.
- **Biostimulant model:** `crop+stage+age+problem+variety+sowing+last watering+soil(pH/OM/P/K/texture)+VPD/heatwave/solar → which biostimulant + expected yield increase`. **Have:** `Beauveria WP` text + 4 factor bars. No solver, no product fit.

## 2. Onboarding (P1-02) — The whole `First Time User` flow absent
PRD `1 Location Access → 2 Land Size → 3 Choose vs Suggest → 4 Input field → 5 Warning & Requirements → Dashboard`
Missing: `Use my location (tap) → deny fallback village/pincode/pin + never centroid-as-GPS`; `Land area acre/hectare with normalized echo`; `Choose existing crop vs Help me choose`; crop form `variety/planted-planning/sowing+transplant approximate/stage/problem checklist+text/irrigation/last watering`; `Soil Health Card: Yes/No/Upload Later → image/PDF → OCR → Review/Edit/Confirm + sample date/depth + Estimated label`; `Review + Idempotency-Key once` + draft restore. Current dashboard has no onboarding route.

## 3. Crop Choice & Comparison (P1-03) — R1/R2 core
PRD B shows two branches:
- Existing crop: `Compatibility[B1], Planting window, Harvest range, Needed water, Cost/Revenue, Warnings (Weather→Fungal), ROI[R1], Compare button`.
- Suggest one: `Top 5 ranked cards: Name, Water Litres+score, Compatibility score+reasons, ROI[R2], Harvest, Warnings, Sowing min-max` + sort `suitability|water|return|duration` + 2-column drawer + `intercropping area allocation`.
**Have:** No `POST /planning/compare`, no `CropPlan` type, no drawers. Need to distinguish `cotton kg vs rice kg` meaningless cross-crop yield % (needs named baseline).

## 4. Home / Field Switching (P1-04)
Need `field|crop|stage|Updated at|data source` + primary card `action|monitor|blocked|insufficient_data` + exact `[start,end)` interval + `Why this window` + 7-day tasks + water plan + profit estimate + weather/risk strip. Score is secondary. Missing: actionable pills (`confirm sowing date, add last irrigation, review soil test, add costs, log spray`), field/season query-key invalidation, 6 states (loading/empty/offline/stale/partial/no window/closed) with demo label persistence.

## 5. Readiness & Fit (P1-05)
Have gauge + static factors, missing: `14d daily stress projection vs hourly complete`, `2-3h window + alternatives, blocked hour reasons (rain wash-off, wind, Delta T, missing data, stage mismatch)`, `need|timing|viability split (missing=unknown not zero)`, `product suitability by verified SKU not Stress Buster/Yield Booster generics`, `Set reminder|I applied it|Ask about this` with prefill editable, fungal “conditions favor disease” not prescription.

## 6. Live ROI & Water (P1-06) — R1 distribution
PRD `R1: distribution values on time to harvest`. Need `yield, sales, cost, net profit, ROI p10/p50/p90, scenario vs calibrated, Assumptions, recorded vs forecast remaining spending`, debounced `What if` controls, negative margin valid. Water screen `ETc mm + litres (mm×area×10000), gross/net + efficiency, daily/7d vs seasonal, paddy ponded logic`. Have 2 numbers `+18%·₹3400` only.

## 7. Journal & Media (P1-07)
PRD: `Upload photo + 5 Actions: watered|sprayed fertiliser|biostimulant|pesticide|weed removed` (needs `observation|harvest` too). Timeline filters, form `date/time+text+photo/voice+qty/cost/product`, OCR/transcribe REVIEWABLE draft, retain original, resumable upload, revision audit, adherence badge. Have 4 static `JournalEntry` types, no uploads, no state machine.

## 8. Ask Assistant (P1-08) — Context & Mutations
Need text+voice+photo + field/season chips, explains with `dates+sources+links`, proposes `old→new` card + `POST /proposals/{id}/confirm|cancel` (`expected_version` conflict). Show “Why wait vs What did I spend vs I watered today”. Have no chatbot route.

## 9. Reminders & Todo (P1-09)
`Notification: History|per notification Done|Set remainder|When to spray|Watering` + `Todo Dashboard: next 7 days tick + importance` + `Task pending|done|snoozed|cancelled|expired` distinct from `Notification read` distinct from `Reminder schedule+quiet hours`. Have `Alerts.tsx:13` 4 static alerts only.

## 10. End Screen (P1-10)
`Click end → Enter final yield percent/money → Percentage accurate`. Need harvest `quantity+form+moisture+area+sales+costs+margin + comparison to immutable snapshots, zero yield valid, error handling`. Have no closure flow.

## 11. Auth, Tenancy, Roles (P1-01/11)
Need `/sign-in|up|reset|verification` via Firebase Auth Emulator, `POST /me` routing, `Bearer <ID token>` on every `api/v1`, 2 test accounts + denial, field archive, agronomist role-gated `stress-map|calendar|adherence|provider health`. Have hardcoded `Dr Deshmukh`.

## 12. Platform / Intelligence (P2/P3)
`backend/agrisense/agronomy` thresholds, `clients/` CE Hub/meteoblue/Open-Meteo typed providers, `science/facade.py` `evaluate_season/compare_crops/summarize_season`, durable `Cloud Tasks + outbox` (not coroutine), private `GCS` media, Gemini tool router (`google-genai` Vertex), `BigQuery` async, `MapLibre` + `PostgreSQL+Alembic`. Have none — mock delay only.

## Immediate fix order (vertical slices to kill “nothing is working”)
1. Gate `agrisense-contract-v1` tag → shared `contracts/openapi.yaml` + `PostgreSQL+Auth Emulator` bootstrap (Device 3).
2. Slice 1: Auth + Onboarding (makes auth 401s go away).
3. Slice 2: `POST /planning/compare` Top5 (unblocks Dashboard Choice).
4. Slice 3: Evaluate/Readiness/Hours+Why (makes gauge live).
5. Then economics/water/journal/chat/todo/end season.

**Verification checklist for manual browser pass:** Hit refresh as new user → `Use location` denied → manual pin → `acre|hectare` echo → `Choose vs Suggest` → soil upload review → save → home primary card → `Why` → set reminder → log spray outside window → timeline+ROI update.

Generated by build agent for `Jaideep-Thiruveedhi/Agrisense2.0` — do not mistake this shell for the product.
