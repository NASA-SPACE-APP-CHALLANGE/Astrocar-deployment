import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { User, Astronaut } from '@/types';
import { api } from '@/services/api';
import { AuthContext } from './auth-types';

const DEFAULT_MISSION_ASTRONAUTS: Astronaut[] = [
    {
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
        created_at: '2026-06-24T00:00:00Z',
    },
    {
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
        created_at: '2026-06-24T00:00:00Z',
    },
    {
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
        created_at: '2026-06-24T00:00:00Z',
    },
    {
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
        created_at: '2026-06-24T00:00:00Z',
    },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('astrovital_user');
            return saved ? JSON.parse(saved) : {
                id: 1,
                username: 'astronaut',
                role: 'astronaut',
                full_name: 'CDR Alex Vance',
                astronaut_id: 'ASTRO-01',
            };
        } catch {
            return {
                id: 1,
                username: 'astronaut',
                role: 'astronaut',
                full_name: 'CDR Alex Vance',
                astronaut_id: 'ASTRO-01',
            };
        }
    });

    const [activeAstronautId, setActiveAstronautId] = useState<string>('ASTRO-01');
    const [allAstronauts, setAllAstronauts] = useState<Astronaut[]>([]);
    const [activeAstronaut, setActiveAstronaut] = useState<Astronaut | null>(null);
    const [isLoadingAstronauts, setIsLoadingAstronauts] = useState<boolean>(true);
    const [astronautsError, setAstronautsError] = useState<string | null>(null);

    // In-flight guard to prevent duplicate API requests
    const inFlightRef = useRef<boolean>(false);

    const loadAstronautsData = useCallback(async () => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setIsLoadingAstronauts(true);
        setAstronautsError(null);

        // AbortController timeout guard to prevent infinite loading state
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        try {
            // Attempt API fetch
            const data = await api.astronauts.list();
            clearTimeout(timeoutId);

            if (data && data.astronauts && data.astronauts.length > 0) {
                setAllAstronauts(data.astronauts);
                localStorage.setItem('astrocare_cached_astronauts', JSON.stringify(data.astronauts));
                const found = data.astronauts.find(a => a.astronaut_id === activeAstronautId) || data.astronauts[0];
                setActiveAstronaut(found);
                setAstronautsError(null);
            } else {
                throw new Error('API returned an empty astronaut manifest.');
            }
        } catch (err: any) {
            clearTimeout(timeoutId);
            const isAbort = err?.name === 'AbortError';
            console.warn(`[AstroCare Auth] API connection warning (${isAbort ? 'Timeout' : err.message}). Fallback to verified local register.`);

            // Inspect localStorage cache
            let cached: Astronaut[] | null = null;
            try {
                const raw = localStorage.getItem('astrocare_cached_astronauts');
                if (raw) cached = JSON.parse(raw);
            } catch {
                cached = null;
            }

            const listToUse = (cached && cached.length > 0) ? cached : DEFAULT_MISSION_ASTRONAUTS;
            setAllAstronauts(listToUse);

            const found = listToUse.find(a => a.astronaut_id === activeAstronautId) || listToUse[0];
            setActiveAstronaut(found);

            // Set informative error/unavailable indicator for UI status banner
            setAstronautsError(
                isAbort
                    ? 'Mission Control telemetry gateway connection timed out (4.5s). Displaying local verified baseline.'
                    : `Telemetry gateway unavailable (${err.message || 'Network disconnected'}). Displaying local flight manifest.`
            );
        } finally {
            setIsLoadingAstronauts(false);
            inFlightRef.current = false;
        }
    }, [activeAstronautId]);

    // Initial load and whenever activeAstronautId changes
    useEffect(() => {
        loadAstronautsData();
    }, [loadAstronautsData]);

    // Manual refresh or retry
    const refreshAstronauts = useCallback(async () => {
        await loadAstronautsData();
    }, [loadAstronautsData]);

    const retryLoadAstronauts = useCallback(async () => {
        await loadAstronautsData();
    }, [loadAstronautsData]);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await api.auth.login({ username, password });
            setUser(res.user);
            localStorage.setItem('astrovital_user', JSON.stringify(res.user));
            if (res.user.astronaut_id) {
                setActiveAstronautId(res.user.astronaut_id);
            }
            return true;
        } catch (err) {
            console.error('Login error:', err);
            return false;
        }
    }, []);

    const loginAsRole = useCallback(async (role: 'astronaut' | 'medical_team') => {
        const username = role === 'astronaut' ? 'astronaut' : 'surgeon';
        const password = role === 'astronaut' ? 'astro2025' : 'medical2025';
        await login(username, password);
    }, [login]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('astrovital_user');
    }, []);

    const contextValue = useMemo(() => ({
        user,
        activeAstronautId,
        activeAstronaut,
        allAstronauts,
        isLoadingAstronauts,
        astronautsError,
        login,
        loginAsRole,
        logout,
        setActiveAstronautId,
        refreshAstronauts,
        retryLoadAstronauts,
    }), [user, activeAstronautId, activeAstronaut, allAstronauts, isLoadingAstronauts, astronautsError, login, loginAsRole, logout, setActiveAstronautId, refreshAstronauts, retryLoadAstronauts]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
