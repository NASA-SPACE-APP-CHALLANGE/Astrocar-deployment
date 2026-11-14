/**
 * AstroCare Official NASA Human Spaceflight Risk Modules
 * Implements 12 distinct human spaceflight biomedical risks
 * Formulated from official NASA Human Research Program (HRP) Risk Architecture
 * and Canadian Space Agency (CSA) spaceflight physiological studies.
 */

export interface NasaRiskModule {
    id: string;
    riskNumber: number;
    name: string;
    simpleEnglishExplanation: string;
    associatedHazard:
        | 'Space Radiation'
        | 'Isolation and Confinement'
        | 'Distance from Earth'
        | 'Gravity Fields'
        | 'Hostile/Closed Environments';
    contributingIndicators: string[];
    currentDataStatus: 'Nominal' | 'Monitoring Required' | 'Action Recommended';
    statusLevel: 'nominal' | 'warning' | 'critical';
    potentialEffects: string[];
    recommendedActions: {
        immediate: string;
        preventive: string;
        flightSurgeon: string;
    };
    supportingReferences: {
        title: string;
        source: string;
        url: string;
    }[];
}

export const NASA_RISK_MODULES: NasaRiskModule[] = [
    {
        id: 'rsk-cardiovascular',
        riskNumber: 1,
        name: 'Cardiovascular Adaptation & Orthostatic Intolerance',
        simpleEnglishExplanation:
            'In zero gravity, blood and fluids float upward from the legs to the chest and head. Because the heart does not have to fight gravity to pump blood upwards, the heart muscle can shrink slightly. When astronauts land on the Moon or return to Earth, blood rushes back to their legs, which can cause severe dizziness, low blood pressure, or fainting.',
        associatedHazard: 'Gravity Fields',
        contributingIndicators: ['Heart Rate (BPM)', 'Blood Pressure (mmHg)', 'Heart Rate Variability (RMSSD)', 'Estimated Stroke Volume'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Inability to remain standing upright upon landing without fainting (presyncope/syncope).',
            'Reduced cardiac stroke volume and modest left ventricular atrophy.',
            'Higher heart rate for the same amount of physical work.',
        ],
        recommendedActions: {
            immediate: 'Consume 1.0 L of isotonic electrolyte solution and don anti-gravity lower body compression suit.',
            preventive: 'Perform daily prescribed aerobic exercise on the cycle ergometer (CEVIS) at 75-85% max heart rate.',
            flightSurgeon: 'Order orthostatic challenge tilt test and review electrocardiographic rhythm strip.',
        },
        supportingReferences: [
            {
                title: 'Risk of Impaired Cardiovascular Capabilities and Orthostatic Intolerance',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-bone-muscle',
        riskNumber: 2,
        name: 'Bone Mineral Density Loss & Muscle Atrophy',
        simpleEnglishExplanation:
            'Without gravity pulling down on the body, bones and anti-gravity postural muscles are barely used. Bones dissolve calcium into the bloodstream at a rate of about 1% to 1.5% each month, making them weaker and increasing the danger of kidney stones. Muscles, particularly in the calves and thighs, can lose strength and mass rapidly if not exercised.',
        associatedHazard: 'Gravity Fields',
        contributingIndicators: ['Bone Resorption NTx Markers', 'Calf Circumference', 'ARED Axial Skeletal Load (N)', 'Urinary Calcium'],
        currentDataStatus: 'Monitoring Required',
        statusLevel: 'warning',
        potentialEffects: [
            'Increased risk of bone fracture during planetary surface operations.',
            'Formation of painful calcium oxalate kidney stones due to high calcium in urine.',
            'Loss of strength needed for heavy spacesuit operations and planetary rover egress.',
        ],
        recommendedActions: {
            immediate: 'Verify completion of today’s Advanced Resistive Exercise Device (ARED) heavy lifting set.',
            preventive: 'Enforce daily 2.5 hour resistance exercise and maintain minimum 2.5 L daily hydration buffer.',
            flightSurgeon: 'Review monthly DXA / QCT bone density scans and consider anti-resorptive bisphosphonate therapy.',
        },
        supportingReferences: [
            {
                title: 'Risk of Early Onset Osteoporosis and Muscle Loss Due to Spaceflight',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
            {
                title: 'Why Do We Conduct Science Experiments in Space?',
                source: 'Canadian Space Agency (CSA)',
                url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
            },
        ],
    },
    {
        id: 'rsk-physical-fitness',
        riskNumber: 3,
        name: 'Reduced Physical Fitness & Operational Capacity',
        simpleEnglishExplanation:
            'Prolonged spaceflight without adequate conditioning decreases aerobic capacity (VO₂ max). Astronauts tire out much faster during strenuous spacewalks (EVAs), exploration walks in heavy pressurized suits, or emergency egress situations.',
        associatedHazard: 'Gravity Fields',
        contributingIndicators: ['Daily Activity METs', 'Weekly Exercise Compliance (%)', 'Estimated VO₂ Max', 'Exercise Duration (min)'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Early operational exhaustion during 6-to-8-hour spacewalks.',
            'Difficulty climbing planetary ladders or carrying scientific sample containers.',
            'Longer recovery time between consecutive operational shifts.',
        ],
        recommendedActions: {
            immediate: 'Rest and rehydrate; adjust tomorrow’s physical workload schedule.',
            preventive: 'Maintain 6-day per week combined strength and high-intensity interval treadmill protocol.',
            flightSurgeon: 'Recalibrate monthly exercise target wattages and flight crew metabolic prescriptions.',
        },
        supportingReferences: [
            {
                title: 'Risk of Reduced Physical Capabilities and Operational Task Performance',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-immune',
        riskNumber: 4,
        name: 'Immune System Dysregulation & Viral Reactivation',
        simpleEnglishExplanation:
            'A combination of cosmic radiation, high stress, altered sleep, and microgravity can suppress the body’s immune system. White blood cells become less aggressive, skin rashes take longer to heal, and dormant viruses that most people carry without symptoms (like chickenpox/shingles or cold sores) can reactivate.',
        associatedHazard: 'Space Radiation',
        contributingIndicators: ['Cumulative Radiation Dose (mSv)', 'Salivary Cortisol', 'Viral Shedding PCR Screen', 'Neutrophil Count'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Reactivation of latent herpesviruses causing shingles or oral lesions.',
            'Higher susceptibility to common bacterial infections and slower wound healing.',
            'Elevated inflammatory cytokines and allergic hypersensitivity.',
        ],
        recommendedActions: {
            immediate: 'Apply barrier ointments to skin irritations; isolate crew member if fever develops.',
            preventive: 'Take daily Vitamin D3, polyphenol antioxidants, and maintain strict environmental sanitation.',
            flightSurgeon: 'Review immunological salivary biomarker panels and initiate targeted antiviral therapy if indicated.',
        },
        supportingReferences: [
            {
                title: 'Risk of Crew Adverse Health Event Due to Altered Immune Response',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
            {
                title: 'Monitoring Radiation for Astronaut Health',
                source: 'Canadian Space Agency (CSA)',
                url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
            },
        ],
    },
    {
        id: 'rsk-sans',
        riskNumber: 5,
        name: 'Vision & Brain Changes (SANS)',
        simpleEnglishExplanation:
            'Because fluids shift toward the head in microgravity, pressure builds up behind the eyes and in the skull. Over months, this pressure can flatten the back of the eyeball, swell the optic nerve (papilledema), and cause astronauts to experience blurry near-vision and hyperopic refractive shifts.',
        associatedHazard: 'Gravity Fields',
        contributingIndicators: ['Optic Nerve Sheath Diameter (mm)', 'Refractive Diopter Shift', 'Intraocular Pressure (mmHg)', 'Cabin CO₂ (mmHg)'],
        currentDataStatus: 'Monitoring Required',
        statusLevel: 'warning',
        potentialEffects: [
            'Progressive loss of near-vision clarity, requiring reading glasses or spaceflight lenses.',
            'Permanent flattening of the posterior eye globe and choroidal folds.',
            'Optic disc edema that may take months to resolve after returning to Earth.',
        ],
        recommendedActions: {
            immediate: 'Utilize adjustable Space Flight Glasses and avoid prolonged reading in low illumination.',
            preventive: 'Perform daily Lower Body Negative Pressure (LBNP) sessions to redistribute fluids away from head.',
            flightSurgeon: 'Review bi-weekly Optical Coherence Tomography (OCT) retinal nerve scans and visual field tests.',
        },
        supportingReferences: [
            {
                title: 'Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
            },
        ],
    },
    {
        id: 'rsk-sleep-circadian',
        riskNumber: 6,
        name: 'Sleep Disruption & Circadian Desynchronization',
        simpleEnglishExplanation:
            'Astronauts orbiting Earth experience 16 sunrises and sunsets every day. Combined with equipment noise, artificial lights, and living in tight spaces, this disrupts the brain’s internal 24-hour master clock. Chronic sleep loss leads to dangerous daytime fatigue, slower reflexes, and mood swings.',
        associatedHazard: 'Isolation and Confinement',
        contributingIndicators: ['Sleep Duration (hours)', 'Sleep Quality (%)', 'Samn-Perelli Fatigue Scale', 'Reaction Time Latency (ms)'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Lapses in attention and micro-sleeps during safety-critical piloting or robotics tasks.',
            'Increased irritability, interpersonal conflict, and emotional exhaustion.',
            'Weakened metabolic and immune health due to chronic sleep deficit.',
        ],
        recommendedActions: {
            immediate: 'Enforce immediate 30-minute power nap or adjust duty schedule if fatigue score exceeds Level 4.',
            preventive: 'Use blue-enriched light in morning and warm dim light 2 hours prior to scheduled sleep quarters.',
            flightSurgeon: 'Evaluate sleep actigraphy and prescribe short-acting melatonin receptor agonists if circadian rhythm slips.',
        },
        supportingReferences: [
            {
                title: 'Risk of Performance Decrements and Disorders Due to Sleep Loss and Circadian Desynchronization',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-nutrition',
        riskNumber: 7,
        name: 'Inadequate Nutrition & Microgravity Malabsorption',
        simpleEnglishExplanation:
            'Space food must be shelf-stable for years, which can degrade sensitive vitamins (like Vitamin C and B-complex). Microgravity can also alter how the stomach and intestines absorb nutrients. If astronauts do not eat enough calories to match their strenuous exercise routines, they lose weight and muscle mass rapidly.',
        associatedHazard: 'Hostile/Closed Environments',
        contributingIndicators: ['Daily Caloric Intake (kcal)', 'Body Mass (SLAMMD kg)', 'Protein Intake (g/day)', 'Hydration Volume (L)'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Unintended negative energy balance and accelerated muscle wasting.',
            'Subclinical vitamin deficiencies leading to impaired oxidative defense and anemia.',
            'Dehydration increasing blood viscosity and kidney stone likelihood.',
        ],
        recommendedActions: {
            immediate: 'Consume scheduled high-density nutritional snack pack and 500 mL electrolyte beverage.',
            preventive: 'Log daily food consumption via barcode scanner to ensure minimum 2,800 kcal target.',
            flightSurgeon: 'Review bi-monthly nutritional biochemistry profiles and adjust individualized dietary supplements.',
        },
        supportingReferences: [
            {
                title: 'Risk of Performance and Health Decrements Due to Inadequate Food and Nutrition',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-hypoxia-co2',
        riskNumber: 8,
        name: 'Cabin Hypercapnia & Hypoxia Exposure',
        simpleEnglishExplanation:
            'Without natural convection in weightlessness, warm carbon dioxide ($CO_2$) exhaled by astronauts forms stagnant invisible clouds around their heads if air fans fail. Even slightly elevated $CO_2$ levels in spacecraft cause throbbing headaches, dizziness, flushed skin, mental sluggishness, and irritability.',
        associatedHazard: 'Hostile/Closed Environments',
        contributingIndicators: ['Cabin CO₂ Partial Pressure (mmHg)', 'Cabin O₂ Percentage (%)', 'Arterial SpO₂ (%)', 'Respiration Rate'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Severe hypercapnic headaches and visual disturbances.',
            'Impaired executive decision-making during high-stress flight operations.',
            'Tissue hypoxia if cabin atmospheric pressure or oxygen partial pressure drops.',
        ],
        recommendedActions: {
            immediate: 'Verify personal air circulation fan is running; inspect ECLSS carbon dioxide scrubber beds.',
            preventive: 'Maintain habitat cabin CO₂ below 3.0 mmHg and ventilate sleeping bunks at > 0.15 m/s.',
            flightSurgeon: 'Check environmental telemetry logs and order blood gas / capnography analysis if headaches recur.',
        },
        supportingReferences: [
            {
                title: 'NASA Human System Standard STD-3001: Atmospheric Quality and CO₂ Limits',
                source: 'NASA Space Flight Human-System Standards',
                url: 'https://www.nasa.gov/hrp/hazards/',
            },
        ],
    },
    {
        id: 'rsk-decompression-eva',
        riskNumber: 9,
        name: 'Decompression Sickness (DCS) During Spacewalks',
        simpleEnglishExplanation:
            'Space suits operate at a much lower pressure (about 4.3 psi / 30 kPa) than the spacecraft cabin (14.7 psi / 101 kPa) so they are flexible enough to move in. If astronauts don their suits without breathing 100% pure oxygen first, nitrogen dissolved in their blood forms bubbles, causing excruciating joint pain, paralysis, or life-threatening embolisms.',
        associatedHazard: 'Hostile/Closed Environments',
        contributingIndicators: ['Suit Prebreathe Time (min)', 'Cabin Pressure (kPa)', 'Suit Pressure (kPa)', 'Venous Gas Emboli Screen'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Severe joint pain in shoulders, knees, and elbows ("the bends") during spacewalks.',
            'Neurological deficits, sensory numbness, or stroke-like symptoms from vascular gas bubbles.',
            'Immediate termination of mission-critical extravehicular operations.',
        ],
        recommendedActions: {
            immediate: 'If symptoms occur in suit: repressurize airlock immediately to habitat pressure (101.3 kPa).',
            preventive: 'Complete mandatory 100% oxygen prebreathe protocol with light exercise to wash out tissue nitrogen.',
            flightSurgeon: 'Monitor doppler ultrasound bubble detector readings and prepare hyperbaric treatment table if needed.',
        },
        supportingReferences: [
            {
                title: 'Risk of Decompression Sickness (DCS) in Extravehicular Activity',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-radiation-health',
        riskNumber: 10,
        name: 'Space Radiation Health & Solar Particle Events',
        simpleEnglishExplanation:
            'Outside Earth’s protective magnetic bubble, astronauts are constantly bombarded by Galactic Cosmic Rays (GCR) from exploding distant stars and sudden bursts of protons from Solar Particle Events (SPE). This ionizing radiation tears through human cells and DNA, increasing lifetime cancer risk, damaging the heart, and risking acute radiation sickness.',
        associatedHazard: 'Space Radiation',
        contributingIndicators: ['Daily Radiation Exposure (mSv/day)', 'Cumulative Dose (mSv)', 'Solar Flare / SPE Warning Level', 'White Blood Cell Count'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Acute Radiation Sickness (nausea, vomiting, bone marrow suppression) during solar flares.',
            'Significantly increased lifetime risk of fatal cancers and cardiovascular disease.',
            'Early-onset cataracts and accelerated degenerative tissue aging.',
        ],
        recommendedActions: {
            immediate: 'If SPE alarm sounds: retreat immediately into the water-shielded aft habitat storm shelter.',
            preventive: 'Wear active silicon dosimeters continuously and log cumulative exposures against career limits.',
            flightSurgeon: 'Analyze cytogenetic chromosomal translocation assays and track biological equivalent doses (Sv).',
        },
        supportingReferences: [
            {
                title: 'Risk of Radiation Carcinogenesis and Acute Radiation Syndromes',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
            {
                title: 'Monitoring Radiation for Astronaut Health',
                source: 'Canadian Space Agency (CSA)',
                url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
            },
        ],
    },
    {
        id: 'rsk-behavioral-isolation',
        riskNumber: 11,
        name: 'Behavioral Health, Confinement & Isolation Stress',
        simpleEnglishExplanation:
            'Living inside a metal habitat with the same few crewmates for hundreds of days, millions of miles away from family, friends, and Earth, causes significant psychological stress. Lack of privacy, high workloads, and isolation can lead to anxiety, depression, burnout, and friction between crew members.',
        associatedHazard: 'Isolation and Confinement',
        contributingIndicators: ['Self-Reported Mood Index', 'Autonomic Stress Index', 'Crew Interaction Log', 'Sleep Architecture Quality'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Decreased team cohesion, interpersonal conflicts, and communication breakdown.',
            'Depressive symptoms, anxiety, and diminished motivation for scientific goals.',
            'Risk of operational mission failure due to psychological breakdown.',
        ],
        recommendedActions: {
            immediate: 'Initiate 10-minute guided box breathing exercise; schedule private rest interval.',
            preventive: 'Hold weekly crew group dinners, private psychological video check-ins, and family email exchanges.',
            flightSurgeon: 'Conduct confidential bi-weekly psychiatric telemedicine evaluations with flight psychology team.',
        },
        supportingReferences: [
            {
                title: 'Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
    {
        id: 'rsk-vestibular-sensorimotor',
        riskNumber: 12,
        name: 'Sensorimotor & Vestibular Dysfunction (Space Motion Sickness)',
        simpleEnglishExplanation:
            'In weightlessness, the inner ear’s balance sensors (otoliths) no longer detect gravity pulling down, while the eyes tell the brain the body is floating. This sensory mismatch confuses the brain, causing Space Motion Sickness (nausea, cold sweats, disorientation). The same confusion happens in reverse when landing on the Moon or Mars.',
        associatedHazard: 'Gravity Fields',
        contributingIndicators: ['Vestibular Disorientation Score', 'Gaze Tracking Stability', 'Postural Dynamic Stability', 'Autonomic Symptoms'],
        currentDataStatus: 'Nominal',
        statusLevel: 'nominal',
        potentialEffects: [
            'Nausea and vomiting during first 48 hours of transit (fatal danger inside a spacesuit helmet).',
            'Postural instability, loss of balance, and difficulty walking upon landing on a planetary surface.',
            'Spatial disorientation when manual piloting or docking spacecraft.',
        ],
        recommendedActions: {
            immediate: 'Minimize rapid head movements; rest with head restrained against headrest; avoid early EVA spacewalks.',
            preventive: 'Pre-flight sensorimotor balance training and gradual adaptation protocols.',
            flightSurgeon: 'Administer antiemetic medication (promethazine) if severe nausea prevents hydration.',
        },
        supportingReferences: [
            {
                title: 'Risk of Sensory-Motor Performance Alterations and Space Motion Sickness',
                source: 'NASA Human Research Program (HRP)',
                url: 'https://www.nasa.gov/hrp/risks/',
            },
        ],
    },
];

export function getNasaRiskById(id: string): NasaRiskModule | undefined {
    return NASA_RISK_MODULES.find(r => r.id === id);
}

