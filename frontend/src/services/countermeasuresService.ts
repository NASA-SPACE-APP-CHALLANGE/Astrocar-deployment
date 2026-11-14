/**
 * AstroCare Countermeasures & Comprehensive Exercise Library Service
 * Maps evidence-based physical, nutritional, circadian, and psychological protocols
 * directly to the 12 NASA Human Research Program spaceflight risks.
 */

export interface CountermeasureActivity {
    id: string;
    category: 'exercise' | 'nutrition' | 'sleep_circadian' | 'behavioral_health';
    title: string;
    targetRiskIds: string[];
    description: string;
    protocolDurationMinutes: number;
    recommendedFrequency: string;
    equipmentRequired: string;
    targetWeeklyMinutes: number;
    completedWeeklyMinutes: number;
    scientificRationale: string;
    instructions: string[];
}

export const COUNTERMEASURE_LIBRARY: CountermeasureActivity[] = [
    {
        id: 'cm-ared-squats',
        category: 'exercise',
        title: 'ARED Axial Skeletal Resistance Loading',
        targetRiskIds: ['rsk-bone-muscle', 'rsk-physical-fitness'],
        description: 'Heavy constant-load resistive squats, deadlifts, and heel raises utilizing inertial flywheel vacuum canisters to compress the femur and spine.',
        protocolDurationMinutes: 75,
        recommendedFrequency: '6 days / week',
        equipmentRequired: 'Advanced Resistive Exercise Device (ARED)',
        targetWeeklyMinutes: 450,
        completedWeeklyMinutes: 375,
        scientificRationale: 'Mechanical strain stimulates osteoblast mineral deposition and prevents Type-I slow-twitch myofibrillar proteolysis.',
        instructions: [
            'Warm up with 5 minutes of low-resistance arm/leg cycling.',
            'Perform 4 sets of 10 repetitions of bilateral squats at 75% 1-Repetition Maximum.',
            'Follow with 3 sets of 10 deadlifts ensuring lumbar spinal lordosis alignment.',
            'Cool down with static hamstring and calf stretches.',
        ],
    },
    {
        id: 'cm-t2-hiit',
        category: 'exercise',
        title: 'T2 Treadmill High-Intensity Interval Running',
        targetRiskIds: ['rsk-cardiovascular', 'rsk-physical-fitness'],
        description: 'Aerobic running with subject loading harness providing 70-85% body weight equivalent down-force to maintain cardiovascular VO₂ max.',
        protocolDurationMinutes: 45,
        recommendedFrequency: '4-5 days / week',
        equipmentRequired: 'T2 Combined Operational Load Bearing External Resistance Treadmill',
        targetWeeklyMinutes: 200,
        completedWeeklyMinutes: 180,
        scientificRationale: 'Intermittent high heart-rate intervals preserve left ventricular compliance and vascular baroreflex sensitivity.',
        instructions: [
            'Connect harness bungees to calibrated 75% body weight equivalent.',
            'Jog at baseline 8 km/h for 5 minutes warm-up.',
            'Perform 6 intervals: 2 minutes at 12 km/h followed by 2 minutes at 7 km/h recovery.',
            'Cool down at 5 km/h walking pace for 5 minutes.',
        ],
    },
    {
        id: 'cm-circadian-lighting',
        category: 'sleep_circadian',
        title: 'Circadian Solid-State Light Therapy (SSL)',
        targetRiskIds: ['rsk-sleep-circadian', 'rsk-behavioral-isolation'],
        description: 'Scheduled blue-enriched dynamic LED illumination in morning hours transitioning to warm depleted spectrum prior to sleep quarters.',
        protocolDurationMinutes: 30,
        recommendedFrequency: 'Daily upon wake-up',
        equipmentRequired: 'Solid-State Light Assemblies (SSLA)',
        targetWeeklyMinutes: 210,
        completedWeeklyMinutes: 210,
        scientificRationale: 'Photons at 460 nm stimulate intrinsically photosensitive retinal ganglion cells (ipRGCs), suppressing melatonin and entraining the suprachiasmatic nucleus.',
        instructions: [
            'Turn crew quarters illumination to "High Blue-Enriched" (6500K) for first 60 minutes after waking.',
            'Maintain standard nominal work lighting (4500K) during primary operational shift.',
            'Switch quarters to "Pre-Sleep Warm" (2700K, 0% blue spectrum) 2 hours before lights out.',
        ],
    },
    {
        id: 'cm-box-breathing',
        category: 'behavioral_health',
        title: 'Parasympathetic Box Breathing & Autonomic Recovery',
        targetRiskIds: ['rsk-behavioral-isolation', 'rsk-cardiovascular'],
        description: 'Controlled 4-4-4-4 rhythmic respiration pattern to elevate heart rate variability (HRV) and dampen sympathetic fight-or-flight cortisol surges.',
        protocolDurationMinutes: 10,
        recommendedFrequency: 'Daily evening or post-stress',
        equipmentRequired: 'AstroCare Interactive Breathing Visualizer / Wearable HRV sensor',
        targetWeeklyMinutes: 70,
        completedWeeklyMinutes: 50,
        scientificRationale: 'Controlled slow vagal breathing at 0.1 Hz (6 breaths/min) maximizes respiratory sinus arrhythmia and autonomic balance.',
        instructions: [
            'Inhale slowly and deeply through nose for 4 seconds.',
            'Hold lungs full without straining for 4 seconds.',
            'Exhale smoothly through parted lips for 4 seconds.',
            'Hold empty lungs in complete stillness for 4 seconds.',
            'Repeat for 10 consecutive cycles.',
        ],
    },
    {
        id: 'cm-fluid-loading',
        category: 'nutrition',
        title: 'Pre-Landing Plasma Volume Fluid Loading',
        targetRiskIds: ['rsk-cardiovascular', 'rsk-vestibular-sensorimotor'],
        description: 'Consumption of isotonic saline solution or bouillon tablets prior to gravity transition to restore intravascular plasma volume.',
        protocolDurationMinutes: 60,
        recommendedFrequency: '2 hours prior to planetary entry / landing',
        equipmentRequired: 'Oral Rehydration Salts / Isotonic Beverage Pouches',
        targetWeeklyMinutes: 60,
        completedWeeklyMinutes: 60,
        scientificRationale: 'Replaces the 1.5 L hypovolemia deficit caused by cephalad diuresis in microgravity, preventing orthostatic collapse.',
        instructions: [
            'Ingest eight 1.0 g sodium chloride tablets with 1,000 mL water over a 60-minute interval.',
            'Don lower body anti-g compression garments at 30-40 mmHg.',
            'Avoid rapid posture shifts until touchdown.',
        ],
    },
];

const COMPLETED_STORAGE_KEY = 'astrocare_completed_countermeasures';

export function getCompletedCountermeasures(astronautId = 'ASTRO-01'): string[] {
    try {
        const raw = localStorage.getItem(`${COMPLETED_STORAGE_KEY}_${astronautId}`);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function logCompletedCountermeasure(astronautId: string, activityId: string): void {
    const list = getCompletedCountermeasures(astronautId);
    if (!list.includes(activityId)) {
        list.push(activityId);
        try {
            localStorage.setItem(`${COMPLETED_STORAGE_KEY}_${astronautId}`, JSON.stringify(list));
        } catch (err) {
            console.warn('Failed saving completed countermeasure', err);
        }
    }
}

