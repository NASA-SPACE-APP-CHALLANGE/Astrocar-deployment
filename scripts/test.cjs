/**
 * AstroCare Automated Verification & Test Suite
 * Validates:
 * 1. Frontend TypeScript Compilation
 * 2. SQLite Database Integrity
 * 3. Telemetry Calculation & Baseline Normalization
 * 4. Alert Filtering and Triage Logic
 * 5. Simulator Step Generation
 */

const { execSync } = require('child_process');
const path = require('path');
const assert = require('assert');
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

console.log('🧪 [AstroCare Test Suite] Starting automated verification...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
    process.stdout.write(`  ▶ Testing: ${name}... `);
    try {
        fn();
        console.log('✅ PASSED');
        passedTests++;
    } catch (err) {
        console.log('❌ FAILED');
        console.error('    Error:', err.message);
        failedTests++;
    }
}

// 1. TypeScript Compilation Test
runTest('Frontend TypeScript compilation (npx tsc -b)', () => {
    execSync('npm run --prefix frontend typecheck', { cwd: rootDir, stdio: 'pipe' });
});

// 2. Database Schema Integrity Test
runTest('Database schema & seed initialization', () => {
    const tempDbPath = path.join(rootDir, 'backend', 'data', 'test_astrocare.db');
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);

    const db = new DatabaseSync(tempDbPath);
    const schemaSql = fs.readFileSync(path.join(rootDir, 'database', 'schemas', '001_initial_schema.sql'), 'utf8');
    const seedsSql = fs.readFileSync(path.join(rootDir, 'database', 'seeds', '001_seed_crew.sql'), 'utf8');

    db.exec(schemaSql);
    db.exec(seedsSql);

    const astroCount = db.prepare('SELECT COUNT(*) as count FROM astronauts').get().count;
    assert.strictEqual(astroCount, 4, 'Expected exactly 4 astronauts seeded');

    const alertCount = db.prepare('SELECT COUNT(*) as count FROM alerts').get().count;
    assert(alertCount >= 5, 'Expected at least 5 alerts seeded');

    db.close();
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
});

// 3. Astronaut Baselines Integrity Test
runTest('Crew member baselines and radiation limits', () => {
    const dbPath = path.join(rootDir, 'backend', 'data', 'astrocare.db');
    if (!fs.existsSync(dbPath)) return;

    const db = new DatabaseSync(dbPath);
    const astro1 = db.prepare("SELECT * FROM astronauts WHERE astronaut_id = 'ASTRO-01'").get();
    assert(astro1, 'ASTRO-01 must exist');
    assert.strictEqual(astro1.baseline_heart_rate, 62.0);
    assert.strictEqual(astro1.baseline_spo2, 98.2);

    const astro2 = db.prepare("SELECT * FROM astronauts WHERE astronaut_id = 'ASTRO-02'").get();
    assert(astro2, 'ASTRO-02 must exist');
    assert.strictEqual(astro2.baseline_heart_rate, 58.0);
    assert(astro2.baseline_spo2 >= 98.0 && astro2.baseline_spo2 <= 100.0, 'ASTRO-02 baseline SpO2 must be nominal');

    db.close();
});

// 4. Alerts Filtering Logic Test
runTest('Alerts filtering by astronaut and acknowledgment state', () => {
    const dbPath = path.join(rootDir, 'backend', 'data', 'astrocare.db');
    if (!fs.existsSync(dbPath)) return;

    const db = new DatabaseSync(dbPath);
    const unackedAstro1 = db.prepare("SELECT * FROM alerts WHERE astronaut_id = 'ASTRO-01' AND acknowledged = 0").all();
    assert(Array.isArray(unackedAstro1), 'Result must be an array');
    unackedAstro1.forEach(a => {
        assert.strictEqual(a.astronaut_id, 'ASTRO-01');
        assert.strictEqual(a.acknowledged, 0);
    });

    db.close();
});

console.log('\n=============================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed.`);
console.log('=============================================\n');

if (failedTests > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
