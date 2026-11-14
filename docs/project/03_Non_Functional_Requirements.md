# 03 — Non-Functional Requirements Specification

---

## 1. Non-Functional Requirements Matrix (NFR-01 to NFR-06)

The following non-functional requirements define the quality attributes, performance envelopes, security posture, and maintainability criteria of AstroCare.

### NFR-01: Performance & Latency Requirements
- **NFR-01.1 (Initial Bundle Size):** The production JavaScript bundle shall not exceed 500 kB (uncompressed) to enable rapid transmission over bandwidth-constrained spacecraft local networks. *Achieved:* `342.64 kB` (Gzip: `111.16 kB`).
- **NFR-01.2 (Route Code-Splitting):** All 15 application page views shall be dynamically code-split using `React.lazy()`, with individual chunk payloads remaining below 50 kB. *Achieved:* `2.2 kB – 41.5 kB`.
- **NFR-01.3 (Client Render Time):** Interactive telemetry chart re-renders and table sorting shall complete in under 50 milliseconds on standard computing hardware.
- **NFR-01.4 (Build Performance):** Production build compilation (`tsc -b && vite build`) shall execute in under 10.0 seconds. *Achieved:* `4.03s – 7.22s`.
- **NFR-01.5 (Simulation Packet Latency):** Synthetic telemetry packet generation shall complete in under 30 milliseconds per 30-minute operational step.

### NFR-02: Reliability, Availability & Fault Tolerance
- **NFR-02.1 (Subsystem Isolation):** The application shall enclose all route components within a React Error Boundary (`ErrorBoundary.tsx`) to catch runtime rendering exceptions without bringing down the global application shell.
- **NFR-02.2 (Offline Resilience & Fallback):** If the backend REST API is unreachable, offline, or blocked by network isolation, all frontend modules shall automatically fall back to deterministic spaceflight simulation engines without throwing uncaught exceptions.
- **NFR-02.3 (Data Integrity):** Relational database transactions (SQLite) shall adhere to ACID principles, ensuring zero data loss during concurrent simulation steps and alert acknowledgments.

### NFR-03: Usability, Ergonomics & Design Standards
- **NFR-03.1 (Consistent Visual Identity):** The user interface shall strictly adhere to the bespoke **Orbital Glass** design system across all 15 modules:
  - Background color: `var(--deep-space)` (`#030712` / `#050816`)
  - Accent colors: `var(--electric-cyan)` (`#53E7FF`), `var(--aurora-violet)` (`#9275FF`), `var(--critical-coral)` (`#FF647C`), `var(--warning-amber)` (`#FFCA72`), `var(--success-mint)` (`#5DF2B4`)
  - Card styling: `.glass-card` with `12px` backdrop blur, subtle borders, and glowing hover transitions.
- **NFR-03.2 (Typography & Readability):** Monospace fonts (`JetBrains Mono`) shall be used for all critical numerical telemetry readings, timestamps, and anomaly scores to maximize rapid optical scanning in microgravity.
- **NFR-03.3 (Responsive Grid Alignment):** The user interface shall adapt seamlessly across Desktop (1920x1080), Laptop (1366x768), Tablet (1024x768), and Mobile (375x667) resolutions without horizontal scrollbars or overlapping text elements.

### NFR-04: Security, Privacy & Compliance
- **NFR-04.1 (Medical Privacy Standards):** Telemetry streams used in demonstrations shall be explicitly labeled as **Simulated Demonstration Data** in compliance with NASA Space Apps Challenge ethical standards and federal health privacy regulations (HIPAA).
- **NFR-04.2 (Input Sanitization):** User inputs across search bars, alert review forms, and report generator titles shall be sanitized to prevent cross-site scripting (XSS) and injection attacks.
- **NFR-04.3 (Strict Origin & CORS Isolation):** Backend API services shall enforce explicit CORS domain white-listing and prevent unauthenticated mutation of flight surgeon baselines.

### NFR-05: Maintainability, Modularity & Code Quality
- **NFR-05.1 (TypeScript Strictness):** The codebase shall compile with zero TypeScript errors under strict mode (`tsc -b`) and enforce explicit `import type` annotations under `verbatimModuleSyntax`.
- **NFR-05.2 (Clean Architecture):** Separation of concerns shall be maintained: UI components in `components/`, page views in `pages/`, business logic in `services/`, state management in `context/` and `hooks/`, and data contracts in `types/`.
- **NFR-05.3 (Dead Code Pruning):** Unused dependencies and orphaned configuration files (such as unused `framer-motion` or abandoned `tailwind.config.js`) shall be pruned to maintain repository hygiene.

### NFR-06: Interoperability & Export Standards
- **NFR-06.1 (Open Data Formats):** Telemetry exports and report summaries shall output in standard RFC-4180 compliant Comma-Separated Values (CSV) format.
- **NFR-06.2 (Browser-Native Printing):** Mission health evaluation reports shall utilize `@media print` CSS rules, stripping interactive navigation and dark backgrounds to produce clean white-paper clinical documentation.

