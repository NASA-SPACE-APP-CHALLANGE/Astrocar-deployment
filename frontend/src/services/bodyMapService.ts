/**
 * AstroCare Interactive Human Body Map Service
 * Defines 8 key anatomical systems vulnerable to spaceflight hazards
 * Mapped to NASA Human Research Program (HRP) physiological risk areas.
 */

export interface BodySystemData {
    id: string;
    name: string;
    subtitle: string;
    svgCoords: { x: number; y: number; radius: number };
    status: 'green' | 'amber' | 'red';
    statusLabel: string;
    primaryFunction: string;
    spaceflightHazards: string[];
    associatedRisks: string[];
    relevantIndicators: { name: string; value: string; status: 'nominal' | 'warning' | 'critical' }[];
    detectedAbnormalities: string[];
    availableCountermeasures: string[];
    nasaReferences: { title: string; url: string; program: string }[];
}

export const BODY_SYSTEMS: BodySystemData[] = [
    {
        id: 'brain',
        name: 'Brain & Central Nervous System',
        subtitle: 'Neurocognition, Circadian Timing, Intracranial Fluid Shift',
        svgCoords: { x: 200, y: 55, radius: 22 },
        status: 'green',
        statusLabel: 'Nominal Cognitive Reserve',
        primaryFunction: 'Executive cognitive functioning, fine motor sensorimotor coordination, autonomic regulation, sleep staging, and circadian rhythm entrainment.',
        spaceflightHazards: [
            'Isolation and Confinement',
            'Gravity Fields (Cephalad fluid redistribution)',
            'Space Radiation (GCR neuro-inflammation)',
        ],
        associatedRisks: [
            'Spaceflight-Associated Neuro-ocular Syndrome (SANS) intracranial hypertension component',
            'Circadian misalignment, insomnia, and neurobehavioral fatigue',
            'Cosmic radiation-induced cognitive decline and synaptic plasticity changes',
        ],
        relevantIndicators: [
            { name: 'Sleep Quality Index', value: '86% (1.8h Deep Sleep)', status: 'nominal' },
            { name: 'Samn-Perelli Fatigue Scale', value: 'Level 2 (Fully Alert)', status: 'nominal' },
            { name: 'Cognitive Reaction Latency', value: '232 ms (±8 ms)', status: 'nominal' },
            { name: 'HRV RMSSD (Vagal Tone)', value: '48.2 ms', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'No intracranial hyper-perfusion spikes detected.',
            'Circadian core body temperature rhythm remains within synchronized 24.2h cycle.',
        ],
        availableCountermeasures: [
            'Dynamic blue-enriched spectrum LED lighting morning scheduling (460 nm).',
            'Strict 8-hour sleep hygiene protocol and white-noise acoustic isolation quarters.',
            'Computerized neurocognitive assessment battery (WinSCAT / Cognition tests).',
        ],
        nasaReferences: [
            {
                title: 'NASA HRP Behavioral Health & Performance Research',
                url: 'https://www.nasa.gov/hrp/hazards/',
                program: 'NASA Human Research Program (HRP)',
            },
            {
                title: 'Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders',
                url: 'https://www.nasa.gov/hrp/risks/',
                program: 'NASA HRP Risk Architecture',
            },
        ],
    },
    {
        id: 'eyes',
        name: 'Visual System & Ophthalmic Microvasculature',
        subtitle: 'SANS, Globe Flattening, Retinal Nerve Fiber Layer',
        svgCoords: { x: 200, y: 78, radius: 14 },
        status: 'amber',
        statusLabel: 'SANS Stage-1 Surveillance Active',
        primaryFunction: 'Visual acuity, stereopsis, retinal perfusion, and maintenance of intraocular vs. translaminar cribrosa pressure balance.',
        spaceflightHazards: [
            'Gravity Fields (Microgravity cephalad venous stasis)',
            'Hostile/Closed Environments (Elevated ambient CO₂)',
        ],
        associatedRisks: [
            'Spaceflight-Associated Neuro-ocular Syndrome (SANS): optic disc edema, globe flattening, choroidal folds, and hyperopic refractive shift',
            'Elevated venous pressure in optic nerve sheath',
        ],
        relevantIndicators: [
            { name: 'Optic Nerve Sheath Diameter', value: '5.4 mm (Baseline 5.1 mm)', status: 'warning' },
            { name: 'Hyperopic Refractive Shift', value: '+0.50 Diopters', status: 'warning' },
            { name: 'Intraocular Pressure (IOP)', value: '16.5 mmHg', status: 'nominal' },
            { name: 'Ambient Cabin CO₂', value: '3.1 mmHg', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'Mild bilateral optic nerve sheath expansion (+0.3 mm) consistent with microgravity fluid redistribution.',
            'Near-point vision degradation stabilized with adjustable focus spaceflight glasses.',
        ],
        availableCountermeasures: [
            'Lower Body Negative Pressure (LBNP) daily 30-minute sessions to draw fluid caudal away from optic sheath.',
            'Maintain ambient habitat CO₂ below 3.0 mmHg via optimized ECLSS scrubber loop.',
            'High-resolution Optical Coherence Tomography (OCT) scanning every 30 flight days.',
        ],
        nasaReferences: [
            {
                title: 'NASA HRP Spaceflight-Associated Neuro-ocular Syndrome (SANS) Research',
                url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
                program: 'NASA Human Research Program (HRP)',
            },
        ],
    },
    {
        id: 'heart',
        name: 'Cardiovascular & Hemodynamic System',
        subtitle: 'Cardiac Atrophy, Fluid Shift, Orthostatic Regulation',
        svgCoords: { x: 208, y: 155, radius: 18 },
        status: 'green',
        statusLabel: 'Cardiovascular Dynamics Nominal',
        primaryFunction: 'Systemic oxygen transport, stroke volume generation, arterial baroreceptor reflex regulation, and cerebral perfusion pressure maintenance.',
        spaceflightHazards: [
            'Gravity Fields (Loss of hydrostatic blood column)',
            'Space Radiation (Microvascular endothelial oxidative damage)',
        ],
        associatedRisks: [
            'Cardiovascular deconditioning and left ventricular myocardial mass reduction',
            'Severe post-flight / planetary landing orthostatic intolerance and syncope',
            'Subclinical cardiac arrhythmias induced by electrolyte shifts and autonomic remodelling',
        ],
        relevantIndicators: [
            { name: 'Resting Heart Rate', value: '64 BPM', status: 'nominal' },
            { name: 'Blood Pressure', value: '118/76 mmHg', status: 'nominal' },
            { name: 'Estimated Stroke Volume', value: '72 mL/beat', status: 'nominal' },
            { name: 'Pulse Wave Velocity', value: '6.8 m/s', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'No symptomatic arrhythmias or ectopic ventricular beats recorded in last 72 hours.',
            'Baroreflex sensitivity stable during morning posture simulation testing.',
        ],
        availableCountermeasures: [
            'Daily CEVIS cycle ergometer high-intensity interval training (HIIT).',
            'Saline fluid loading protocol (1.0 L isotonic electrolyte beverage) prior to planetary re-entry.',
            'Graduated elastic compression gradient flight suit (30-40 mmHg counterpressure).',
        ],
        nasaReferences: [
            {
                title: 'Risk of Impaired Cardiovascular and Orthostatic Tolerance',
                url: 'https://www.nasa.gov/hrp/risks/',
                program: 'NASA HRP Cardiovascular Discipline',
            },
        ],
    },
    {
        id: 'lungs',
        name: 'Pulmonary & Respiratory System',
        subtitle: 'Ventilation-Perfusion Matching, Cabin Gas Exchange',
        svgCoords: { x: 192, y: 145, radius: 18 },
        status: 'green',
        statusLabel: 'Pulmonary Gas Exchange Nominal',
        primaryFunction: 'Alveolar-capillary gas exchange, blood oxygenation, carbon dioxide expiration, and acid-base systemic pH homeostasis.',
        spaceflightHazards: [
            'Hostile/Closed Environments (ECLSS gas concentrations, regolith dust)',
            'Distance from Earth (Autonomous hyperbaric / hypobaric management)',
        ],
        associatedRisks: [
            'Hypercapnic space toxicosis due to stagnant expired CO₂ pockets in microgravity',
            'Acute hypoxic hypoxia during EVA suit depressurization',
            'Lunar regolith toxic inhalation and chemical pneumonitis',
        ],
        relevantIndicators: [
            { name: 'Arterial SpO₂', value: '98.4%', status: 'nominal' },
            { name: 'Respiration Rate', value: '14.5 breaths/min', status: 'nominal' },
            { name: 'Cabin O₂ Partial Pressure', value: '20.9% (21.2 kPa)', status: 'nominal' },
            { name: 'Cabin CO₂ Concentration', value: '3.1 mmHg', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'Zero desaturation dips during active sleep or strenuous physical exercise.',
            'Particulate optical counters report HEPA air cleanliness at Class 100 level.',
        ],
        availableCountermeasures: [
            'Cabin active ventilation fans maintaining minimum 0.15 m/s local velocity to prevent CO₂ pooling.',
            '100% O₂ prebreathe protocol prior to Extravehicular Activity (EVA) spacewalks.',
            'ECLSS molecular sieve lithium hydroxide scrubber regeneration.',
        ],
        nasaReferences: [
            {
                title: 'NASA HRP Environmental Health & Toxicological Exposure Limits',
                url: 'https://www.nasa.gov/hrp/hazards/',
                program: 'NASA Human Research Program (HRP)',
            },
        ],
    },
    {
        id: 'bones',
        name: 'Skeletal Framework & Spinal Column',
        subtitle: 'Bone Mineral Density, Osteoclast Activation, Spinal Elongation',
        svgCoords: { x: 200, y: 220, radius: 24 },
        status: 'amber',
        statusLabel: 'Bone Remodeling Surveillance',
        primaryFunction: 'Mechanical support, calcium/phosphate storage, bone marrow hematopoiesis, and spinal column neurovascular protection.',
        spaceflightHazards: [
            'Gravity Fields (Elimination of mechanical ground reaction forces)',
            'Space Radiation (Marrow stem cell DNA alterations)',
        ],
        associatedRisks: [
            'Accelerated trabecular and cortical bone mineral density loss (~1.0% to 1.5% per month)',
            'Microgravity spinal elongation (up to 5-7 cm) and intervertebral disc herniation',
            'Hypercalciuria and increased risk of calcium oxalate nephrolithiasis (renal stones)',
        ],
        relevantIndicators: [
            { name: 'Bone Resorption Marker (NTx)', value: '+14% above pre-flight baseline', status: 'warning' },
            { name: 'Spinal Elongation', value: '+3.4 cm', status: 'nominal' },
            { name: 'Urinary Calcium Concentration', value: 'Nominal with hydration buffer', status: 'nominal' },
            { name: 'ARED Axial Skeletal Load', value: '2,100 N completed daily', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'Expected microgravity bone turnover shift observed; well within countermeasure protection buffer.',
            'Zero reported lower-back mechanical impingement or radiculopathy.',
        ],
        availableCountermeasures: [
            'Advanced Resistive Exercise Device (ARED) heavy deadlifts, squats, and heel raises.',
            'Pharmacological bisphosphonate or RANK-ligand inhibitor protocols where indicated.',
            'High-fluid hydration protocol (>2.5 L/day) plus potassium citrate to prevent kidney stone formation.',
        ],
        nasaReferences: [
            {
                title: 'Risk of Early Onset Osteoporosis Due to Spaceflight',
                url: 'https://www.nasa.gov/hrp/risks/',
                program: 'NASA HRP Bone & Mineral Discipline',
            },
            {
                title: 'Canadian Space Agency MARROW Study: Bone Marrow Health in Space',
                url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
                program: 'CSA Space Life Sciences',
            },
        ],
    },
    {
        id: 'muscles',
        name: 'Skeletal Musculature & Postural Fibers',
        subtitle: 'Soleus, Gastrocnemius, Myofibrillar Protein Synthesis',
        svgCoords: { x: 175, y: 295, radius: 20 },
        status: 'green',
        statusLabel: 'Muscle Tone Protected (96% Compliance)',
        primaryFunction: 'Locomotion, upright posture maintenance against gravity, metabolic glucose clearance, and joint stabilization.',
        spaceflightHazards: [
            'Gravity Fields (Lack of gravitational mechanical load)',
        ],
        associatedRisks: [
            'Disuse skeletal muscle atrophy, particularly in slow-twitch anti-gravity soleus and quadriceps',
            'Shift from oxidative Type I muscle fibers to glycolytic Type II fibers',
            'Reduced peak neuromuscular power and exercise endurance upon planetary landing',
        ],
        relevantIndicators: [
            { name: 'ARED Strength Session Compliance', value: '96.5% this week', status: 'nominal' },
            { name: 'Calf Muscle Circumference', value: '-2.1% (within nominal buffer)', status: 'nominal' },
            { name: 'Daily Protein Consumption', value: '115 g/day (1.5 g/kg)', status: 'nominal' },
            { name: 'Post-Workout L-Lactate Recovery', value: 'Nominal 18 min baseline return', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'Muscle mass well maintained across 142 flight days with zero functional motor weakness.',
        ],
        availableCountermeasures: [
            'Daily scheduled 2.5 hour physical exercise split (resistive ARED loading + T2 treadmill).',
            'Branched-chain amino acid (BCAA) and leucine-enriched dietary protein supplementation.',
            'Neuromuscular electrical stimulation (NMES) protocols for supplementary motor unit firing.',
        ],
        nasaReferences: [
            {
                title: 'Risk of Impaired Performance Due to Muscle Mass and Strength Reductions',
                url: 'https://www.nasa.gov/hrp/risks/',
                program: 'NASA HRP Muscle Discipline',
            },
        ],
    },
    {
        id: 'immune',
        name: 'Immune System & Lymphoid Organs',
        subtitle: 'T-Cell Activation, Cytokine Balance, Latent Virus Reactivation',
        svgCoords: { x: 200, y: 185, radius: 16 },
        status: 'green',
        statusLabel: 'Immune Surveillance Active',
        primaryFunction: 'Host pathogen defense, viral latency suppression, surveillance of damaged cells, and tissue wound repair.',
        spaceflightHazards: [
            'Space Radiation (Cellular genetic damage and bone marrow progenitor suppression)',
            'Isolation and Confinement (Chronic cortisol elevation)',
            'Hostile/Closed Environments (Microbial biofilm shifts)',
        ],
        associatedRisks: [
            'Immune system dysregulation, reduced cytotoxic T-cell activity, and altered cytokine expression',
            'Reactivation of latent herpesviruses (Epstein-Barr, VZV, CMV) during mission stress',
            'Allergic sensitization and delayed dermal wound healing',
        ],
        relevantIndicators: [
            { name: 'Active Daily Radiation Flux', value: '0.42 mSv/day', status: 'nominal' },
            { name: 'Salivary Cortisol Level', value: 'Nominal circadian diurnal curve', status: 'nominal' },
            { name: 'Viral Shedding PCR Screen', value: 'Negative for VZV/EBV', status: 'nominal' },
            { name: 'Absolute Neutrophil Count (ANC)', value: '3,800 /μL', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'No opportunistic infections, systemic rashes, or delayed skin healing reported.',
        ],
        availableCountermeasures: [
            'Radiation storm shelter protocols during solar particle events to minimize bone marrow dose.',
            'Dietary polyphenol, vitamin D3, and micronutrient antioxidant supplementation.',
            'Habitat microbial air and surface monitoring (Active PCR swabs).',
        ],
        nasaReferences: [
            {
                title: 'Risk of Crew Adverse Health Event Due to Altered Immune Response',
                url: 'https://www.nasa.gov/hrp/risks/',
                program: 'NASA HRP Immunology Discipline',
            },
            {
                title: 'Monitoring Radiation for Astronaut Health',
                url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
                program: 'Canadian Space Agency (CSA)',
            },
        ],
    },
    {
        id: 'digestive',
        name: 'Gastrointestinal & Digestive System',
        subtitle: 'Microbiome Integrity, Nutrient Absorption, Motility',
        svgCoords: { x: 200, y: 245, radius: 18 },
        status: 'green',
        statusLabel: 'Gastrointestinal Homeostasis Nominal',
        primaryFunction: 'Nutrient absorption, energy balance, gut microbiome diversity, drug bioavailability, and gastrointestinal motility.',
        spaceflightHazards: [
            'Gravity Fields (Space Motion Sickness, delayed gastric emptying)',
            'Hostile/Closed Environments (Preserved shelf-stable diet, radiation)',
        ],
        associatedRisks: [
            'Space Motion Sickness (SMS) during initial 48-72 hour neuro-vestibular adaptation',
            'Shift in gut microbiome composition toward inflammatory proteobacteria',
            'Suboptimal nutritional absorption and altered pharmaceutical pharmacokinetics',
        ],
        relevantIndicators: [
            { name: 'Daily Caloric Absorption', value: '2,850 kcal/day', status: 'nominal' },
            { name: 'Fluid Hydration Intake', value: '2.7 L/day', status: 'nominal' },
            { name: 'Space Motion Sickness Score', value: 'Resolved (Day 142)', status: 'nominal' },
            { name: 'Bowel Motility Regularity', value: 'Nominal 24h cycle', status: 'nominal' },
        ],
        detectedAbnormalities: [
            'Initial space adaptation syndrome completely resolved post-flight day 3.',
            'Daily caloric intake successfully matches target metabolic expenditure.',
        ],
        availableCountermeasures: [
            'Promethazine / scopolamine oral prophylaxis only during initial 48h transit if needed.',
            'Prebiotic fiber and probiotic fermented food packs to maintain gut microbiome diversity.',
            'Individualized meal caloric tracking and electrolyte monitoring.',
        ],
        nasaReferences: [
            {
                title: 'NASA HRP Space Nutrition & Food Systems',
                url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
                program: 'NASA Human Research Program (HRP)',
            },
        ],
    },
];

export function getBodySystemById(id: string): BodySystemData | undefined {
    return BODY_SYSTEMS.find(s => s.id === id);
}

export function getBodySystemsForAstronaut(astronautId: string = 'ASTRO-01'): BodySystemData[] {
    const systems: BodySystemData[] = JSON.parse(JSON.stringify(BODY_SYSTEMS));

    if (astronautId === 'ASTRO-01') {
        // CDR Alex Vance: Long-duration SANS monitoring
        const eyes = systems.find(s => s.id === 'eyes');
        if (eyes) {
            eyes.status = 'amber';
            eyes.statusLabel = 'SANS Grade 1 Edema Surveillance';
            eyes.detectedAbnormalities = [
                'Mild optic disc elevation (Grade 1 Frisén) detected on ultrasound.',
                'Pre-EVA choroidal engorgement consistent with microgravity cephalad fluid shift.',
            ];
            eyes.relevantIndicators[0] = { name: 'Optic Nerve Sheath Diam.', value: '6.2 mm (+18%)', status: 'warning' };
        }
    } else if (astronautId === 'ASTRO-02') {
        // Dr. Sarah Chen: Chief Medical Officer, Bone Density Check
        const bones = systems.find(s => s.id === 'bones');
        if (bones) {
            bones.status = 'amber';
            bones.statusLabel = 'Trabecular Demineralization Risk';
            bones.detectedAbnormalities = [
                'Urinary deoxypyridinoline +12% above pre-flight baseline.',
                'High-load heel drop protocol recommended.',
            ];
            bones.relevantIndicators[0] = { name: 'Trochanter Bone Mineral Loss', value: '-0.9%/mo', status: 'warning' };
        }
        const heart = systems.find(s => s.id === 'heart');
        if (heart) {
            heart.statusLabel = 'Athletic Sinus Rhythm (58 BPM)';
            heart.relevantIndicators[0] = { name: 'Resting Heart Rate', value: '58.0 bpm', status: 'nominal' };
        }
    } else if (astronautId === 'ASTRO-03') {
        // Marcus Thorne: Sympathetic Excursion & Muscular Fatigue
        const heart = systems.find(s => s.id === 'heart');
        if (heart) {
            heart.status = 'amber';
            heart.statusLabel = 'Elevated Sympathetic Tone (Post-EVA Spike)';
            heart.detectedAbnormalities = [
                'Transient sinus tachycardia (116 bpm) recorded during high-torque robotic arm maintenance.',
                'HRV RMSSD decreased to 32 ms indicating transient autonomic stress.',
            ];
            heart.relevantIndicators[0] = { name: 'Resting Heart Rate', value: '68.4 bpm', status: 'warning' };
        }
        const muscles = systems.find(s => s.id === 'muscles');
        if (muscles) {
            muscles.status = 'amber';
            muscles.statusLabel = 'Quadriceps Fatigue Index Margin';
            muscles.detectedAbnormalities = [
                'Post-maintenance knee extensor torque output down 6.5%.',
                'Recommended: 15-min active recovery cycling + high-protein replenishment.',
            ];
        }
    } else if (astronautId === 'ASTRO-04') {
        // Elena Rostova: Circadian Delay & Mild Immune Reactivation
        const brain = systems.find(s => s.id === 'brain');
        if (brain) {
            brain.status = 'amber';
            brain.statusLabel = 'Circadian Phase Delay';
            brain.detectedAbnormalities = [
                'Sleep onset latency delayed 48 minutes.',
                'REM sleep fraction decreased by 14% on flight days 138-142.',
            ];
            brain.relevantIndicators[0] = { name: 'Sleep Quality Index', value: '72% (Low REM)', status: 'warning' };
        }
        const immune = systems.find(s => s.id === 'immune');
        if (immune) {
            immune.status = 'amber';
            immune.statusLabel = 'EBV Reactivation Surveillance';
            immune.detectedAbnormalities = [
                'Salivary cortisol slightly elevated; subclinical EBV DNA shed detected on PCR swab.',
            ];
        }
    }

    return systems;
}


