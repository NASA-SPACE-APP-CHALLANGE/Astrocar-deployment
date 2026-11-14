/**
 * AstroCare Symptom Checker & "What Should I Do Now?" Guidance Service
 * Implements conservative aerospace clinical triage logic
 * Categorizes symptoms into Self-Care, Continue Monitoring, Contact Flight Surgeon, or Emergency Response.
 */

export type TriageUrgency =
    | 'emergency_response'
    | 'contact_flight_surgeon'
    | 'continue_monitoring'
    | 'self_care';

export interface SymptomAssessmentResult {
    triageLevel: TriageUrgency;
    title: string;
    summary: string;
    immediateInstructions: string[];
    monitoringDirectives: string[];
    flightSurgeonEscalationRecommended: boolean;
    nasaHrpReference: string;
}

export interface SymptomInput {
    headacheSeverity: 'none' | 'mild' | 'moderate' | 'severe';
    chestDiscomfort: boolean;
    shortnessOfBreath: boolean;
    visualBlurriness: boolean;
    nauseaOrDizziness: boolean;
    jointOrMusclePain: boolean;
    fatigueExhaustion: boolean;
    recentEVAExposure: boolean;
    notes?: string;
}

export function evaluateSymptoms(input: SymptomInput): SymptomAssessmentResult {
    // 1. Critical Emergency Triggers
    if (input.chestDiscomfort || (input.shortnessOfBreath && input.headacheSeverity === 'severe')) {
        return {
            triageLevel: 'emergency_response',
            title: 'CRITICAL EMERGENCY: Cardiopulmonary / Depressurization Alert',
            summary:
                'Reported symptoms (chest discomfort and/or acute severe shortness of breath) indicate potential acute myocardial strain, pulmonary gas exchange failure, or acute habitat atmospheric contamination.',
            immediateInstructions: [
                'Immediately don emergency oxygen mask (100% O₂ at 101.3 kPa).',
                'Notify Commander and habitat crew via audible intercom.',
                'Cease all physical exertion and sit or lie in a semi-recumbent posture.',
                'Verify cabin atmospheric gauges for oxygen drops (nominal > 19.5%) or CO₂ spikes.',
            ],
            monitoringDirectives: [
                'Attach 12-lead equivalent continuous ECG leads immediately.',
                'Continuous pulse oximeter monitoring on contralateral finger.',
                'Record manual blood pressure every 5 minutes.',
            ],
            flightSurgeonEscalationRecommended: true,
            nasaHrpReference: 'NASA STD-3001 Vol 1 Medical Operations: Acute Cardiac & Pulmonary Care in Spaceflight',
        };
    }

    // 2. Spacewalk Decompression or Neurological SANS Concern
    if (input.recentEVAExposure && (input.jointOrMusclePain || input.nauseaOrDizziness)) {
        return {
            triageLevel: 'contact_flight_surgeon',
            title: 'HIGH PRIORITY: Possible Extravehicular Decompression Sickness (DCS)',
            summary:
                'Joint pain or vestibular disorientation following recent spacewalk exposure suggests possible inert nitrogen micro-bubble evolution in synovial fluid or vascular spaces.',
            immediateInstructions: [
                'Initiate 100% normobaric oxygen prebreathe immediately via tight-fitting mask.',
                'Do not perform any heavy resistance exercise or load-bearing movements.',
                'Hydrate with 500 mL electrolyte fluid to enhance peripheral microcirculation.',
                'Prepare airlock hyperbaric treatment protocol if symptoms worsen.',
            ],
            monitoringDirectives: [
                'Perform Doppler ultrasound screening over precordial / subclavian vein.',
                'Document exact joint locations and pain progression scale (1-10) every 15 minutes.',
            ],
            flightSurgeonEscalationRecommended: true,
            nasaHrpReference: 'NASA HRP Decompression Sickness (DCS) Management Guidelines',
        };
    }

    // 3. SANS or Hypercapnic Headaches
    if (input.visualBlurriness || input.headacheSeverity === 'severe' || input.headacheSeverity === 'moderate') {
        return {
            triageLevel: 'contact_flight_surgeon',
            title: 'CLINICAL EVALUATION: Hypercapnia or SANS Fluid Shift Elevation',
            summary:
                'Visual blurriness combined with moderate-to-severe headache is a hallmark of stagnant carbon dioxide ($CO_2$) pocket exposure or acute optic nerve sheath swelling (SANS).',
            immediateInstructions: [
                'Move to a well-ventilated cabin area; verify personal air velocity > 0.15 m/s.',
                'Inspect ECLSS carbon dioxide scrubber beds for saturation.',
                'Apply temporary adjustable Space Flight reading lenses if near vision is degraded.',
                'Avoid inverted head postures or valsalva maneuvers.',
            ],
            monitoringDirectives: [
                'Perform optical near-point acuity grid test.',
                'Schedule Optical Coherence Tomography (OCT) scan with Medical Officer.',
                'Log ambient cabin CO₂ partial pressure hourly.',
            ],
            flightSurgeonEscalationRecommended: true,
            nasaHrpReference: 'NASA HRP Spaceflight-Associated Neuro-ocular Syndrome (SANS) Clinical Algorithm',
        };
    }

    // 4. Mild Fatigue or Muscle Soreness (Self-Care / Monitoring)
    if (input.fatigueExhaustion || input.jointOrMusclePain || input.headacheSeverity === 'mild') {
        return {
            triageLevel: 'self_care',
            title: 'SELF-CARE & CONTINUED MONITORING: Operational Microgravity Fatigue',
            summary:
                'Mild fatigue or transient post-exercise muscle soreness consistent with routine high-intensity countermeasure training and operational flight workload.',
            immediateInstructions: [
                'Maintain prescribed hydration: consume 500 mL water with electrolyte tablet.',
                'Perform 10 minutes of gentle spinal decompression stretching in neutral body posture.',
                'Adhere to scheduled 8-hour sleep period with sleep quarters lighting dimmed.',
            ],
            monitoringDirectives: [
                'Log morning sleep quality score and Samn-Perelli fatigue rating.',
                'If fatigue persists beyond 48 hours or heart rate variability drops by > 20%, escalate to Medical Officer.',
            ],
            flightSurgeonEscalationRecommended: false,
            nasaHrpReference: 'NASA HRP Fatigue Risk Management System (FRMS)',
        };
    }

    // Default Nominal State
    return {
        triageLevel: 'continue_monitoring',
        title: 'NOMINAL CREW HEALTH STATUS: Continue Standard Protocol',
        summary: 'No adverse physiological symptoms reported. All bodily systems functioning within authorized mission baselines.',
        immediateInstructions: [
            'Continue scheduled daily routine, meals, and countermeasure exercise sessions.',
        ],
        monitoringDirectives: [
            'Maintain continuous wearable sensor telemetry streaming.',
            'Submit evening health check-in log before sleep period.',
        ],
        flightSurgeonEscalationRecommended: false,
        nasaHrpReference: 'NASA-STD-3001 Routine Crew Health Maintenance',
    };
}

/**
 * "What Should I Do Now?" Step-by-Step Response Guide Generator
 */
export interface WhatShouldIDoNowGuide {
    alertId: string;
    metricName: string;
    whatHappened: string;
    whyItMatters: string;
    whatShouldBeChecked: string[];
    whatActionShouldBeTaken: string[];
    whenToContactFlightSurgeon: string;
}

export function generateWhatShouldIDoNowGuide(metricName: string, value: number | string, alertSeverity: string): WhatShouldIDoNowGuide {
    if (metricName.includes('heart') || metricName === 'heart_rate') {
        return {
            alertId: `GUIDE-HR-${Date.now().toString().slice(-4)}`,
            metricName: 'Resting Heart Rate Spike',
            whatHappened: `Astronaut heart rate recorded at ${value} BPM, exceeding the nominal resting baseline threshold.`,
            whyItMatters: 'Tachycardia during non-exercise intervals can indicate acute dehydration, autonomic stress, systemic infection, or subclinical cardiac arrhythmia in microgravity.',
            whatShouldBeChecked: [
                'Verify sensor contact: check that the chest strap / wearable PPG ring is securely positioned.',
                'Check core body temperature to rule out fever or heat storage.',
                'Review recent fluid intake: verify if daily 2.5 L hydration goal has been met.',
                'Check recent caffeine, pre-workout stimulant, or medication consumption.',
            ],
            whatActionShouldBeTaken: [
                'Rest in a neutral body posture for 10 minutes.',
                'Drink 350-500 mL of chilled electrolyte solution.',
                'Perform 5 minutes of guided 4-4-4-4 box breathing to stimulate parasympathetic vagal tone.',
            ],
            whenToContactFlightSurgeon:
                'Contact Flight Surgeon immediately if resting heart rate remains > 110 BPM for more than 30 minutes, or if accompanied by chest pressure, shortness of breath, or palpitations.',
        };
    }

    if (metricName.includes('co2') || metricName === 'cabin_co2') {
        return {
            alertId: `GUIDE-CO2-${Date.now().toString().slice(-4)}`,
            metricName: 'Cabin Ambient CO₂ Accumulation',
            whatHappened: `Ambient carbon dioxide reached ${value} mmHg, surpassing the 4.0 mmHg NASA STD-3001 operational safety threshold.`,
            whyItMatters: 'In microgravity, warm exhaled carbon dioxide does not rise; without forced convection it creates stagnant toxic bubbles causing headaches, vision blur, and cognitive lapses.',
            whatShouldBeChecked: [
                'Check local ventilation fan: ensure the personal bunk or workstation duct is unobstructed.',
                'Verify ECLSS telemetry: confirm that Carbon Dioxide Removal Assembly (CDRA) is actively cycling.',
                'Check if multiple crew members are gathered in an unventilated compartment.',
            ],
            whatActionShouldBeTaken: [
                'Move immediately to the central high-ventilation node or module.',
                'Switch secondary ECLSS lithium hydroxide air scrubber loop to High-Flow mode.',
                'Verify individual cabin velocity exceeds 0.15 m/s.',
            ],
            whenToContactFlightSurgeon:
                'Notify Flight Surgeon if ambient CO₂ remains > 4.5 mmHg for > 60 minutes, or if crew members report persistent throbbing frontal headaches or nausea.',
        };
    }

    if (metricName.includes('radiation') || metricName === 'radiation_exposure') {
        return {
            alertId: `GUIDE-RAD-${Date.now().toString().slice(-4)}`,
            metricName: 'Elevated Cosmic Radiation Dose Rate',
            whatHappened: `Active dosimeter registered radiation flux of ${value} mSv/day, exceeding the quiescent baseline limit.`,
            whyItMatters: 'Sudden radiation surges outside Earth’s magnetosphere typically signify a Solar Particle Event (SPE) which poses acute risks of radiation sickness and long-term DNA damage.',
            whatShouldBeChecked: [
                'Cross-check secondary active dosimeter in module 2 to rule out single-sensor radiation artifact.',
                'Inspect Space Weather Prediction Center (SWPC) solar proton flux telemetry.',
                'Verify orientation of spacecraft relative to solar coronal mass ejection trajectory.',
            ],
            whatActionShouldBeTaken: [
                'Sound internal habitat radiation advisory tone.',
                'Relocate crew into the aft storm shelter surrounded by water tanks and polyethylene shielding.',
                'Power down non-essential electronics sensitive to single-event upsets (SEUs).',
            ],
            whenToContactFlightSurgeon:
                'Emergency contact with Flight Surgeon and Radiation Health Officer is automatic via priority telemetry broadcast upon any radiation flux exceeding 1.5 mSv/day.',
        };
    }

    // Default Fallback Guide
    return {
        alertId: `GUIDE-GEN-${Date.now().toString().slice(-4)}`,
        metricName: metricName,
        whatHappened: `Metric ${metricName} recorded value ${value}, generating a ${alertSeverity} operational notice.`,
        whyItMatters: 'Deviations beyond 2.0 standard deviations from personal baseline require clinical validation to protect long-duration mission health.',
        whatShouldBeChecked: [
            'Confirm sensor placement, battery levels, and wireless signal integrity.',
            'Review recent flight logs for physical exercise or schedule shifts.',
        ],
        whatActionShouldBeTaken: [
            'Acknowledge alert in the AstroCare Alert Center.',
            'Re-measure parameter in 15 minutes to confirm trend direction.',
        ],
        whenToContactFlightSurgeon: 'Escalate to Ground Flight Surgeon if parameter does not return to nominal range within 2 hours.',
    };
}

