// AstroCare & AstroVital AI API service layer
import type {
    MetricStats, ReadingListResponse, AnomalyRunResult,
    Anomaly, AlertListResponse, Alert, ImportSummary,
    DatasetInfo, HealthCheck, Astronaut, HealthTrendsResponse,
    MissionReport, LoginResponse, SimulatorStatus, User
} from '@/types';

const rawBase = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');
const BASE = rawBase ? `${rawBase}/api` : '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    // System Health
    health: () => fetchJSON<HealthCheck>(`${BASE}/health`),

    // Astronaut Profiles & Baselines
    astronauts: {
        list: () => fetchJSON<{ total: number; astronauts: Astronaut[] }>(`${BASE}/astronauts`),
        get: (id: string) => fetchJSON<Astronaut>(`${BASE}/astronauts/${id}`),
        update: (id: string, data: Partial<Astronaut>) =>
            fetchJSON<Astronaut>(`${BASE}/astronauts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }),
    },

    // Metrics & Telemetry
    metrics: (astronautId = 'ASTRO-01') =>
        fetchJSON<MetricStats[]>(`${BASE}/metrics?astronaut_id=${astronautId}`),

    readings: (params: Record<string, string | number | boolean | undefined> = {}) => {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined) qs.set(k, String(v));
        }
        return fetchJSON<ReadingListResponse>(`${BASE}/health-readings?${qs}`);
    },

    healthTrends: (range = '24h', astronautId = 'ASTRO-01') => {
        const qs = new URLSearchParams({ range, astronaut_id: astronautId });
        return fetchJSON<HealthTrendsResponse>(`${BASE}/health-trends?${qs}`);
    },

    timeSeries: (metric: string, start?: string, end?: string, limit = 200, astronautId?: string) => {
        const qs = new URLSearchParams({ metric, limit: String(limit) });
        if (start) qs.set('start', start);
        if (end) qs.set('end', end);
        if (astronautId) qs.set('astronaut_id', astronautId);
        return fetchJSON<any>(`${BASE}/readings/timeseries?${qs}`);
    },

    // Anomaly Detection
    runAnomalyAnalysis: (contamination = 0.05, limit = 500, astronautId?: string) => {
        const qs = new URLSearchParams({ contamination: String(contamination), limit: String(limit) });
        if (astronautId) qs.set('astronaut_id', astronautId);
        return fetchJSON<AnomalyRunResult>(`${BASE}/analyze?${qs}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contamination, limit, astronaut_id: astronautId }),
        });
    },

    anomalies: (runId?: string, onlyFlagged = true, limit = 100, astronautId?: string) => {
        const qs = new URLSearchParams({ only_flagged: String(onlyFlagged), limit: String(limit) });
        if (runId) qs.set('run_id', runId);
        if (astronautId) qs.set('astronaut_id', astronautId);
        return fetchJSON<Anomaly[]>(`${BASE}/anomalies?${qs}`);
    },

    // Alert Center
    alerts: (params: Record<string, string | number | boolean | undefined> = {}) => {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined) qs.set(k, String(v));
        }
        return fetchJSON<AlertListResponse>(`${BASE}/alerts?${qs}`);
    },

    updateAlert: (alertId: string, updates: { acknowledged?: boolean; reviewer_notes?: string; review_status?: string }) =>
        fetchJSON<Alert>(`${BASE}/alerts/${alertId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        }),

    acknowledgeAlert: (alertId: string) =>
        fetchJSON<{ status: string; alert_id: string }>(
            `${BASE}/alerts/${alertId}/acknowledge`,
            { method: 'PATCH' }
        ),

    // Reports
    reports: {
        generate: (payload: { astronaut_id: string; start_date?: string; end_date?: string; title?: string }) =>
            fetchJSON<MissionReport>(`${BASE}/reports/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }),
        list: (limit = 50) =>
            fetchJSON<{ total: number; reports: MissionReport[] }>(`${BASE}/reports?limit=${limit}`),
        get: (reportId: string) =>
            fetchJSON<MissionReport>(`${BASE}/reports/${reportId}`),
        exportCsvUrl: (reportId: string) => `${BASE}/reports/${reportId}/export/csv`,
    },

    // Simulator
    simulator: {
        status: () => fetchJSON<SimulatorStatus>(`${BASE}/simulator/status`),
        start: (n = 500, astronautId = 'ASTRO-01') =>
            fetchJSON<{ status: string; records_generated: number }>(
                `${BASE}/simulator/start?n_records=${n}&astronaut_id=${astronautId}`,
                { method: 'POST' }
            ),
        step: (scenario = 'normal', astronautId = 'ASTRO-01') =>
            fetchJSON<any>(`${BASE}/simulator/step`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario, astronaut_id: astronautId }),
            }),
        reset: (n = 500, astronautId = 'ASTRO-01') =>
            fetchJSON<{ status: string; records_generated: number }>(
                `${BASE}/simulator/reset?n_records=${n}&astronaut_id=${astronautId}`,
                { method: 'POST' }
            ),
    },

    // Auth
    auth: {
        login: (credentials: { username: string; password: string }) =>
            fetchJSON<LoginResponse>(`${BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            }),
        me: (username = 'astronaut') =>
            fetchJSON<User>(`${BASE}/auth/me?username=${username}`),
    },

    // Import & Datasets
    importCSV: (file: File) => {
        const form = new FormData();
        form.append('file', file);
        return fetchJSON<ImportSummary>(`${BASE}/readings/import`, { method: 'POST', body: form });
    },

    datasetInfo: () => fetchJSON<DatasetInfo>(`${BASE}/datasets/info`),
} as const;
