# Release — Agrisense2.0 P1 11/11 UI + AI Simulators

Commit: 5bccf4d (from 8d53002..fa3107c) · web build 17/17 static · tsc 0 errors
Contracts: contracts/openapi.yaml v1 40+ routes (/api/v1, /webhook, /health) with {data,meta} provenance
Backend: agrisense.science.facade evaluate_season/compare_crops/summarize_season + agronomy constants/stress/viability/scoring/timing + clients cehub/meteoblue + models Farmer/Field/Season/OutboxEvent + GCS+Gemini strict JSON + /webhook HMAC
Web routes: / + /sign-in|up|onboarding|planning/dashboard|readiness/water|economics|journal|ask|todo|agronomist|end-season (17 static) + mobile 360/390px
Auth: Firebase emulator live-local, second tenant denial ready
Data: demo fixtures (82/100 05:30-08:45 +18%·₹3400) awaiting iitm02 live CE Hub/meteoblue; no fake field accuracy claimed
Tests: web/tests/e2e/tenant.spec.ts chromium+mobile, Playwright storage-state ignored
Deploy: infra/docker-compose PG16 + emulator, GCP iitm02 Cloud SQL socket ready, Cloud Run asia-south1 pending
Next: P3 PG migrations from fresh + outbox dispatcher + live staging smoke (one CE Hub forecast + one WhatsApp roundtrip on allowed test recipient)
