# 🛠️ AstroCare Developer Guide & Contribution Standards

> **AstroCare: Astronaut Health Monitoring & Risk Management System**  
> NASA Space Apps Challenge — Developer Onboarding and Engineering Standards (v2.0.0)

---

## 1. Prerequisites & Environment Setup

### Minimum System Requirements
- **Node.js**: v18.0.0 or higher (v20+ or v22 LTS recommended)
- **npm**: v9.0.0 or higher
- **Git**: v2.30+
- *(Optional for ML model training)* **Python**: v3.11+ with `pip`

### Initial Repository Setup
Clone the repository and install root and frontend dependencies:

```bash
git clone https://github.com/AlgoX-NASA/AstroCare.git
cd AstroCare

# Install frontend dependencies
npm run --prefix frontend install
```

---

## 2. Directory Layout & Architecture Map

```
AstroCare/
├── backend/                  # Application backend implementations
│   ├── server.cjs            # Zero-dependency Node.js native telemetry core
│   ├── main.py               # Python FastAPI ML application entry point
│   ├── models/               # Pydantic schemas and database models
│   ├── routers/              # Modular API endpoints (readings, alerts, reports)
│   └── services/             # Isolation Forest anomaly engine & simulators
├── database/                 # Structured database architecture
│   ├── schemas/              # Relational SQL schemas (001_initial_schema.sql)
│   └── seeds/                # Mission crew seed data (001_seed_crew.sql)
├── desktop/                  # Electron cross-platform desktop shell
│   ├── main.cjs              # Electron main process & child lifecycle manager
│   ├── preload.cjs           # Context bridge with secure API isolation
│   └── start.cjs             # Standalone desktop runner
├── docs/                     # Comprehensive documentation library
│   ├── project/              # 20 architectural & scientific spec documents
│   └── presentation/         # 13 presentation slide summaries & pitch materials
├── frontend/                 # React 19 + TypeScript mission console
│   ├── public/               # Favicon, NASA imagery, and static assets
│   └── src/
│       ├── components/       # Reusable UI widgets (Navbar, Modals, Cards)
│       ├── context/          # React Context providers (AuthContext, EnvContext)
│       ├── hooks/            # Custom hooks (useAuth, useTelemetry)
│       ├── pages/            # 16 route pages (Dashboard, AIInsights, etc.)
│       ├── services/         # API client & clinical countermeasure library
│       └── types/            # TypeScript interfaces & domain models
├── installers/               # Generated deployment artifacts
│   ├── linux/                # .deb packages and portable tarballs
│   ├── windows/              # NSIS installer scripts and portable zip bundles
│   └── macos/                # .app bundles, DMG helpers, and tarballs
├── scripts/                  # Cross-platform orchestration utilities
│   ├── dev.cjs               # Concurrent dev runner with graceful shutdown
│   ├── test.cjs              # Automated test & verification suite
│   ├── clean.cjs             # Build artifact & cache cleanup
│   ├── package-linux.cjs     # Linux Debian & portable packager
│   ├── package-windows.cjs   # Windows NSIS & zip packager
│   ├── package-mac.cjs       # macOS app bundle packager
│   └── package-all.cjs       # Master multi-platform packaging runner
├── ARCHITECTURE.md           # Deep-dive system architecture specification
├── DEVELOPMENT.md            # Developer guidelines & contribution standards
├── INSTALLATION.md           # Multi-platform deployment & install instructions
├── CHANGELOG.md              # Version release history & refactoring log
└── package.json              # Unified root workspace configuration
```

---

## 3. Unified Root Scripts

All operations are executable directly from the repository root:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs backend server and frontend Vite dev server concurrently with auto-reload. |
| `npm run dev:backend` | Starts only the Node.js native telemetry engine on port 8000. |
| `npm run dev:frontend` | Starts only the Vite frontend dev server on port 5173. |
| `npm run build` | Compiles the production TypeScript frontend bundle into `frontend/dist/`. |
| `npm run typecheck` | Executes strict TypeScript compilation checks (`tsc -b`) across all frontend files. |
| `npm run lint` | Runs the high-speed code linter (`oxlint`) across the codebase. |
| `npm run test` | Executes the automated test suite (database schema, crew seeds, alert filters). |
| `npm run desktop` | Launches the AstroCare application in standalone desktop mode. |
| `npm run package:linux` | Compiles the Debian `.deb` package and portable Linux `.tar.gz` bundle. |
| `npm run package:windows` | Generates the NSIS installer specification and portable Windows `.zip` archive. |
| `npm run package:mac` | Builds the native macOS `.app` bundle and portable `.tar.gz` archive. |
| `npm run package:all` | Compiles and validates all distribution packages across Linux, Windows, and macOS. |
| `npm run clean` | Deletes build caches, temporary staging folders, and generated bundles. |

---

## 4. Engineering Standards & Coding Guidelines

### 4.1 TypeScript & Type Safety
1. **No Implicit Any:** Always define explicit types or interfaces for parameters, return values, and API responses.
2. **Defensive Data Access:** Never assume backend numeric fields are defined. Use optional chaining and nullish coalescing:
   ```typescript
   // ❌ Bad: Throws TypeError if records_analyzed is undefined
   <span>{result.records_analyzed.toLocaleString()}</span>

   // ✅ Good: Graceful fallback ensures UI resilience
   <span>{(result?.records_analyzed ?? 0).toLocaleString()}</span>
   ```
3. **Domain Types:** Keep interfaces synchronized in `frontend/src/types/index.ts`.

### 4.2 React Component Best Practices
1. **Avoid Cascading Renders:** Do not call state setters synchronously inside `useEffect` on route changes. Handle transitions in event handlers or derive states during render.
2. **Memoize Complex Calculations:** Use `useMemo` for filtering high-frequency telemetry readings or computing multi-day statistical trends.
3. **Stable Event Callbacks:** Wrap API query dispatchers in `useCallback` when passed to dependency arrays or child components.
4. **Subsystem Error Boundaries:** Wrap mission-critical widgets in `<ErrorBoundary>` to isolate localized component faults.

### 4.3 Backend Engineering
1. **Zero External Dependencies in Production:** `backend/server.cjs` must remain standalone and rely exclusively on Node.js built-in modules (`node:http`, `node:sqlite`, `node:fs`, `node:crypto`).
2. **Parameterized Queries:** Always execute SQL via prepared statements (`db.prepare('...').get(...)` or `.all(...)`). Never concatenate raw SQL strings.
3. **CORS & Preflight Handling:** Ensure `OPTIONS` preflight requests receive appropriate headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`).

---

## 5. Testing & Quality Assurance

Run the test suite before submitting pull requests:

```bash
npm run typecheck
npm run lint
npm run test
```

### Adding New Test Scenarios
Tests are located in `scripts/test.cjs`. To introduce a new automated check:
```javascript
test('Your descriptive test title', () => {
  // Perform setup or database query
  const result = db.prepare('SELECT ...').get();
  assert(result !== undefined, 'Query must return valid result');
});
```

---

## 6. Git Workflow

- **`master` / `main`**: Production-ready, deployable codebase.
- **Commit Format:** Use semantic commit prefixes:
  - `feat:` New feature or mission module.
  - `fix:` Bug fix or UI alignment.
  - `refactor:` Code cleanup, dead code elimination, or performance tuning.
  - `docs:` Documentation or presentation material updates.
  - `build:` Build system, packaging, or dependency adjustments.

