/**
 * AstroCare Routine Prompts & Daily Checklist Service
 * Implements configurable mission health routines and daily compliance tracking
 * Adheres to NASA flight crew operations scheduling.
 */

export interface DailyRoutineItem {
    id: string;
    title: string;
    category: 'vitals' | 'wellbeing' | 'exercise' | 'nutrition' | 'eva';
    frequency: 'daily' | 'weekly' | 'pre_eva';
    scheduledTime: string;
    pointsReward: number;
    completed: boolean;
    completedAt?: string;
    notes?: string;
}

export interface RoutineDayState {
    date: string;
    astronautId: string;
    items: DailyRoutineItem[];
    completionPercentage: number;
}

const ROUTINE_STORAGE_PREFIX = 'astrocare_routine_';

export function getInitialDailyRoutine(dateStr = new Date().toISOString().split('T')[0]): DailyRoutineItem[] {
    return [
        {
            id: 'rtn-morning-vitals',
            title: 'Morning Resting Vitals & Blood Pressure Sync',
            category: 'vitals',
            frequency: 'daily',
            scheduledTime: '07:00 UTC',
            pointsReward: 25,
            completed: true,
            completedAt: `${dateStr}T07:14:00Z`,
            notes: 'HR: 62 bpm, BP: 118/76 mmHg recorded via Bio-Monitor.',
        },
        {
            id: 'rtn-mood-sleep',
            title: 'Sleep Quality & Mood Check-In',
            category: 'wellbeing',
            frequency: 'daily',
            scheduledTime: '07:30 UTC',
            pointsReward: 20,
            completed: true,
            completedAt: `${dateStr}T07:32:00Z`,
            notes: '7.4h sleep logged (86% quality index). Mood 8.5/10.',
        },
        {
            id: 'rtn-hydration-morning',
            title: 'Morning Hydration & Electrolyte Pack (750 mL)',
            category: 'nutrition',
            frequency: 'daily',
            scheduledTime: '08:00 UTC',
            pointsReward: 15,
            completed: true,
            completedAt: `${dateStr}T08:05:00Z`,
        },
        {
            id: 'rtn-ared-strength',
            title: 'ARED Heavy Resistive Strength Protocol (75 min)',
            category: 'exercise',
            frequency: 'daily',
            scheduledTime: '10:00 UTC',
            pointsReward: 50,
            completed: true,
            completedAt: `${dateStr}T11:18:00Z`,
            notes: 'Deadlifts & squats: 2,100 N axial skeletal load target achieved.',
        },
        {
            id: 'rtn-t2-aerobic',
            title: 'T2 Treadmill Interval Aerobic Run (60 min)',
            category: 'exercise',
            frequency: 'daily',
            scheduledTime: '15:30 UTC',
            pointsReward: 40,
            completed: false,
        },
        {
            id: 'rtn-caloric-logging',
            title: 'Daily Nutritional & Caloric Intake Verification (2,850 kcal)',
            category: 'nutrition',
            frequency: 'daily',
            scheduledTime: '19:00 UTC',
            pointsReward: 20,
            completed: false,
        },
        {
            id: 'rtn-evening-relaxation',
            title: 'Evening Circadian Wind-Down & Box Breathing (10 min)',
            category: 'wellbeing',
            frequency: 'daily',
            scheduledTime: '21:30 UTC',
            pointsReward: 20,
            completed: false,
        },
        {
            id: 'rtn-pre-eva-check',
            title: 'Pre-EVA Suit Pressure & Nitrogen Washout Verification',
            category: 'eva',
            frequency: 'pre_eva',
            scheduledTime: 'As Scheduled',
            pointsReward: 35,
            completed: false,
            notes: 'Required prior to any airlock depressurization.',
        },
    ];
}

export function loadDailyRoutine(astronautId = 'ASTRO-01', dateStr = new Date().toISOString().split('T')[0]): RoutineDayState {
    const key = `${ROUTINE_STORAGE_PREFIX}${astronautId}_${dateStr}`;
    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (err) {
        console.warn('Failed reading daily routine', err);
    }

    const items = getInitialDailyRoutine(dateStr);
    const completedCount = items.filter(i => i.completed).length;
    const state: RoutineDayState = {
        date: dateStr,
        astronautId,
        items,
        completionPercentage: Math.round((completedCount / items.length) * 100),
    };
    saveDailyRoutine(state);
    return state;
}

export function saveDailyRoutine(state: RoutineDayState): void {
    const key = `${ROUTINE_STORAGE_PREFIX}${state.astronautId}_${state.date}`;
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
        console.warn('Failed saving daily routine', err);
    }
}

export function toggleRoutineItem(astronautId: string, itemId: string, dateStr = new Date().toISOString().split('T')[0]): RoutineDayState {
    const state = loadDailyRoutine(astronautId, dateStr);
    const item = state.items.find(i => i.id === itemId);
    if (item) {
        item.completed = !item.completed;
        item.completedAt = item.completed ? new Date().toISOString() : undefined;
    }
    const completedCount = state.items.filter(i => i.completed).length;
    state.completionPercentage = Math.round((completedCount / state.items.length) * 100);
    saveDailyRoutine(state);
    return state;
}

