/**
 * AstroCare Mission Environment & Gravity Configuration Service
 * Provides dynamic environment contexts influencing monitoring thresholds,
 * communication delays, radiation models, and countermeasure recommendations.
 */

export type EnvironmentId =
    | 'spacecraft_transit'
    | 'iss_leo'
    | 'lunar_base'
    | 'mars_base'
    | 'rover_operations'
    | 'spacewalk_eva';

export type MissionPhase =
    | 'pre_launch'
    | 'transit'
    | 'surface_operations'
    | 'return_transit'
    | 'post_flight_recovery';

export type GravityLevel = '0g' | '0.16g' | '0.38g' | '1g';

export interface MissionEnvironmentConfig {
    id: EnvironmentId;
    name: string;
    description: string;
    gravity: GravityLevel;
    gravityNumericG: number;
    defaultPhase: MissionPhase;
    communicationDelaySeconds: number;
    communicationDelayLabel: string;
    radiationEnvironment: string;
    radiationFluxExpected: string;
    ambientPressureKpa: number;
    ambientO2Percent: number;
    ambientCO2MaxMmHg: number;
    activeMonitoringRules: string[];
    specialReminders: string[];
    evaSuitOperatingPressureKpa?: number;
}

export const MISSION_ENVIRONMENTS: Record<EnvironmentId, MissionEnvironmentConfig> = {
    spacecraft_transit: {
        id: 'spacecraft_transit',
        name: 'Spacecraft in Deep-Space Transit',
        description: 'Orion / Deep Space Transport cruising through interplanetary space between Earth, Moon, or Mars.',
        gravity: '0g',
        gravityNumericG: 0.0,
        defaultPhase: 'transit',
        communicationDelaySeconds: 180, // e.g. 3 minutes during early Mars transit
        communicationDelayLabel: '3.0 minutes each way (6 min round-trip)',
        radiationEnvironment: 'Interplanetary Deep Space (Unshielded GCR + Active SPE Threat)',
        radiationFluxExpected: '0.45 - 1.20 mSv/day (Quiescent)',
        ambientPressureKpa: 101.3,
        ambientO2Percent: 20.9,
        ambientCO2MaxMmHg: 3.5,
        activeMonitoringRules: [
            'Continuous autonomous anomaly detection active due to ground light-time latency.',
            'Strict daily 2.5h ARED resistive exercise to counteract 0g bone deconditioning.',
            'Active dosimeter alarm linked to automatic water-shielded storm shelter siren.',
        ],
        specialReminders: [
            'All medical escalations must buffer into store-and-forward telemetry packages.',
            'Verify sleep quarter ventilation fans to prevent local CO₂ stagnant pooling.',
        ],
    },
    iss_leo: {
        id: 'iss_leo',
        name: 'International Space Station (ISS)',
        description: 'Low Earth Orbit (400 km altitude) protected partially by Earth geomagnetic field.',
        gravity: '0g',
        gravityNumericG: 0.0,
        defaultPhase: 'transit',
        communicationDelaySeconds: 0.2,
        communicationDelayLabel: '< 0.5 seconds (Near-Real-Time Ground Sync)',
        radiationEnvironment: 'LEO Trapped Belt & GCR (South Atlantic Anomaly Passes)',
        radiationFluxExpected: '0.30 - 0.50 mSv/day',
        ambientPressureKpa: 101.3,
        ambientO2Percent: 20.9,
        ambientCO2MaxMmHg: 4.0,
        activeMonitoringRules: [
            'South Atlantic Anomaly (SAA) orbital pass dosimetry tracking enabled.',
            'Direct real-time two-way audio-video consultation with Mission Control Flight Surgeon available.',
            'Daily exercise compliance tracked against Expedition flight medical standards.',
        ],
        specialReminders: [
            'Real-time ground control medical oversight available on S-band/Ku-band.',
        ],
    },
    lunar_base: {
        id: 'lunar_base',
        name: 'Artemis Lunar Base Camp',
        description: 'Surface outpost located at Moon South Pole (Shackleton Crater rim) in 1/6th gravity.',
        gravity: '0.16g',
        gravityNumericG: 0.166,
        defaultPhase: 'surface_operations',
        communicationDelaySeconds: 1.3,
        communicationDelayLabel: '1.3 seconds each way (2.6s round-trip)',
        radiationEnvironment: 'Lunar Surface (Cosmic Rays + Regolith Secondary Neutrons + Albedo)',
        radiationFluxExpected: '0.40 - 0.90 mSv/day',
        ambientPressureKpa: 56.5, // Artemis 8.2 psi exploration atmosphere
        ambientO2Percent: 34.0,   // Elevated O2 to balance lower pressure
        ambientCO2MaxMmHg: 3.0,
        activeMonitoringRules: [
            'Exploration atmosphere (56.5 kPa / 34% O₂) rule set active: zero prebreathe required for surface EVA.',
            'Regolith abrasive dust optical sensor filtration and pulmonary cough monitoring.',
            'Partial-gravity (0.16g) gait adaptation and sensorimotor balance tracking.',
        ],
        specialReminders: [
            'Inspect airlock HEPA filtration after lunar surface egress for regolith contamination.',
            'Maintain lower body axial loading to prevent bone resorption in 1/6th gravity.',
        ],
    },
    mars_base: {
        id: 'mars_base',
        name: 'Mars Surface Outpost',
        description: 'Planetary surface operations at Jezero Crater in 3/8th gravity under thin CO₂ atmosphere.',
        gravity: '0.38g',
        gravityNumericG: 0.38,
        defaultPhase: 'surface_operations',
        communicationDelaySeconds: 1200, // 20 minutes
        communicationDelayLabel: '20.0 minutes each way (40 min round-trip latency)',
        radiationEnvironment: 'Martian Surface (Atmosphere attenuated GCR + Surface Neutrons)',
        radiationFluxExpected: '0.35 - 0.70 mSv/day',
        ambientPressureKpa: 70.3,
        ambientO2Percent: 28.0,
        ambientCO2MaxMmHg: 3.0,
        activeMonitoringRules: [
            '100% Autonomous Clinical Decision Support required due to 40-minute communication turnaround.',
            'Partial gravity (0.38g) biomechanical load models active.',
            'Local habitat regolith berm radiation attenuation verified.',
        ],
        specialReminders: [
            'Earth communication delay makes real-time medical intervention impossible.',
            'Crew Medical Officer holds primary clinical triage and prescription authority.',
        ],
    },
    rover_operations: {
        id: 'rover_operations',
        name: 'Pressurized Planetary Rover',
        description: 'Mobile surface excursion vehicle on extended multi-day surface geological traverses.',
        gravity: '0.16g',
        gravityNumericG: 0.166,
        defaultPhase: 'surface_operations',
        communicationDelaySeconds: 2.0,
        communicationDelayLabel: '1.5 - 2.5 seconds (Relay through Lunar Gateway)',
        radiationEnvironment: 'Surface Excursion (Mobile cabin shielding only)',
        radiationFluxExpected: '0.50 - 1.10 mSv/day',
        ambientPressureKpa: 56.5,
        ambientO2Percent: 34.0,
        ambientCO2MaxMmHg: 4.5,
        activeMonitoringRules: [
            'Confined cabin ergonomics and whole-body vibration monitoring during rough terrain transit.',
            'Compact ECLSS scrubbing telemetry monitoring with rapid consumable depletion alerts.',
            'Two-crew team behavioral harmony and mutual stress index tracking.',
        ],
        specialReminders: [
            'Maintain continuous suit port seal pressure telemetry.',
        ],
    },
    spacewalk_eva: {
        id: 'spacewalk_eva',
        name: 'Extravehicular Activity (EVA Spacewalk)',
        description: 'Astronaut working outside the habitat in Exploration Extravehicular Mobility Unit (xEMU).',
        gravity: '0g',
        gravityNumericG: 0.0,
        defaultPhase: 'surface_operations',
        communicationDelaySeconds: 0.1,
        communicationDelayLabel: '< 0.1 seconds (Local Habitat Wireless Telemetry)',
        radiationEnvironment: 'Direct Cosmic Space Environment (Suit Shielding Only)',
        radiationFluxExpected: '1.20 - 3.50 mSv/day (High Exposure)',
        ambientPressureKpa: 29.6, // 4.3 psi xEMU suit pressure
        ambientO2Percent: 100.0,  // Pure oxygen in spacesuit
        ambientCO2MaxMmHg: 5.0,
        evaSuitOperatingPressureKpa: 29.6,
        activeMonitoringRules: [
            'Continuous suit pressure and suit oxygen leakage rate tracking.',
            'Metabolic heat production and liquid cooling ventilation garment (LCVG) loop monitoring.',
            'Real-time heart rate exertion threshold (sustained HR > 150 BPM triggers mandatory rest stop).',
        ],
        specialReminders: [
            'CRITICAL SAFETY RULE: Spacewalk must be terminated immediately if suit pressure drops below 26.0 kPa.',
            'Monitor glove finger perfusion and thermal cooling.',
        ],
    },
};

const ENVIRONMENT_STORAGE_KEY = 'astrocare_active_environment_config';

export function getActiveEnvironmentConfig(): MissionEnvironmentConfig {
    try {
        const raw = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (MISSION_ENVIRONMENTS[parsed.id as EnvironmentId]) {
                return MISSION_ENVIRONMENTS[parsed.id as EnvironmentId];
            }
        }
    } catch (err) {
        console.warn('Failed reading active environment from storage', err);
    }
    return MISSION_ENVIRONMENTS.lunar_base;
}

export function setActiveEnvironmentConfig(envId: EnvironmentId): MissionEnvironmentConfig {
    const config = MISSION_ENVIRONMENTS[envId] || MISSION_ENVIRONMENTS.lunar_base;
    try {
        localStorage.setItem(ENVIRONMENT_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
        console.warn('Failed saving active environment to storage', err);
    }
    return config;
}

