/**
 * AstroCare Health Engagement & Gamification Service
 * Promotes positive astronaut wellness routines through streaks, badges, and missions
 * 
 * STRICT AEROSPACE SAFETY RULES:
 * 1. Never reward unsafe exercise or exceeding heart rate exertion limits.
 * 2. Never encourage ignoring symptoms or working through pain.
 * 3. Never hide or obscure critical clinical alerts with game elements.
 * 4. Never penalize astronauts for honestly reporting adverse symptoms or resting.
 * 5. Gamification scores are motivational indices, not certified medical diagnostic health scores.
 */

export interface MissionBadge {
    id: string;
    name: string;
    category: 'exercise' | 'sleep' | 'hydration' | 'resilience' | 'mission';
    description: string;
    iconName: string;
    unlocked: boolean;
    unlockedDate?: string;
    progressPercent: number;
}

export interface CrewLeaderboardEntry {
    astronautId: string;
    name: string;
    role: string;
    streakDays: number;
    weeklyPoints: number;
    exerciseCompliance: number;
    optedIn: boolean;
}

export interface GamificationState {
    astronautId: string;
    currentStreakDays: number;
    longestStreakDays: number;
    totalActivityPoints: number;
    weeklyPointsEarned: number;
    missionHealthScore: number; // 0 - 100 motivational readiness index
    badges: MissionBadge[];
    weeklyMissions: {
        id: string;
        title: string;
        rewardPoints: number;
        completed: boolean;
        progress: string;
    }[];
    leaderboard: CrewLeaderboardEntry[];
}

const GAMIFICATION_STORAGE_PREFIX = 'astrocare_gamification_';

export function getInitialGamificationState(astronautId = 'ASTRO-01'): GamificationState {
    return {
        astronautId,
        currentStreakDays: 14,
        longestStreakDays: 28,
        totalActivityPoints: 3420,
        weeklyPointsEarned: 840,
        missionHealthScore: 94, // High operational readiness
        badges: [
            {
                id: 'bdg-bone-guardian',
                name: 'Bone Mineral Guardian',
                category: 'exercise',
                description: 'Completed 30 consecutive days of heavy ARED axial skeletal resistance training.',
                iconName: 'Shield',
                unlocked: true,
                unlockedDate: '2026-10-18',
                progressPercent: 100,
            },
            {
                id: 'bdg-circadian-master',
                name: 'Circadian Master',
                category: 'sleep',
                description: 'Maintained 7+ hours of scheduled sleep with synchronized circadian lighting for 14 days.',
                iconName: 'Moon',
                unlocked: true,
                unlockedDate: '2026-11-04',
                progressPercent: 100,
            },
            {
                id: 'bdg-hydration-pioneer',
                name: 'Hydration Pioneer',
                category: 'hydration',
                description: 'Logged 2.5 L minimum daily fluid intake for 21 consecutive flight days.',
                iconName: 'Droplets',
                unlocked: true,
                unlockedDate: '2026-11-10',
                progressPercent: 100,
            },
            {
                id: 'bdg-cosmic-resilience',
                name: 'Cosmic Resilience',
                category: 'resilience',
                description: 'Completed all scheduled guided breathing and autonomic recovery sessions this month.',
                iconName: 'HeartPulse',
                unlocked: false,
                progressPercent: 78,
            },
            {
                id: 'bdg-lunar-veteran',
                name: 'Lunar Surface Veteran',
                category: 'mission',
                description: 'Surpassed 100 successful operational flight days on Artemis Lunar expedition.',
                iconName: 'Award',
                unlocked: true,
                unlockedDate: '2026-10-01',
                progressPercent: 100,
            },
        ],
        weeklyMissions: [
            {
                id: 'wkm-1',
                title: 'Complete 6 scheduled ARED resistance workouts',
                rewardPoints: 200,
                completed: true,
                progress: '6 / 6 sessions completed',
            },
            {
                id: 'wkm-2',
                title: 'Maintain daily 7.0+ hours sleep architecture',
                rewardPoints: 150,
                completed: true,
                progress: '7 / 7 nights nominal',
            },
            {
                id: 'wkm-3',
                title: 'Log daily food barcode & nutritional entries',
                rewardPoints: 100,
                completed: false,
                progress: '5 / 7 days logged',
            },
            {
                id: 'wkm-4',
                title: 'Conduct weekly pre-EVA biometric review check',
                rewardPoints: 120,
                completed: false,
                progress: 'Pending Friday flight surgeon sync',
            },
        ],
        leaderboard: [
            {
                astronautId: 'ASTRO-02',
                name: 'Dr. Sarah Chen',
                role: 'Chief Medical Officer',
                streakDays: 19,
                weeklyPoints: 920,
                exerciseCompliance: 98.2,
                optedIn: true,
            },
            {
                astronautId: 'ASTRO-01',
                name: 'CDR Alex Vance',
                role: 'Mission Commander',
                streakDays: 14,
                weeklyPoints: 840,
                exerciseCompliance: 96.5,
                optedIn: true,
            },
            {
                astronautId: 'ASTRO-04',
                name: 'Elena Rostova',
                role: 'Payload Specialist',
                streakDays: 12,
                weeklyPoints: 790,
                exerciseCompliance: 94.0,
                optedIn: true,
            },
            {
                astronautId: 'ASTRO-03',
                name: 'Marcus Thorne',
                role: 'Flight Engineer',
                streakDays: 8,
                weeklyPoints: 720,
                exerciseCompliance: 91.5,
                optedIn: true,
            },
        ],
    };
}

export function loadGamificationState(astronautId = 'ASTRO-01'): GamificationState {
    try {
        const raw = localStorage.getItem(`${GAMIFICATION_STORAGE_PREFIX}${astronautId}`);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (err) {
        console.warn('Failed reading gamification state', err);
    }
    const state = getInitialGamificationState(astronautId);
    saveGamificationState(state);
    return state;
}

export function saveGamificationState(state: GamificationState): void {
    try {
        localStorage.setItem(`${GAMIFICATION_STORAGE_PREFIX}${state.astronautId}`, JSON.stringify(state));
    } catch (err) {
        console.warn('Failed saving gamification state', err);
    }
}

