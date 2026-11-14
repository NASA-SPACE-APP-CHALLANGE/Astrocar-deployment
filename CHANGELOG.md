# 📋 AstroCare Release Changelog

All notable changes to the **AstroCare: Astronaut Health Monitoring & Risk Management System** will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-11-14

### 🚀 Major Architectural Restructuring & Cross-Platform Desktop Packaging

This major release transforms the NASA Space Apps Challenge prototype into a production-grade, modular, cross-platform biomedical monitoring and mission risk management platform.

#### Added
- **Multi-Platform Desktop Packaging Suite:**
  - **Linux:** Native Debian `.deb` installer (`installers/linux/astrocare_2.0.0_amd64.deb`) with system menu integration (`astrocare.desktop`), hi-res scalable vector icon, and launcher wrapper (`/usr/bin/astrocare`).
  - **Linux Portable:** Standalone portable tarball bundle (`installers/linux/AstroCare-2.0.0-Linux-Portable.tar.gz`).
  - **Windows:** Nullsoft Scriptable Install System (NSIS) specification (`installers/windows/AstroCare-Setup.nsi`) and portable bundle (`installers/windows/AstroCare-2.0.0-Windows-Portable.zip`) with dual `.bat` launchers for browser and Electron modes.
  - **macOS:** Standard `.app` bundle (`installers/macos/AstroCare.app`) with `Info.plist`, `PkgInfo`, and background-server runner, plus DMG generation script (`installers/macos/create-dmg.sh`).
  - **Master Packaging Runner:** `npm run package:all` compiling and generating an artifact manifest across all three operating systems in seconds.
- **Unified Root Monorepo Orchestration:**
  - Root `package.json` with scripts: `dev`, `dev:backend`, `dev:frontend`, `build`, `lint`, `typecheck`, `test`, `desktop`, `package:linux`, `package:windows`, `package:mac`, `package:all`, `clean`.
  - Concurrent development runner (`scripts/dev.cjs`) managing backend and frontend processes with unified terminal output and coordinated SIGINT/SIGTERM shutdown.
  - Automated verification test runner (`scripts/test.cjs`) validating TypeScript typecheck, SQLite DDL migrations, crew seeds, and alert filtering logic.
  - Build cache cleaner (`scripts/clean.cjs`).
- **Standardized Database Structure:**
  - `database/schemas/001_initial_schema.sql`: Full DDL with indexes, foreign keys, and WAL pragma configuration.
  - `database/seeds/001_seed_crew.sql`: Artemis Expedition VII crew members and initial mission alerts.
- **Organized Documentation Architecture:**
  - Consolidated 20 project documentation specifications into `docs/project/`.
  - Consolidated 13 presentation slide files into `docs/presentation/`.
  - Authored standard root files: `ARCHITECTURE.md`, `DEVELOPMENT.md`, `INSTALLATION.md`, and `CHANGELOG.md`.

#### Fixed
- **AI Insights Anomaly Analytics Crash:** Fixed `can't access property "toLocaleString", result.records_analyzed is undefined` by aligning payload schemas between API routes and applying defensive nullish coalescing in `AIInsightsPage.tsx`.
- **Database Seed Constraint Violation:** Resolved `FOREIGN KEY constraint failed` in initial seed data by ensuring alert records reference valid telemetry reading IDs or null for crew-level advisories.
- **Type Checking Errors:** Added missing `typecheck` script to `frontend/package.json`, fixed `useAuth` hook imports across `AlertCenterPage.tsx`, `MissionDataPage.tsx`, and `MissionTimelinePage.tsx`, and aligned `Alert` interface in `types/index.ts`.
- **Debian Control Permissions:** Fixed `dpkg-deb: error: control directory has bad permissions 777` by explicitly enforcing `0755` permissions on Debian staging directories.
- **React Effect Cascading Renders:** Removed synchronous state setters from `useEffect` hooks in `Navbar.tsx`, `MissionEnvironmentBar.tsx`, and `BoxBreathingTool.tsx`.

#### Removed
- **Dead Code & Legacy Files:**
  - `frontend/src/components/DashboardSidebar.tsx` (replaced by unified horizontal navigation bar).
  - `frontend/src/services/healthMonitoringService.ts` (601 lines of unused mock telemetry generators).
  - Unused icon imports in `Navbar.tsx`, `WhatShouldIDoNowModal.tsx`, `SymptomCheckerModal.tsx`, and `HealthAnalyticsPage.tsx`.

---

## [1.2.0] - 2026-11-13

### Changed
- **Unified Navigation & Layout:** Removed isolated left sidebar from Live Monitoring; integrated into global responsive top navigation bar (`Navbar.tsx`) with active-state indicators and Launch Mission Console action.
- **Environment Stacking Order:** Fixed z-index hierarchy and stacking context for the `Switch Environment` dropdown menu in `MissionEnvironmentBar.tsx`.

---

## [1.1.0] - 2026-11-12

### Added
- **Astronaut Profile Loading Fix:** Resolved asynchronous astronaut baseline loading failure on `/dashboard/profile`.
- **NASA HRP Scientific Research Integration:** Added NASA 5 Hazards (R-I-D-G-E) and Canadian Space Agency (CSA) radiation and microgravity research modules to `/research`.

---

## [1.0.0] - 2026-10-05

### Added
- Initial project prototype built for the NASA Space Apps Challenge.
- Real-time telemetry monitoring for Heart Rate, SpO₂, Blood Pressure, Core Temperature, Radiation, and Activity.
- Isolation Forest anomaly detection algorithm.
- Interactive telemetry simulator with circadian and exercise scenario injection.
- Recharts historical telemetry visualization.

