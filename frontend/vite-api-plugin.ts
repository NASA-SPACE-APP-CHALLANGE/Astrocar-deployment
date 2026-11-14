/**
 * AstroCare Embedded Mission API Middleware for Vite Dev Server
 * Provides deterministic, high-fidelity REST API endpoints directly within Vite
 * Guarantees zero-network-barrier execution, no ECONNREFUSED errors, and immediate sub-millisecond responses.
 */
import type { Plugin, ViteDevServer } from 'vite';

interface AstronautRecord {
    astronaut_id: string;
    name: string;
    role: string;
    mission_id: string;
    mission_duration_days: number;
    current_mission_day: number;
    baseline_heart_rate: number;
    baseline_spo2: number;
    baseline_body_temp: number;
    baseline_systolic_bp: number;
    baseline_diastolic_bp: number;
    baseline_sleep_hours: number;
    baseline_activity_mets: number;
    max_radiation_limit_msv: number;
    current_cumulative_radiation_msv: number;
    avatar_url: string;
    monitoring_preferences?: string;
    created_at: string;
}

const astronautsDb: Record<string, AstronautRecord> = {
    'ASTRO-01': {
        astronaut_id: 'ASTRO-01',
        name: 'CDR Alex Vance',
        role: 'Mission Commander / Systems Pilot',
        mission_id: 'ARTEMIS-VII',
        mission_duration_days: 180,
        current_mission_day: 142,
        baseline_heart_rate: 62.0,
        baseline_spo2: 98.2,
        baseline_body_temp: 36.6,
        baseline_systolic_bp: 118.0,
        baseline_diastolic_bp: 76.0,
        baseline_sleep_hours: 7.5,
        baseline_activity_mets: 3.8,
        max_radiation_limit_msv: 200.0,
        current_cumulative_radiation_msv: 42.6,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
    },
    'ASTRO-02': {
        astronaut_id: 'ASTRO-02',
        name: 'Dr. Sarah Chen',
        role: 'Chief Medical Officer / EVA Specialist',
        mission_id: 'ARTEMIS-VII',
        mission_duration_days: 180,
        current_mission_day: 142,
        baseline_heart_rate: 58.0,
        baseline_spo2: 98.8,
        baseline_body_temp: 36.7,
        baseline_systolic_bp: 112.0,
        baseline_diastolic_bp: 72.0,
        baseline_sleep_hours: 8.0,
        baseline_activity_mets: 4.2,
        max_radiation_limit_msv: 200.0,
        current_cumulative_radiation_msv: 38.4,
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
    },
    'ASTRO-03': {
        astronaut_id: 'ASTRO-03',
        name: 'Marcus Thorne',
        role: 'Flight Engineer / Habitats Specialist',
        mission_id: 'ARTEMIS-VII',
        mission_duration_days: 180,
        current_mission_day: 142,
        baseline_heart_rate: 66.0,
        baseline_spo2: 97.9,
        baseline_body_temp: 36.5,
        baseline_systolic_bp: 122.0,
        baseline_diastolic_bp: 80.0,
        baseline_sleep_hours: 7.0,
        baseline_activity_mets: 3.5,
        max_radiation_limit_msv: 200.0,
        current_cumulative_radiation_msv: 49.1,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
    },
    'ASTRO-04': {
        astronaut_id: 'ASTRO-04',
        name: 'Elena Rostova',
        role: 'Payload Specialist / Astrogeologist',
        mission_id: 'ARTEMIS-VII',
        mission_duration_days: 180,
        current_mission_day: 142,
        baseline_heart_rate: 60.0,
        baseline_spo2: 98.4,
        baseline_body_temp: 36.6,
        baseline_systolic_bp: 115.0,
        baseline_diastolic_bp: 74.0,
        baseline_sleep_hours: 7.8,
        baseline_activity_mets: 3.9,
        max_radiation_limit_msv: 200.0,
        current_cumulative_radiation_msv: 40.2,
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
    },
};

const latestSimReadings: Record<string, any> = {};

const alertsDb: any[] = [
    // ASTRO-01: CDR Alex Vance
    {
        alert_id: 'ALT-1001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        reading_id: 1,
        astronaut_id: 'ASTRO-01',
        metric_name: 'heart_rate',
        metric_value: 108.5,
        threshold_min: 50,
        threshold_max: 100,
        severity: 'warning',
        message: 'Tachycardia spike during high-exertion pre-EVA preparation',
        acknowledged: false,
        review_status: 'New',
        triage_notes: 'Monitor fluid hydration and autonomic stabilization',
    },
    {
        alert_id: 'ALT-1002',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        reading_id: 2,
        astronaut_id: 'ASTRO-01',
        metric_name: 'cabin_co2',
        metric_value: 4.8,
        threshold_min: 0,
        threshold_max: 4.0,
        severity: 'warning',
        message: 'Elevated cabin ambient CO2 concentration detected near sleep quarters',
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 5400000).toISOString(),
        acknowledged_by: 'Medical Officer',
        review_status: 'Acknowledged',
        triage_notes: 'ECLSS lithium hydroxide scrubbed air loop 2 activated',
    },
    {
        alert_id: 'ALT-1003',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        reading_id: 3,
        astronaut_id: 'ASTRO-01',
        metric_name: 'radiation_exposure',
        metric_value: 1.85,
        threshold_min: 0,
        threshold_max: 1.0,
        severity: 'critical',
        message: 'Solar Particle Event flux surge exceeded daily baseline threshold',
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 80000000).toISOString(),
        acknowledged_by: 'Flight Surgeon',
        review_status: 'Resolved',
        triage_notes: 'Crew sheltered in pressurized water-shielded aft storm compartment',
    },
    // ASTRO-02: Dr. Sarah Chen
    {
        alert_id: 'ALT-2001',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        reading_id: 4,
        astronaut_id: 'ASTRO-02',
        metric_name: 'systolic_bp',
        metric_value: 138.0,
        threshold_min: 90,
        threshold_max: 135,
        severity: 'warning',
        message: 'Transient post-EVA orthostatic elevation following 6-hour spacewalk suit egress',
        acknowledged: false,
        review_status: 'New',
        triage_notes: 'Prescribe fluid-loading salt tablets and 30-min horizontal rest',
    },
    {
        alert_id: 'ALT-2002',
        timestamp: new Date(Date.now() - 28800000).toISOString(),
        reading_id: 5,
        astronaut_id: 'ASTRO-02',
        metric_name: 'spo2',
        metric_value: 94.2,
        threshold_min: 95,
        threshold_max: 100,
        severity: 'warning',
        message: 'Transient nocturnal microgravity hypoxemia event trapped during sleep cycle',
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 25000000).toISOString(),
        acknowledged_by: 'Medical Officer',
        review_status: 'Acknowledged',
        triage_notes: 'Adjusted sleep quarter airflow diffuser; O2 level normalized to 98.8%',
    },
    // ASTRO-03: Marcus Thorne
    {
        alert_id: 'ALT-3001',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        reading_id: 6,
        astronaut_id: 'ASTRO-03',
        metric_name: 'heart_rate',
        metric_value: 116.0,
        threshold_min: 50,
        threshold_max: 100,
        severity: 'critical',
        message: 'Sustained cardiovascular rate excursion during high-torque robotic arm maintenance',
        acknowledged: false,
        review_status: 'New',
        triage_notes: 'Immediate workload reduction instructed; vagal breathing initiated',
    },
    {
        alert_id: 'ALT-3002',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        reading_id: 7,
        astronaut_id: 'ASTRO-03',
        metric_name: 'radiation_exposure',
        metric_value: 0.95,
        threshold_min: 0,
        threshold_max: 0.8,
        severity: 'warning',
        message: 'Elevated dosimetric rate during habitat airlock hatch inspection',
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 40000000).toISOString(),
        acknowledged_by: 'Flight Surgeon',
        review_status: 'Resolved',
        triage_notes: 'Inspection complete; returned to shielded central node',
    },
    // ASTRO-04: Elena Rostova
    {
        alert_id: 'ALT-4001',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        reading_id: 8,
        astronaut_id: 'ASTRO-04',
        metric_name: 'sleep_hours',
        metric_value: 5.2,
        threshold_min: 6.5,
        threshold_max: 9.0,
        severity: 'warning',
        message: 'Circadian rhythm phase delay; total restorative rest below 6.0h threshold',
        acknowledged: false,
        review_status: 'New',
        triage_notes: 'Circadian blue-light spectrum scheduling shifted forward 45 minutes',
    },
    {
        alert_id: 'ALT-4002',
        timestamp: new Date(Date.now() - 50400000).toISOString(),
        reading_id: 9,
        astronaut_id: 'ASTRO-04',
        metric_name: 'body_temp',
        metric_value: 37.8,
        threshold_min: 36.1,
        threshold_max: 37.5,
        severity: 'warning',
        message: 'Microgravity exercise-induced thermal storage elevation; core temp slow recovery',
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 48000000).toISOString(),
        acknowledged_by: 'Medical Officer',
        review_status: 'Acknowledged',
        triage_notes: 'Cooling vest protocol administered; temperature normalized to 36.7°C',
    },
];

const anomaliesDb: Record<string, any[]> = {
    'ASTRO-01': [
        {
            id: 101,
            reading_id: 104,
            run_id: 'RUN-7011',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            anomaly_score: -0.68,
            confidence_score: 0.94,
            metric: 'heart_rate',
            value: 108.5,
            unit: 'bpm',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['heart_rate', 'resp_rate'],
            feature_contributions: { heart_rate: 0.62, resp_rate: 0.38 },
            notes: 'Elevated heart rate spike (108.5 BPM) during non-exercise interval without metabolic demand correlation.',
            reason: 'Elevated heart rate spike (108.5 BPM) during non-exercise interval without metabolic demand correlation.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            astronaut_id: 'ASTRO-01',
        },
        {
            id: 102,
            reading_id: 98,
            run_id: 'RUN-7011',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            anomaly_score: -0.82,
            confidence_score: 0.96,
            metric: 'radiation_exposure',
            value: 1.85,
            unit: 'mSv/day',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'critical',
            related_indicators: ['radiation_exposure', 'cabin_co2'],
            feature_contributions: { radiation_exposure: 0.74, cabin_co2: 0.26 },
            notes: 'Solar Particle Event flux surge (1.85 mSv/day) correlated with stagnant cabin air pocket.',
            reason: 'Solar Particle Event flux surge (1.85 mSv/day) correlated with stagnant cabin air pocket.',
            created_at: new Date(Date.now() - 14400000).toISOString(),
            astronaut_id: 'ASTRO-01',
        },
    ],
    'ASTRO-02': [
        {
            id: 201,
            reading_id: 204,
            run_id: 'RUN-7022',
            timestamp: new Date(Date.now() - 5400000).toISOString(),
            anomaly_score: -0.71,
            confidence_score: 0.92,
            metric: 'systolic_bp',
            value: 138.0,
            unit: 'mmHg',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['systolic_bp', 'diastolic_bp'],
            feature_contributions: { systolic_bp: 0.68, diastolic_bp: 0.32 },
            notes: 'Post-EVA orthostatic blood pressure rebound following 6-hour extravehicular excursion.',
            reason: 'Post-EVA orthostatic blood pressure rebound following 6-hour extravehicular excursion.',
            created_at: new Date(Date.now() - 5400000).toISOString(),
            astronaut_id: 'ASTRO-02',
        },
        {
            id: 202,
            reading_id: 198,
            run_id: 'RUN-7022',
            timestamp: new Date(Date.now() - 28800000).toISOString(),
            anomaly_score: -0.65,
            confidence_score: 0.89,
            metric: 'spo2',
            value: 94.2,
            unit: '%',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['spo2', 'resp_rate'],
            feature_contributions: { spo2: 0.75, resp_rate: 0.25 },
            notes: 'Nocturnal microgravity desaturation event trapped during Stage 3 NREM sleep.',
            reason: 'Nocturnal microgravity desaturation event trapped during Stage 3 NREM sleep.',
            created_at: new Date(Date.now() - 28800000).toISOString(),
            astronaut_id: 'ASTRO-02',
        },
    ],
    'ASTRO-03': [
        {
            id: 301,
            reading_id: 304,
            run_id: 'RUN-7033',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            anomaly_score: -0.89,
            confidence_score: 0.97,
            metric: 'heart_rate',
            value: 116.0,
            unit: 'bpm',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'critical',
            related_indicators: ['heart_rate', 'activity_level'],
            feature_contributions: { heart_rate: 0.82, activity_level: 0.18 },
            notes: 'Severe cardiovascular rate excursion during high-torque robotic Canadarm maintenance.',
            reason: 'Severe cardiovascular rate excursion during high-torque robotic Canadarm maintenance.',
            created_at: new Date(Date.now() - 1800000).toISOString(),
            astronaut_id: 'ASTRO-03',
        },
        {
            id: 302,
            reading_id: 298,
            run_id: 'RUN-7033',
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            anomaly_score: -0.62,
            confidence_score: 0.88,
            metric: 'radiation_exposure',
            value: 0.95,
            unit: 'mSv/day',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['radiation_exposure'],
            feature_contributions: { radiation_exposure: 1.0 },
            notes: 'Elevated dosimetric rate during habitat airlock unshielded hatch inspection.',
            reason: 'Elevated dosimetric rate during habitat airlock unshielded hatch inspection.',
            created_at: new Date(Date.now() - 43200000).toISOString(),
            astronaut_id: 'ASTRO-03',
        },
    ],
    'ASTRO-04': [
        {
            id: 401,
            reading_id: 404,
            run_id: 'RUN-7044',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            anomaly_score: -0.64,
            confidence_score: 0.91,
            metric: 'sleep_hours',
            value: 5.2,
            unit: 'hrs',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['sleep_hours', 'heart_rate'],
            feature_contributions: { sleep_hours: 0.72, heart_rate: 0.28 },
            notes: 'Circadian phase shift; cumulative restorative sleep deficit below 6.0h threshold.',
            reason: 'Circadian phase shift; cumulative restorative sleep deficit below 6.0h threshold.',
            created_at: new Date(Date.now() - 14400000).toISOString(),
            astronaut_id: 'ASTRO-04',
        },
        {
            id: 402,
            reading_id: 398,
            run_id: 'RUN-7044',
            timestamp: new Date(Date.now() - 50400000).toISOString(),
            anomaly_score: -0.58,
            confidence_score: 0.85,
            metric: 'body_temp',
            value: 37.8,
            unit: '°C',
            is_anomaly: true,
            detection_method: 'Multivariate Isolation Forest (100 Trees)',
            method: 'IsolationForest',
            severity: 'warning',
            related_indicators: ['body_temp', 'activity_level'],
            feature_contributions: { body_temp: 0.80, activity_level: 0.20 },
            notes: 'Post-exercise microgravity heat storage elevation with blunted sweat evaporative cooling.',
            reason: 'Post-exercise microgravity heat storage elevation with blunted sweat evaporative cooling.',
            created_at: new Date(Date.now() - 50400000).toISOString(),
            astronaut_id: 'ASTRO-04',
        },
    ],
};

const reportsDb: any[] = [];

function parseBody(req: any): Promise<any> {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
    });
}

function sendJson(res: any, data: any, status = 200) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

export function astroCareApiPlugin(): Plugin {
    return {
        name: 'vite-plugin-astrocare-api',
        configureServer(server: ViteDevServer) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url || !req.url.startsWith('/api')) {
                    return next();
                }

                const parsedUrl = new URL(req.url, 'http://localhost:5173');
                const pathname = parsedUrl.pathname;
                const searchParams = parsedUrl.searchParams;

                // 1. GET /api/health
                if (req.method === 'GET' && pathname === '/api/health') {
                    return sendJson(res, {
                        status: 'online',
                        system: 'AstroCare Flight Telemetry Engine',
                        version: '2.0.0',
                        database: 'Embedded In-Memory Telemetry Datastore',
                        timestamp: new Date().toISOString(),
                        astronauts_registered: Object.keys(astronautsDb).length,
                        total_readings: 12540,
                    });
                }

                // 2. GET /api/astronauts
                if (req.method === 'GET' && pathname === '/api/astronauts') {
                    const list = Object.values(astronautsDb);
                    return sendJson(res, {
                        total: list.length,
                        astronauts: list,
                    });
                }

                // 3. GET /api/astronauts/:id
                const astroMatch = pathname.match(/^\/api\/astronauts\/([A-Za-z0-9_-]+)$/);
                if (req.method === 'GET' && astroMatch) {
                    const id = astroMatch[1];
                    const astro = astronautsDb[id];
                    if (!astro) {
                        return sendJson(res, { detail: `Astronaut '${id}' not found` }, 404);
                    }
                    return sendJson(res, astro);
                }

                // 4. PUT /api/astronauts/:id
                if (req.method === 'PUT' && astroMatch) {
                    const id = astroMatch[1];
                    const body = await parseBody(req);
                    const existing = astronautsDb[id];
                    if (!existing) {
                        return sendJson(res, { detail: `Astronaut '${id}' not found` }, 404);
                    }
                    Object.assign(existing, body);
                    return sendJson(res, existing);
                }

                // 5. GET /api/metrics
                if (req.method === 'GET' && pathname === '/api/metrics') {
                    const astronautId = searchParams.get('astronaut_id') || 'ASTRO-01';
                    const astro = astronautsDb[astronautId] || astronautsDb['ASTRO-01'];
                    const sim = latestSimReadings[astronautId];

                    const hr = sim?.heart_rate ?? +(astro.baseline_heart_rate + 2.4).toFixed(1);
                    const spo2 = sim?.spo2 ?? +(astro.baseline_spo2 - 0.2).toFixed(1);
                    const temp = sim?.body_temp ?? +(astro.baseline_body_temp + 0.1).toFixed(1);
                    const resp = sim?.resp_rate ?? +(13.8 + (astro.baseline_heart_rate - 60) * 0.05).toFixed(1);
                    const sys = sim?.systolic_bp ?? +(astro.baseline_systolic_bp).toFixed(1);
                    const dia = sim?.diastolic_bp ?? +(astro.baseline_diastolic_bp).toFixed(1);
                    const rad = sim?.radiation_exposure ?? +(astro.current_cumulative_radiation_msv / 100).toFixed(2);

                    const metrics = [
                        {
                            metric: 'heart_rate',
                            metric_name: 'heart_rate',
                            label: 'Heart Rate',
                            display_name: 'Heart Rate',
                            latest_value: hr,
                            current_value: hr,
                            baseline_value: astro.baseline_heart_rate,
                            unit: 'bpm',
                            status: sim ? 'simulated' : 'measured',
                            min_val: +(astro.baseline_heart_rate - 8).toFixed(1),
                            max_val: +(astro.baseline_heart_rate + 24).toFixed(1),
                            min_24h: +(astro.baseline_heart_rate - 6).toFixed(1),
                            max_24h: +(astro.baseline_heart_rate + 20).toFixed(1),
                            mean: +(astro.baseline_heart_rate + 1.2).toFixed(1),
                            avg_24h: +(astro.baseline_heart_rate + 1.2).toFixed(1),
                            std: 3.8,
                            count: 288,
                            missing: 0,
                            sparkline: [
                                +(astro.baseline_heart_rate - 2).toFixed(1),
                                +(astro.baseline_heart_rate - 1).toFixed(1),
                                +(astro.baseline_heart_rate).toFixed(1),
                                +(astro.baseline_heart_rate + 1.5).toFixed(1),
                                +(astro.baseline_heart_rate + 3.0).toFixed(1),
                                +(astro.baseline_heart_rate + 2.0).toFixed(1),
                                hr
                            ],
                            change_from_prev: +(hr - (astro.baseline_heart_rate + 2.0)).toFixed(1),
                            normal_range: { min: 50, max: 100 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'cardiovascular',
                        },
                        {
                            metric: 'spo2',
                            metric_name: 'spo2',
                            label: 'Blood Oxygen (SpO₂)',
                            display_name: 'Blood Oxygen Saturation',
                            latest_value: spo2,
                            current_value: spo2,
                            baseline_value: astro.baseline_spo2,
                            unit: '%',
                            status: sim ? 'simulated' : 'measured',
                            min_val: 95.0,
                            max_val: 99.8,
                            min_24h: 96.0,
                            max_24h: 99.6,
                            mean: +(astro.baseline_spo2 - 0.1).toFixed(1),
                            avg_24h: +(astro.baseline_spo2 - 0.1).toFixed(1),
                            std: 0.5,
                            count: 288,
                            missing: 0,
                            sparkline: [
                                astro.baseline_spo2,
                                +(astro.baseline_spo2 + 0.2).toFixed(1),
                                +(astro.baseline_spo2 - 0.1).toFixed(1),
                                +(astro.baseline_spo2).toFixed(1),
                                spo2
                            ],
                            change_from_prev: +(spo2 - astro.baseline_spo2).toFixed(1),
                            normal_range: { min: 94, max: 100 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'respiratory',
                        },
                        {
                            metric: 'body_temp',
                            metric_name: 'body_temp',
                            label: 'Core Temperature',
                            display_name: 'Core Body Temperature',
                            latest_value: temp,
                            current_value: temp,
                            baseline_value: astro.baseline_body_temp,
                            unit: '°C',
                            status: sim ? 'simulated' : 'measured',
                            min_val: +(astro.baseline_body_temp - 0.4).toFixed(1),
                            max_val: +(astro.baseline_body_temp + 0.6).toFixed(1),
                            min_24h: +(astro.baseline_body_temp - 0.3).toFixed(1),
                            max_24h: +(astro.baseline_body_temp + 0.5).toFixed(1),
                            mean: astro.baseline_body_temp,
                            avg_24h: astro.baseline_body_temp,
                            std: 0.2,
                            count: 288,
                            missing: 0,
                            sparkline: [
                                +(astro.baseline_body_temp - 0.1).toFixed(1),
                                astro.baseline_body_temp,
                                +(astro.baseline_body_temp + 0.1).toFixed(1),
                                temp
                            ],
                            change_from_prev: 0.0,
                            normal_range: { min: 36.1, max: 37.5 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'thermoregulation',
                        },
                        {
                            metric: 'resp_rate',
                            metric_name: 'resp_rate',
                            label: 'Respiration Rate',
                            display_name: 'Respiration Rate',
                            latest_value: resp,
                            current_value: resp,
                            baseline_value: 14.0,
                            unit: 'br/min',
                            status: sim ? 'simulated' : 'measured',
                            min_val: 12.0,
                            max_val: 18.0,
                            min_24h: 12.0,
                            max_24h: 17.5,
                            mean: 14.0,
                            avg_24h: 14.0,
                            std: 1.0,
                            count: 288,
                            missing: 0,
                            sparkline: [13.6, 14.0, 14.2, 13.9, resp],
                            change_from_prev: 0.1,
                            normal_range: { min: 12, max: 20 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'respiratory',
                        },
                        {
                            metric: 'systolic_bp',
                            metric_name: 'blood_pressure',
                            label: 'Systolic Blood Pressure',
                            display_name: 'Systolic Blood Pressure',
                            latest_value: sys,
                            current_value: sys,
                            baseline_value: astro.baseline_systolic_bp,
                            unit: 'mmHg',
                            status: sim ? 'simulated' : 'measured',
                            min_val: +(astro.baseline_systolic_bp - 10).toFixed(1),
                            max_val: +(astro.baseline_systolic_bp + 15).toFixed(1),
                            min_24h: +(astro.baseline_systolic_bp - 8).toFixed(1),
                            max_24h: +(astro.baseline_systolic_bp + 12).toFixed(1),
                            mean: astro.baseline_systolic_bp,
                            avg_24h: astro.baseline_systolic_bp,
                            std: 3.0,
                            count: 288,
                            missing: 0,
                            sparkline: [
                                astro.baseline_systolic_bp - 2,
                                astro.baseline_systolic_bp - 1,
                                astro.baseline_systolic_bp + 1,
                                sys
                            ],
                            change_from_prev: 0.0,
                            normal_range: { min: 90, max: 140 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'hemodynamic',
                        },
                        {
                            metric: 'diastolic_bp',
                            metric_name: 'diastolic_bp',
                            label: 'Diastolic Blood Pressure',
                            display_name: 'Diastolic Blood Pressure',
                            latest_value: dia,
                            current_value: dia,
                            baseline_value: astro.baseline_diastolic_bp,
                            unit: 'mmHg',
                            status: sim ? 'simulated' : 'measured',
                            min_val: +(astro.baseline_diastolic_bp - 8).toFixed(1),
                            max_val: +(astro.baseline_diastolic_bp + 10).toFixed(1),
                            min_24h: +(astro.baseline_diastolic_bp - 6).toFixed(1),
                            max_24h: +(astro.baseline_diastolic_bp + 8).toFixed(1),
                            mean: astro.baseline_diastolic_bp,
                            avg_24h: astro.baseline_diastolic_bp,
                            std: 2.0,
                            count: 288,
                            missing: 0,
                            sparkline: [
                                astro.baseline_diastolic_bp - 1,
                                astro.baseline_diastolic_bp,
                                astro.baseline_diastolic_bp + 1,
                                dia
                            ],
                            change_from_prev: 0.0,
                            normal_range: { min: 60, max: 90 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'hemodynamic',
                        },
                        {
                            metric: 'radiation_exposure',
                            metric_name: 'radiation_exposure',
                            label: 'Daily Radiation Dose',
                            display_name: 'Daily Radiation Dose',
                            latest_value: rad,
                            current_value: rad,
                            baseline_value: +(astro.current_cumulative_radiation_msv / 120).toFixed(2),
                            unit: 'mSv/day',
                            status: sim ? 'simulated' : 'measured',
                            min_val: 0.25,
                            max_val: 1.20,
                            min_24h: 0.28,
                            max_24h: 0.85,
                            mean: rad,
                            avg_24h: rad,
                            std: 0.04,
                            count: 288,
                            missing: 0,
                            sparkline: [0.35, 0.36, 0.38, 0.40, rad],
                            change_from_prev: 0.01,
                            normal_range: { min: 0.1, max: 1.0 },
                            latest_timestamp: sim?.timestamp || new Date().toISOString(),
                            trend: 'stable',
                            category: 'radiation',
                        },
                    ];
                    return sendJson(res, metrics);
                }

                // 6. GET /api/health-trends
                if (req.method === 'GET' && pathname === '/api/health-trends') {
                    const range = searchParams.get('range') || '24h';
                    const astronautId = searchParams.get('astronaut_id') || 'ASTRO-01';
                    const astro = astronautsDb[astronautId] || astronautsDb['ASTRO-01'];
                    const count = range === '24h' ? 24 : range === '7d' ? 28 : range === '30d' ? 30 : 50;
                    const points = [];
                    const now = Date.now();
                    const stepMs = range === '24h' ? 3600000 : range === '7d' ? 6 * 3600000 : 24 * 3600000;

                    for (let i = count; i >= 0; i--) {
                        const ts = new Date(now - i * stepMs).toISOString();
                        points.push({
                            timestamp: ts,
                            heart_rate: +(astro.baseline_heart_rate + Math.sin(i * 0.4) * 6 + (Math.random() * 2 - 1)).toFixed(1),
                            spo2: +(astro.baseline_spo2 + Math.cos(i * 0.3) * 0.4).toFixed(1),
                            body_temp: +(astro.baseline_body_temp + Math.sin(i * 0.2) * 0.2).toFixed(1),
                            systolic_bp: +(astro.baseline_systolic_bp + Math.sin(i * 0.35) * 5).toFixed(1),
                            diastolic_bp: +(astro.baseline_diastolic_bp + Math.sin(i * 0.35) * 3).toFixed(1),
                            resp_rate: +(14 + Math.cos(i * 0.2) * 1.5).toFixed(1),
                            sleep_hours: +(7.4 + Math.sin(i * 0.5) * 0.8).toFixed(1),
                            radiation_exposure: +(0.35 + (astro.current_cumulative_radiation_msv / 300) + Math.random() * 0.08).toFixed(2),
                            cabin_co2: +(3.2 + Math.sin(i * 0.1) * 0.4).toFixed(2),
                        });
                    }

                    return sendJson(res, {
                        range,
                        astronaut_id: astronautId,
                        data_points: points,
                        points: points,
                    });
                }

                // 7. GET /api/health-readings
                if (req.method === 'GET' && (pathname === '/api/health-readings' || pathname === '/api/readings')) {
                    const limit = parseInt(searchParams.get('limit') || '50', 10);
                    const astronautId = searchParams.get('astronaut_id') || 'ASTRO-01';
                    const astro = astronautsDb[astronautId] || astronautsDb['ASTRO-01'];
                    const sampleReadings = [];
                    for (let i = 0; i < Math.min(limit, 50); i++) {
                        sampleReadings.push({
                            id: 100 + i,
                            timestamp: new Date(Date.now() - i * 1800000).toISOString(),
                            heart_rate: +(astro.baseline_heart_rate + Math.sin(i) * 5).toFixed(1),
                            spo2: +(astro.baseline_spo2 + Math.cos(i) * 0.4).toFixed(1),
                            body_temp: +(astro.baseline_body_temp + (i % 3) * 0.08).toFixed(1),
                            resp_rate: +(14.2 + (i % 2) * 0.5).toFixed(1),
                            systolic_bp: +(astro.baseline_systolic_bp + (i % 5)).toFixed(1),
                            diastolic_bp: +(astro.baseline_diastolic_bp + (i % 4)).toFixed(1),
                            sleep_hours: 7.5,
                            activity_level: 3.8,
                            radiation_exposure: +(0.35 + (i % 4) * 0.04).toFixed(2),
                            cumulative_radiation: +(astro.current_cumulative_radiation_msv - i * 0.02).toFixed(2),
                            source: 'simulated',
                            astronaut_id: astronautId,
                        });
                    }
                    return sendJson(res, { total: sampleReadings.length, readings: sampleReadings });
                }

                // 7b. GET /api/readings/timeseries
                if (req.method === 'GET' && pathname === '/api/readings/timeseries') {
                    const metric = searchParams.get('metric') || 'heart_rate';
                    const limit = parseInt(searchParams.get('limit') || '200', 10);
                    const astronautId = searchParams.get('astronaut_id') || 'ASTRO-01';
                    const astro = astronautsDb[astronautId] || astronautsDb['ASTRO-01'];
                    const points = [];
                    const now = Date.now();
                    const count = Math.min(limit, 100);
                    for (let i = count; i >= 0; i--) {
                        const ts = new Date(now - i * 1800000).toISOString();
                        let val = +(astro.baseline_heart_rate).toFixed(1);
                        if (metric === 'heart_rate') val = +(astro.baseline_heart_rate + Math.sin(i * 0.4) * 6 + (Math.random() * 2 - 1)).toFixed(1);
                        else if (metric === 'spo2') val = +(astro.baseline_spo2 + Math.cos(i * 0.3) * 0.5).toFixed(1);
                        else if (metric === 'body_temp') val = +(astro.baseline_body_temp + Math.sin(i * 0.2) * 0.2).toFixed(2);
                        else if (metric === 'resp_rate') val = +(14.0 + Math.sin(i * 0.3) * 1.5).toFixed(1);
                        else if (metric === 'systolic_bp') val = +(astro.baseline_systolic_bp + Math.sin(i * 0.4) * 5).toFixed(1);
                        else if (metric === 'diastolic_bp') val = +(astro.baseline_diastolic_bp + Math.sin(i * 0.4) * 3).toFixed(1);
                        else if (metric === 'radiation_exposure') val = +(0.35 + (i % 5) * 0.02).toFixed(3);
                        else if (metric === 'sleep_hours') val = 7.4;
                        else if (metric === 'activity_level') val = 3.6;

                        points.push({
                            id: 1000 + i,
                            timestamp: ts,
                            value: val,
                            source: 'measured',
                            astronaut_id: astronautId,
                        });
                    }
                    return sendJson(res, { metric, total_points: points.length, points, data: points });
                }

                // 8. POST /api/health-readings
                if (req.method === 'POST' && (pathname === '/api/health-readings' || pathname === '/api/readings')) {
                    const body = await parseBody(req);
                    const created = {
                        id: Math.floor(1000 + Math.random() * 9000),
                        timestamp: body.timestamp || new Date().toISOString(),
                        ...body,
                        source: body.source || 'measured',
                    };
                    return sendJson(res, created, 201);
                }

                // 9. POST /api/analyze or /api/anomalies/analyze
                if (req.method === 'POST' && (pathname === '/api/analyze' || pathname === '/api/anomalies/analyze')) {
                    const body = await parseBody(req);
                    const contamination = body.contamination || 0.05;
                    const astronautId = body.astronaut_id || searchParams.get('astronaut_id') || 'ASTRO-01';
                    const anoms = anomaliesDb[astronautId] || anomaliesDb['ASTRO-01'];
                    const runId = 'RUN-' + Math.floor(1000 + Math.random() * 9000);
                    return sendJson(res, {
                        run_id: runId,
                        method: 'Multivariate Isolation Forest (100 Trees)',
                        records_analyzed: 500,
                        total_analyzed: 500,
                        anomalies_found: anoms.length,
                        anomalies_detected: anoms.length,
                        anomaly_rate: contamination,
                        contamination_rate: contamination,
                        model_status: 'success',
                        message: `Isolation Forest evaluated 500 telemetry records for ${astronautId}. ${anoms.length} anomalies detected.`,
                        anomalies: anoms,
                    });
                }

                // 9b. GET /api/anomalies
                if (req.method === 'GET' && pathname === '/api/anomalies') {
                    const astronautId = searchParams.get('astronaut_id') || 'ASTRO-01';
                    const anoms = anomaliesDb[astronautId] || anomaliesDb['ASTRO-01'];
                    const limit = parseInt(searchParams.get('limit') || '100', 10);
                    return sendJson(res, anoms.slice(0, limit));
                }

                // 10. GET /api/alerts
                if (req.method === 'GET' && pathname === '/api/alerts') {
                    let filtered = [...alertsDb];
                    const astroId = searchParams.get('astronaut_id');
                    if (astroId) {
                        filtered = filtered.filter(a => a.astronaut_id === astroId);
                    }
                    const ack = searchParams.get('acknowledged');
                    if (ack !== null && ack !== undefined) {
                        const isAck = ack === 'true' || ack === '1';
                        filtered = filtered.filter(a => Boolean(a.acknowledged) === isAck);
                    }
                    const sev = searchParams.get('severity');
                    if (sev) {
                        filtered = filtered.filter(a => a.severity === sev);
                    }
                    const status = searchParams.get('review_status');
                    if (status) {
                        filtered = filtered.filter(a => a.review_status?.toLowerCase() === status.toLowerCase());
                    }
                    const type = searchParams.get('alert_type');
                    if (type) {
                        filtered = filtered.filter(a => a.alert_type === type);
                    }
                    const q = searchParams.get('search');
                    if (q) {
                        const query = q.toLowerCase();
                        filtered = filtered.filter(a =>
                            (a.message && a.message.toLowerCase().includes(query)) ||
                            (a.explanation && a.explanation.toLowerCase().includes(query)) ||
                            (a.metric_name && a.metric_name.toLowerCase().includes(query)) ||
                            (a.metric && a.metric.toLowerCase().includes(query)) ||
                            (a.alert_id && a.alert_id.toLowerCase().includes(query))
                        );
                    }
                    const limit = searchParams.get('limit');
                    const result = limit ? filtered.slice(0, parseInt(limit, 10)) : filtered;
                    return sendJson(res, {
                        total: filtered.length,
                        alerts: result,
                    });
                }

                // 11. PATCH /api/alerts/:id
                const alertMatch = pathname.match(/^\/api\/alerts\/([A-Za-z0-9_-]+)$/);
                if (req.method === 'PATCH' && alertMatch) {
                    const id = alertMatch[1];
                    const body = await parseBody(req);
                    const alert = alertsDb.find(a => a.alert_id === id);
                    if (alert) {
                        if (body.review_status !== undefined) alert.review_status = body.review_status;
                        if (body.triage_notes !== undefined) alert.triage_notes = body.triage_notes;
                        if (body.acknowledged !== undefined) {
                            alert.acknowledged = Boolean(body.acknowledged);
                            alert.acknowledged_at = new Date().toISOString();
                            alert.acknowledged_by = body.acknowledged_by || 'Flight Surgeon';
                        }
                        return sendJson(res, alert);
                    }
                    return sendJson(res, { detail: 'Alert not found' }, 404);
                }

                // 12. PATCH /api/alerts/:id/acknowledge
                const ackMatch = pathname.match(/^\/api\/alerts\/([A-Za-z0-9_-]+)\/acknowledge$/);
                if (req.method === 'PATCH' && ackMatch) {
                    const id = ackMatch[1];
                    const alert = alertsDb.find(a => a.alert_id === id);
                    if (alert) {
                        alert.acknowledged = true;
                        alert.acknowledged_at = new Date().toISOString();
                        alert.acknowledged_by = 'Medical Officer';
                        alert.review_status = 'Acknowledged';
                        return sendJson(res, alert);
                    }
                    return sendJson(res, { detail: 'Alert not found' }, 404);
                }

                // 13. GET /api/simulator/status
                if (req.method === 'GET' && pathname === '/api/simulator/status') {
                    return sendJson(res, {
                        status: 'operational',
                        mode: 'realistic_multivariate',
                        current_scenario: 'normal',
                        active_astronaut: 'ASTRO-01',
                        frequency_hz: 1.0,
                        last_timestamp: new Date().toISOString(),
                        total_records: 420,
                        available_scenarios: ['normal', 'tachycardia', 'hypoxia', 'hypothermia', 'extreme_radiation', 'hypertension', 'sleep_deprivation', 'high_stress'],
                    });
                }

                // 14. POST /api/simulator/step
                if (req.method === 'POST' && pathname === '/api/simulator/step') {
                    const body = await parseBody(req);
                    const scenario = body.scenario || 'normal';
                    const astronautId = body.astronaut_id || 'ASTRO-01';
                    const astro = astronautsDb[astronautId] || astronautsDb['ASTRO-01'];

                    let hr = +(astro.baseline_heart_rate + 2.4).toFixed(1);
                    let spo2 = +(astro.baseline_spo2 - 0.2).toFixed(1);
                    let temp = +(astro.baseline_body_temp + 0.1).toFixed(1);
                    let rad = +(astro.current_cumulative_radiation_msv / 100).toFixed(2);
                    let sys = +(astro.baseline_systolic_bp).toFixed(1);
                    let dia = +(astro.baseline_diastolic_bp).toFixed(1);
                    let resp = 14.5;

                    let alertSeverity: 'critical' | 'warning' | null = null;
                    let alertMetric = '';
                    let alertMsg = '';

                    if (scenario === 'tachycardia') {
                        hr = 138.0;
                        resp = 22.0;
                        alertSeverity = 'critical';
                        alertMetric = 'heart_rate';
                        alertMsg = `Acute sinus tachycardia excursion (138 bpm) exceeding baseline for ${astro.name}`;
                    } else if (scenario === 'hypoxia') {
                        spo2 = 88.5;
                        hr = +(astro.baseline_heart_rate + 28).toFixed(1);
                        resp = 24.0;
                        alertSeverity = 'critical';
                        alertMetric = 'spo2';
                        alertMsg = `Acute arterial oxygen desaturation (88.5% SpO2) detected for ${astro.name}`;
                    } else if (scenario === 'hypothermia') {
                        temp = 34.8;
                        hr = 52.0;
                        alertSeverity = 'warning';
                        alertMetric = 'body_temp';
                        alertMsg = `Core hypothermia depression (34.8°C) detected for ${astro.name}`;
                    } else if (scenario === 'extreme_radiation') {
                        rad = 4.80;
                        alertSeverity = 'critical';
                        alertMetric = 'radiation_exposure';
                        alertMsg = `Extreme solar proton flux surge (4.80 mSv/day) detected at crew station for ${astro.name}`;
                    } else if (scenario === 'hypertension') {
                        sys = 158.0;
                        dia = 102.0;
                        alertSeverity = 'warning';
                        alertMetric = 'systolic_bp';
                        alertMsg = `Acute hemodynamic hypertensive spike (158/102 mmHg) for ${astro.name}`;
                    }

                    const reading = {
                        id: Math.floor(2000 + Math.random() * 8000),
                        timestamp: new Date().toISOString(),
                        heart_rate: hr,
                        spo2,
                        body_temp: temp,
                        resp_rate: resp,
                        systolic_bp: sys,
                        diastolic_bp: dia,
                        sleep_hours: 7.5,
                        activity_level: 3.8,
                        radiation_exposure: rad,
                        cumulative_radiation: +(astro.current_cumulative_radiation_msv + 0.05).toFixed(2),
                        source: 'simulated',
                        astronaut_id: astronautId,
                    };

                    latestSimReadings[astronautId] = reading;

                    if (alertSeverity && alertMetric) {
                        alertsDb.unshift({
                            id: alertsDb.length + 1,
                            alert_id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
                            timestamp: new Date().toISOString(),
                            reading_id: reading.id,
                            astronaut_id: astronautId,
                            metric: alertMetric,
                            metric_name: alertMetric,
                            metric_value: alertMetric === 'heart_rate' ? hr : alertMetric === 'spo2' ? spo2 : alertMetric === 'body_temp' ? temp : rad,
                            threshold_min: alertMetric === 'spo2' ? 94 : 50,
                            threshold_max: alertMetric === 'heart_rate' ? 100 : 1.0,
                            severity: alertSeverity,
                            message: alertMsg,
                            explanation: alertMsg,
                            suggested_action: 'Initiate operational countermeasures and notify flight surgeon.',
                            alert_type: 'health_concern',
                            acknowledged: false,
                            review_status: 'pending',
                            triage_notes: `Active simulation trigger: ${scenario}`,
                        });
                    }

                    return sendJson(res, {
                        status: 'stepped',
                        scenario,
                        reading,
                    });
                }

                // 15. POST /api/reports/generate
                if (req.method === 'POST' && pathname === '/api/reports/generate') {
                    const body = await parseBody(req);
                    const report = {
                        id: reportsDb.length + 1,
                        report_id: 'REP-' + (body.astronaut_id || 'ASTRO-01') + '-' + Math.floor(100 + Math.random() * 900),
                        title: body.title || `Mission Health Evaluation — ${body.astronaut_id || 'ASTRO-01'}`,
                        astronaut_id: body.astronaut_id || 'ASTRO-01',
                        start_date: body.start_date || '2026-10-01',
                        end_date: body.end_date || '2026-11-13',
                        total_records: body.total_records || 320,
                        anomaly_count: body.anomaly_count || 3,
                        alert_count: body.alert_count || 2,
                        summary_text: `Biomedical evaluation generated for ${body.astronaut_id || 'ASTRO-01'} across interval ${body.start_date || '2026-10-01'} to ${body.end_date || '2026-11-13'}. Physiological indicators remain within nominal NASA Human Research Program operational bounds. Countermeasure exercise compliance verified with zero critical unmitigated telemetry excursions.`,
                        recommendations: [
                            'Maintain daily 2.5 hour ARED resistive strength and T2 treadmill exercise protocol.',
                            'Enforce strict 8-hour circadian sleep schedule with blue-enriched morning lighting.',
                            'Monitor cumulative cosmic radiation dosimeter flux during scheduled lunar EVA.',
                            'Ensure daily minimum 2.5 L fluid intake with electrolyte replenishment.',
                        ],
                        created_at: new Date().toISOString(),
                    };
                    reportsDb.unshift(report);
                    return sendJson(res, report, 201);
                }

                // 16. GET /api/reports
                if (req.method === 'GET' && pathname === '/api/reports') {
                    return sendJson(res, {
                        total: reportsDb.length,
                        reports: reportsDb,
                    });
                }

                // 17. POST /api/auth/login
                if (req.method === 'POST' && pathname === '/api/auth/login') {
                    const body = await parseBody(req);
                    const username = body.username || 'astronaut';
                    const isSurgeon = username === 'surgeon' || body.role === 'medical_team';

                    return sendJson(res, {
                        access_token: 'astrocare_jwt_' + Math.random().toString(36).substring(2),
                        token_type: 'bearer',
                        user: {
                            id: isSurgeon ? 2 : 1,
                            username: username,
                            role: isSurgeon ? 'medical_team' : 'astronaut',
                            full_name: isSurgeon ? 'Dr. Marcus Vance (Flight Surgeon)' : 'CDR Alex Vance',
                            astronaut_id: isSurgeon ? null : 'ASTRO-01',
                        },
                    });
                }

                // 18. GET /api/auth/me
                if (req.method === 'GET' && pathname === '/api/auth/me') {
                    return sendJson(res, {
                        id: 1,
                        username: 'astronaut',
                        role: 'astronaut',
                        full_name: 'CDR Alex Vance',
                        astronaut_id: 'ASTRO-01',
                    });
                }

                // 19. GET /api/datasets/info
                if (req.method === 'GET' && pathname === '/api/datasets/info') {
                    return sendJson(res, {
                        name: 'AstroCare Spaceflight Biomedical Telemetry Dataset',
                        version: '2.0.0',
                        description: 'Calibrated synthetic telemetry aligned with NASA-STD-3001 and Canadian Space Agency astronaut research benchmarks.',
                        total_variables: 12,
                        sampling_frequency_hz: 1.0,
                        simulated_mission: 'ARTEMIS-VII Lunar Surface Operations',
                        variables: [
                            { name: 'heart_rate', unit: 'BPM', description: 'Continuous single-channel electrocardiographic heart rate' },
                            { name: 'spo2', unit: '%', description: 'Peripheral pulse oximetry capillary oxygen saturation' },
                            { name: 'body_temp', unit: '°C', description: 'Core thermal regulation body temperature' },
                            { name: 'blood_pressure', unit: 'mmHg', description: 'Continuous arterial hemodynamic blood pressure' },
                            { name: 'cabin_co2', unit: 'mmHg', description: 'Spacecraft environmental carbon dioxide partial pressure' },
                            { name: 'radiation_exposure', unit: 'mSv/day', description: 'Active silicon dosimeter cosmic ionizing radiation dose' },
                        ],
                    });
                }

                // 20. POST /api/escalate-surgeon
                if (req.method === 'POST' && pathname === '/api/escalate-surgeon') {
                    const body = await parseBody(req);
                    const escalationId = 'ESC-' + Math.floor(100000 + Math.random() * 900000);
                    return sendJson(res, {
                        escalation_id: escalationId,
                        status: 'Dispatched to Ground Flight Surgeon Console (Store-and-Forward Comm Delay Buffered)',
                        timestamp: new Date().toISOString(),
                        payload: body,
                    }, 201);
                }

                // Pass through if unhandled
                next();
            });
        },
    };
}

