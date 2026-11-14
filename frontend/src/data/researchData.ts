// NASA Human Research Program (HRP) & Canadian Space Agency (CSA) Scientific Research Data
// Verified and aligned with official space agency publications

export interface SpaceHazard {
    id: string;
    hazardNumber: number;
    title: string;
    subtitle: string;
    acronym: string;
    simpleExplanation: string;
    whyAstronautsExposed: string;
    bodyAndMindEffects: {
        physical: string[];
        psychological: string[];
    };
    longTermConsequences: string[];
    protectionStrategies: {
        current: string[];
        emerging: string[];
    };
    iconName: string;
    color: string;
    officialUrl: string;
}

export interface HealthRisk {
    id: string;
    category: string;
    riskTitle: string;
    whatHappens: string;
    whyItHappens: string;
    howItAffectsAstronauts: string;
    possibleConsequences: string[];
    monitoringAndMitigation: {
        monitoring: string[];
        mitigation: string[];
    };
    scientificStatus: 'Established Finding' | 'Active Ongoing Research';
    statusNotes: string;
    relatedOrgans: string[];
    iconName: string;
    color: string;
    officialUrl: string;
}

export interface HRPStudy {
    id: string;
    title: string;
    element: 'Human Factors & Behavioral' | 'Human Health Countermeasures' | 'Exploration Medical Capability' | 'Space Radiation' | 'Research Operations';
    elementFullName: string;
    objective: string;
    scientificSignificance: string;
    currentStatus: 'Active on ISS' | 'Longitudinal Post-Flight Analysis' | 'Baseline Data Collection' | 'Completed Landmark Study';
    statusVerificationDate: string;
    astronautImpact: string;
    futureMissionRelevance: string; // Moon (Artemis) & Mars
    officialUrl: string;
    keyFindings: string[];
}

export interface CSAResourceData {
    resourceId: string;
    title: string;
    agency: 'Canadian Space Agency (CSA)';
    officialUrl: string;
    publicationDate: string;
    summary: string;
    coreSections: {
        title: string;
        content: string;
        points?: string[];
        callout?: string;
    }[];
    technologiesOrProjects?: {
        name: string;
        description: string;
        application: string;
    }[];
    earthAndSpaceBenefits?: {
        inSpace: string;
        onEarth: string;
    }[];
}

export interface OfficialResourceItem {
    id: string;
    organization: 'NASA' | 'CSA';
    organizationFullName: string;
    resourceTitle: string;
    shortDescription: string;
    officialUrl: string;
    category: 'Hazards' | 'Risks' | 'Ongoing Research' | 'Radiation Science' | 'Space Experiments';
    verifiedDate: string;
}

// -------------------------------------------------------------
// 1. FIVE HAZARDS OF HUMAN SPACEFLIGHT (NASA HRP)
// -------------------------------------------------------------
export const NASA_FIVE_HAZARDS: SpaceHazard[] = [
    {
        id: 'space-radiation',
        hazardNumber: 1,
        title: 'Space Radiation',
        subtitle: 'High-energy cosmic particles and solar radiation beyond Earth’s magnetic shield',
        acronym: 'R',
        simpleExplanation: 'Space radiation is an invisible flow of high-speed, high-energy atomic nuclei and protons traveling through space. On Earth, our atmosphere and magnetic field act as a giant protective blanket, blocking most of this radiation. In deep space, astronauts lose this shield and are exposed to intense radiation that passes through spacecraft hulls and human tissue.',
        whyAstronautsExposed: 'Astronauts travel beyond the thick protective atmosphere and, during lunar or Mars journeys, completely outside Earth’s magnetosphere (Van Allen radiation belts). Galactic Cosmic Rays (GCRs) from outside our solar system and Solar Particle Events (SPEs) during solar flares release energetic protons and heavy ions that penetrate standard spacecraft structures.',
        bodyAndMindEffects: {
            physical: [
                'Deep DNA double-strand breaks and chromosomal rearrangements in bone marrow and organ tissue',
                'Accelerated endothelial damage in blood vessels, increasing cardiovascular risk',
                'Damage to ocular lens fibers leading to premature cataract formation',
                'Risk of acute radiation sickness (nausea, fatigue, white blood cell depletion) during sudden intense solar storms',
            ],
            psychological: [
                'Microlesions and neuro-inflammation in brain hippocampal areas linked to memory and emotional control',
                'Potential subtle changes in mood regulation, sensory processing, and sustained executive alertness',
                'Psychological stress from the constant awareness of an invisible, silent environmental threat',
            ],
        },
        longTermConsequences: [
            'Elevated lifetime excess risk of cancer mortality (REICM), particularly leukemia and solid tumors',
            'Premature cardiovascular and coronary heart disease',
            'Degenerative tissue changes and accelerated biological aging',
            'Potential long-term neurocognitive decrements and cognitive decline',
        ],
        protectionStrategies: {
            current: [
                'Spacecraft orientation strategies and internal storm shelters using water, food, and hydrogen-dense polyethylene',
                'Continuous real-time dosimetry (RAMS, EVARM, active silicon sensors) and operational alarm triggers',
                'Limiting extravehicular activities (EVAs/spacewalks) during periods of high solar activity',
            ],
            emerging: [
                'Advanced active electromagnetic and electrostatic radiation deflection shields',
                'Pharmaceutical radioprotectants and antioxidants that neutralize free radicals and promote DNA repair',
                'Personalized biological dosimetry tracking individual DNA repair capability',
            ],
        },
        iconName: 'Radiation',
        color: '#FF647C',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
    },
    {
        id: 'isolation-and-confinement',
        hazardNumber: 2,
        title: 'Isolation and Confinement',
        subtitle: 'Prolonged living in tight quarters with a small group far from family and society',
        acronym: 'I',
        simpleExplanation: 'Living in a confined spacecraft with a handful of crewmates for months or years—with no fresh air, no natural sunlight, and no ability to walk outside or see loved ones—creates psychological strain. Small irritations can grow, sleep cycles can get thrown off, and keeping morale high requires continuous care.',
        whyAstronautsExposed: 'Spacecraft and extraterrestrial habitats must be compact and airtight to conserve mass, energy, and life support consumables. Crews are physically isolated from society, natural terrestrial outdoor environments, and real-time family contact over prolonged mission durations.',
        bodyAndMindEffects: {
            physical: [
                'Disruption of circadian rhythms due to artificial lighting and lack of natural day-night sunlight cycles',
                'Decreased sleep quality and duration, averaging under 6 hours per night on orbit',
                'Elevated cortisol and stress hormone levels impacting immune and digestive functions',
            ],
            psychological: [
                'Interpersonal friction, irritability, and social withdrawal among crew members over time',
                'Vulnerability to the "third-quarter phenomenon"—a psychological dip in mood midway through a mission',
                'Cognitive fatigue and reduced vigilance during critical, high-focus mission tasks',
            ],
        },
        longTermConsequences: [
            'Chronic cumulative sleep debt exacerbating metabolic and psychological distress',
            'Risk of clinical depression, generalized anxiety, or severe burnout if unmitigated',
            'Potential breakdown in communication between the flight crew and ground control teams',
        ],
        protectionStrategies: {
            current: [
                'Dynamic solid-state LED habitat lighting mimicking natural 24-hour sunrise-to-sunset circadian spectrums',
                'Private psychological conferences (PPCs) between astronauts and flight surgeons/psychologists every 2 weeks',
                'Care packages, recorded video messages, and curated recreational media from home',
                'Strict sleep hygiene protocols and crew behavioral compatibility training pre-flight',
            ],
            emerging: [
                'Immersive Virtual Reality (VR) nature environments to provide psychological escape and relaxation',
                'AI-assisted unobtrusive acoustic voice and facial expression sentiment monitoring to detect early stress',
                'Autonomous psychological support software for deep space when two-way communication delays prevent real-time therapy',
            ],
        },
        iconName: 'Users',
        color: '#9275FF',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
    },
    {
        id: 'distance-from-earth',
        hazardNumber: 3,
        title: 'Distance from Earth',
        subtitle: 'Extending hundreds of thousands to millions of miles with no rapid return or resupply',
        acronym: 'D',
        simpleExplanation: 'The International Space Station orbits just 250 miles above Earth, allowing emergency return in hours and instant phone calls. But a mission to Mars will take astronauts up to 250 million miles away. At that distance, radio signals take up to 22 minutes each way, quick evacuation is impossible, and everything the crew needs must be on board.',
        whyAstronautsExposed: 'Exploration missions to the Moon under Artemis and onwards to Mars require journeys of unprecedented scale. Once a spacecraft leaves low-Earth orbit, celestial mechanics and orbital trajectories make turning back immediately or receiving emergency supply capsules physically impossible.',
        bodyAndMindEffects: {
            physical: [
                'Total dependence on finite on-board medical kits and autonomous emergency clinical capabilities',
                'Exposure to pharmaceuticals that may degrade in efficacy due to space radiation over multi-year journeys',
                'Strict rationing and recycling of water, oxygen, and metabolic nutrients without resupply',
            ],
            psychological: [
                'The "Earth-out-of-view" phenomenon: profound psychological isolation as Earth becomes a faint point of light',
                'Heightened anxiety stemming from the awareness that ground mission control cannot intervene in real-time crises',
                'Need for complete operational independence and high-stakes autonomous decision-making',
            ],
        },
        longTermConsequences: [
            'If a catastrophic medical emergency occurs (appendicitis, trauma), crew must treat it entirely autonomously',
            'Chronic psychological stress from prolonged, inescapable separation from the home planet',
            'Risk of life-support system wear-and-tear or consumable depletion without spare part replenishment',
        ],
        protectionStrategies: {
            current: [
                'Thorough cross-training of designated crew medical officers (CMOs) in emergency surgery and critical care',
                'Redundant environmental control and life support systems (ECLSS) with high recycling efficiencies (>98% water recovery)',
                'Standardized clinical diagnostic algorithms and step-by-step visual emergency medical checklists',
            ],
            emerging: [
                'Exploration Medical Capability (ExMC) clinical decision-support AI guiding non-physician astronauts',
                'Handheld point-of-care blood analyzers, ultrasound diagnostic tools, and 3D printing of medical tools',
                'Formulations for extended shelf-life pharmaceuticals and on-demand nutrient synthesizing bioreactors',
            ],
        },
        iconName: 'Compass',
        color: '#53E7FF',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
    },
    {
        id: 'gravity-fields',
        hazardNumber: 4,
        title: 'Gravity Fields',
        subtitle: 'Transitions across microgravity, hyper-gravity at launch, and partial planetary gravity',
        acronym: 'G',
        simpleExplanation: 'On Earth, gravity pulls our blood, muscles, and bones downward every second. In space weightlessness, fluids rush up into the chest and head, bones stop bearing weight and begin losing calcium, and postural muscles shrink. When astronauts land on the Moon (1/6th Earth gravity) or Mars (3/8th Earth gravity), their bodies must rapidly re-adapt.',
        whyAstronautsExposed: 'Spaceflight requires transiting through intense hypergravity during launch and atmospheric entry (3–5 Gs), months of sustained free-fall microgravity during transit (0 G), and variable partial gravity on destination planetary surfaces (Moon: 0.16 G; Mars: 0.38 G).',
        bodyAndMindEffects: {
            physical: [
                'Cephalad fluid redistribution: ~2 liters of blood and interstitial fluid shift towards the head, causing facial puffiness and nasal congestion',
                'Progressive bone mineral density loss of 1% to 1.5% per month in weight-bearing bones (hips, femur, lower spine)',
                'Rapid atrophy of postural and skeletal muscles without daily high-load mechanical resistance',
                'Space motion sickness (SMS) during the first 48–72 hours as the inner ear balance system (otoliths) recalibrates',
                'Cardiac remodeling and reduction in left ventricular heart mass due to reduced workload against gravity',
            ],
            psychological: [
                'Disorientation and altered spatial awareness ("which way is up?") during initial mission phases',
                'Fatigue and physical frustration when adapting to moving heavy masses in zero gravity',
            ],
        },
        longTermConsequences: [
            'Severe orthostatic intolerance (inability to stand without fainting) immediately upon landing on Earth or Mars',
            'Increased susceptibility to bone fractures and accelerated post-mission osteoporosis',
            'Elevated risk of kidney stones as calcium leaches out of bones into the bloodstream and urine',
            'Spaceflight-Associated Neuro-ocular Syndrome (SANS): structural flattening of the eye globe and blurry near vision',
        ],
        protectionStrategies: {
            current: [
                'Prescribed 2 to 2.5 hours of daily countermeasure exercise using the Advanced Resistive Exercise Device (ARED), T2 treadmill, and cycle ergometer (CEVIS)',
                'Fluid and salt tablet loading protocols before atmospheric reentry to restore blood plasma volume',
                'Anti-G compression suits worn during launch, entry, and landing to prevent blood pooling in lower limbs',
            ],
            emerging: [
                'Short-radius human centrifuges to provide intermittent artificial gravity during long deep-space transit',
                'Lower Body Negative Pressure (LBNP) sleeping suits that gently pull body fluids back down toward the feet overnight',
                'Targeted bone-resorption inhibitors (bisphosphonates) combined with optimized nutritional protocols',
            ],
        },
        iconName: 'Orbit',
        color: '#5DF2B4',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
    },
    {
        id: 'hostile-closed-environments',
        hazardNumber: 5,
        title: 'Hostile / Closed Environments',
        subtitle: 'Life inside an artificial spacecraft ecosystem: recycled air, toxic dust, and microbial shifts',
        acronym: 'E',
        simpleExplanation: 'A spacecraft is a tightly sealed metal box surrounded by the vacuum of space. Inside, every breath of oxygen is recycled, every drop of water is reclaimed, and mechanical fans run continuously. Microbes mutate differently in microgravity, carbon dioxide can pool in stagnant air, and extraterrestrial dust can cling to spacesuits and irritate lungs.',
        whyAstronautsExposed: 'Human life requires an artificial biosphere that seals astronauts off from the vacuum and extreme temperatures of space. In a closed loop, trace contaminants, exhaled CO2, volatile organic compounds, skin flakes, and microbial flora accumulate unless continuously scrubbed and filtered.',
        bodyAndMindEffects: {
            physical: [
                'Elevated carbon dioxide levels (often 10x higher than terrestrial ambient air), causing headaches, lethargy, and vision changes',
                'Acoustic confinement: continuous background noise from fans, pumps, and life-support compressors causing auditory fatigue',
                'Microbial shifts: bacteria in space can form denser biofilms and exhibit altered antibiotic resistance patterns',
                'Irritation from extraterrestrial dust: abrasive, sharp lunar regolith or toxic perchlorate-laden Martian soil brought inside airlocks',
                'Subclinical suppression of immune response, leading to skin rashes, allergic sensitivities, and reactivation of dormant viruses',
            ],
            psychological: [
                'Sensory monotony from artificial air, uniform mechanical hums, and lack of natural earthly scents or weather',
                'Heightened situational stress regarding potential hull breaches, toxic ammonia leaks, or life-support malfunctions',
            ],
        },
        longTermConsequences: [
            'Potential chronic pulmonary irritation or toxicity from inhalation of fine abrasive planetary regolith particles',
            'Persistent hearing threshold shifts from continuous equipment noise exposure over long missions',
            'Opportunistic microbial infections in immunocompromised crew members far from hospital facilities',
        ],
        protectionStrategies: {
            current: [
                'Multi-stage Environmental Control and Life Support Systems (ECLSS) with catalytic CO2 scrubbers and HEPA filters',
                'Rigorous microbiological surface swabbing and water quality testing protocols',
                'Acoustic sound dampening blankets around noisy hardware and personalized hearing protection',
                'Airlock vacuuming and suit isolation protocols to prevent planetary dust from contaminating living quarters',
            ],
            emerging: [
                'DNA sequencing in space (MinION handheld sequencers) for real-time identification of microbes without returning samples',
                'Electrostatic and biomimetic self-cleaning suit materials that repel abrasive regolith dust automatically',
                'Advanced biological air revivification systems using microalgae and hydroponic plants to produce fresh oxygen',
            ],
        },
        iconName: 'Box',
        color: '#FFCA72',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
    },
];

// -------------------------------------------------------------
// 2. HUMAN SPACEFLIGHT HEALTH RISKS (NASA HRP)
// -------------------------------------------------------------
export const NASA_HEALTH_RISKS: HealthRisk[] = [
    {
        id: 'bone-muscle-loss',
        category: 'Musculoskeletal System',
        riskTitle: 'Bone Mineral Density Depletion and Skeletal Muscle Atrophy',
        whatHappens: 'In microgravity, astronauts lose bone mineral density at an alarming rate of approximately 1% to 1.5% each month in weight-bearing regions such as the lumbar spine, hips, and femoral necks. Simultaneously, muscle mass, strength, and endurance decrease rapidly, with postural slow-twitch muscle fibers shrinking fastest.',
        whyItHappens: 'Without the constant 1-G mechanical loading of walking and standing against Earth’s gravity, osteocytes signal that heavy bone architecture is unnecessary. Bone resorption by osteoclasts accelerates while bone formation by osteoblasts slows down. Excess calcium is broken down and dumped into the bloodstream and urine. Muscles unburdened by body weight suffer rapid disuse atrophy.',
        howItAffectsAstronauts: 'Astronauts experience decreased physical endurance, spinal elongation leading to acute lower back pain, heightened vulnerability to bone fractures during strenuous EVA spacewalks, and reduced ability to perform heavy planetary surface operations immediately after landing.',
        possibleConsequences: [
            'High risk of nephrolithiasis (kidney stones) caused by hypercalciuria (excess calcium filtered through the kidneys)',
            'Accelerated early-onset osteoporosis requiring years of intensive post-flight rehabilitation',
            'Potential structural bone micro-architecture degradation that may not fully recover to pre-flight baseline',
            'Compromised ability to perform unassisted emergency spacecraft egress on the Martian surface',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Pre-flight and post-flight Dual-energy X-ray Absorptiometry (DEXA) scans and high-resolution peripheral quantitative computed tomography (HR-pQCT)',
                'In-flight urinary and blood biochemical bone turnover markers (N-telopeptide, osteocalcin, calcium ion levels)',
                'Regular in-flight muscle circumference measurements and functional isometric strength evaluations',
            ],
            mitigation: [
                'Mandatory daily high-load resistive strength training using the Advanced Resistive Exercise Device (ARED), simulating loads up to 600 lbs',
                'High-intensity interval running on the Colbert (T2) treadmill with bungee harness tethering',
                'Optimized nutrition with adequate protein, vitamin D supplementation, and antiresorptive pharmaceuticals (bisphosphonates) when prescribed',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Dozens of missions spanning Mir, the ISS, and Shuttle programs have comprehensively measured bone and muscle kinetics. Current countermeasure exercise protocols on ARED have substantially slowed, but not completely eliminated, localized bone density loss.',
        relatedOrgans: ['Bones', 'Skeletal Muscles', 'Kidneys', 'Spine'],
        iconName: 'Bone',
        color: '#5DF2B4',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'cardiovascular-changes',
        category: 'Cardiovascular System',
        riskTitle: 'Cephalad Fluid Shifts, Cardiac Deconditioning, and Arrhythmias',
        whatHappens: 'The human cardiovascular system is built to pump blood uphill against gravity. In space, hydrostatic pressure vanishes, causing approximately 2 liters of blood and interstitial fluids to shift upwards from the legs toward the chest and head. The heart no longer needs to work as hard, leading to a reduction in cardiac muscle mass (left ventricular remodeling) and a 10% to 15% decrease in total circulating plasma volume.',
        whyItHappens: 'Elimination of the gravity-dependent blood pressure gradient removes the natural venous pooling in the lower extremities. The central body’s baroreceptors interpret the thoracic fluid surge as total body fluid overload, signaling the kidneys to increase urine output and excrete fluid. Over months, the unburdened heart reduces its muscle mass to match the lower demand.',
        howItAffectsAstronauts: 'Astronauts exhibit facial puffiness, sinus congestion ("space stuffy nose"), a narrow waist and thin legs ("bird legs"), reduced resting arterial blood pressure, and occasional heart rate irregularities or minor cardiac arrhythmias during intense physical exertion.',
        possibleConsequences: [
            'Severe orthostatic intolerance upon returning to gravity: astronauts experience sudden blood pooling in the legs, acute drop in cerebral perfusion, dizziness, and fainting',
            'Cardiovascular vascular stiffening: carotid arteries show signs of accelerated arterial aging comparable to 20 years of aging on Earth',
            'Reduced aerobic exercise capacity (VO2 max) required for rigorous emergency procedures or planetary exploration',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Continuous ambulatory wearable electrocardiogram (ECG) and optical photoplethysmography (PPG) vitals tracking',
                'In-flight echocardiography to measure cardiac chamber volumes, stroke volume, and ejection fraction',
                'Continuous blood pressure monitoring and ultrasound assessments of carotid and femoral artery wall thickness',
            ],
            mitigation: [
                'Daily aerobic endurance sessions on the Cycle Ergometer with Vibration Isolation and Stabilization System (CEVIS)',
                'Prescribed oral fluid and salt tablet loading protocol (1 liter of isotonic electrolyte fluid) immediately prior to atmospheric descent',
                'Graduated lower-body compression garments and anti-G suits worn during reentry and landing to mechanically force venous return',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Cardiovascular deconditioning and orthostatic intolerance are well-documented clinical facts. Long-term arterial stiffness and venous thrombosis risks (e.g. jugular vein flow stasis/thrombus observed on ISS) are active areas of ongoing research.',
        relatedOrgans: ['Heart', 'Blood Vessels', 'Carotid Arteries', 'Venous Circulation'],
        iconName: 'Heart',
        color: '#FF647C',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'vision-related-changes',
        category: 'Neuro-Ocular Health',
        riskTitle: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
        whatHappens: 'Up to 70% of astronauts on long-duration space missions experience progressive structural and refractive changes in their eyes. These changes include flattening of the back of the eyeball (posterior globe flattening), swelling of the optic nerve head (optic disc edema/papilledema), choroidal folds, cotton wool spots on the retina, and a hyperopic shift causing noticeable degradation of near vision.',
        whyItHappens: 'On Earth, gravity pulls cerebrospinal fluid (CSF) and venous blood downward whenever we stand or sit. In sustained microgravity, fluid continuously shifts towards the head, preventing the normal daytime drop in intracranial pressure. This continuous upward pressure against the back of the eye, combined with altered venous outflow through the neck, compresses the optic nerve sheath and remodels the compliant scleral wall.',
        howItAffectsAstronauts: 'Astronauts discover they can no longer read tablet checklists, computer monitors, or instrument panels clearly up close. NASA provides an onboard kit of variable-focus "space anticipation glasses" to compensate for progressive optical hyperopia during missions.',
        possibleConsequences: [
            'Permanent visual acuity deficits and irreversible structural remodeling of the retina and optic nerve',
            'Visual field blind spots or scotomas caused by chronic untreated optic disc edema',
            'Potential mission compromise if astronauts cannot read navigation interfaces or perform delicate manual dockings',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'High-resolution on-orbit Optical Coherence Tomography (OCT) scanning cross-sections of the retina and optic nerve head',
                'Fundoscopic imaging to inspect the retina, blood vessels, and optic disc margins',
                'Regular visual acuity assessments and ocular ultrasound measuring optic nerve sheath diameter (ONSD)',
            ],
            mitigation: [
                'Lower Body Negative Pressure (LBNP) suits and sleeping enclosures designed to draw venous blood down into the legs during rest',
                'Optimizing habitat carbon dioxide levels, as elevated ambient CO2 can exacerbate cerebral vasodilation and ICP',
                'Investigating nutritional and metabolic cofactors, such as 1-carbon metabolic genetic pathways and B-vitamin status',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'SANS is universally recognized as one of NASA’s highest-priority medical challenges. While the clinical symptoms are thoroughly mapped, the exact mechanism causing differences between individual astronauts and the definitive countermeasure remain in active investigation.',
        relatedOrgans: ['Eyes', 'Optic Nerve', 'Brain (CSF)', 'Retina'],
        iconName: 'Eye',
        color: '#53E7FF',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'immune-system-changes',
        category: 'Immunology & Microbiology',
        riskTitle: 'Immune System Dysregulation and Latent Viral Reactivation',
        whatHappens: 'The human immune system exhibits measurable dysregulation during spaceflight. Key defense mechanisms—including T-cell activation, natural killer (NK) cell cytotoxicity, and neutrophil function—become subdued. Simultaneously, dormant herpesviruses that stay latent in the body (such as Epstein-Barr virus, Varicella-Zoster shingles virus, and Cytomegalovirus) spontaneously reactivate and shed in astronaut saliva and urine.',
        whyItHappens: 'Immune cells are mechanosensitive; microgravity alters cellular cytoskeleton signaling and lymphocyte proliferation. This biological effect is compounded by chronic environmental stressors: elevated radiation, disrupted circadian sleep cycles, altered diet, and the psychological stress of living in an isolated high-risk habitat.',
        howItAffectsAstronauts: 'Astronauts show heightened susceptibility to persistent skin rashes, delayed wound healing, allergic hypersensitivity reactions to normally harmless environmental particulates, and subclinical viral reactivation episodes.',
        possibleConsequences: [
            'Potential development of symptomatic clinical viral infections (such as painful shingles or mononucleosis) during deep-space transit',
            'Increased vulnerability to opportunistic bacterial or fungal infections from mutated biofilms inside the habitat',
            'Impaired tissue regeneration and compromised recovery following accidental traumatic injury during exploration tasks',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Regular salivary and blood sampling analyzed via quantitative PCR to quantify viral DNA copy numbers',
                'Flow cytometry and multi-color immunophenotyping assessing white blood cell subset distributions and cytokine profiles',
                'Monitoring skin health, microbiome shifts, and allergy symptoms through daily clinical logs',
            ],
            mitigation: [
                'Prophylactic antiviral medications (e.g., valacyclovir) administered before and during flight when indicated',
                'Nutritional supplementation enriched with zinc, vitamin D, polyphenols, and omega-3 fatty acids',
                'Rigorous habitat cleanliness, HEPA air purification, and active stress-reduction sleep protocols',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Immune alteration and viral shedding are established scientific facts demonstrated across dozens of space missions. Evaluating whether this dysregulation poses a catastrophic clinical threat on multi-year exploration flights to Mars is under active study.',
        relatedOrgans: ['Immune Cells', 'Lymphatic System', 'Skin', 'Bone Marrow'],
        iconName: 'ShieldAlert',
        color: '#9275FF',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'radiation-health-effects',
        category: 'Cellular & Genomic Health',
        riskTitle: 'Radiation-Induced Carcinogenesis, Tissue Degeneration, and CNS Risks',
        whatHappens: 'High-energy galactic cosmic rays (composed of relativistic protons, alpha particles, and high-Z heavy ions like iron) slice through the human body, generating dense ionizing tracks. These particles cause complex, clustered double-strand breaks in cellular DNA that are extremely difficult for cellular enzymes to repair cleanly, alongside oxidative stress and free radical cascades.',
        whyItHappens: 'Earth’s atmosphere provides shielding equivalent to 10 meters of water, and its magnetic field deflects the vast majority of charged cosmic particles. Spacecraft hulls can only stop low-energy particles; high-energy cosmic rays penetrate spacecraft walls and produce secondary neutron showers that interact directly with astronaut organs.',
        howItAffectsAstronauts: 'During low-Earth orbit missions, effects are largely microscopic and asymptomatic in the short term, though astronauts frequently see bright flashes of light in their eyes (phosphenes) when cosmic rays pass through their retina even with eyes closed.',
        possibleConsequences: [
            'Significant increase in lifetime excess risk of cancer mortality (carcinogenesis in blood, lungs, colon, and breast tissue)',
            'Accelerated degenerative tissue disease, including early-onset cataracts and cardiovascular atherosclerosis',
            'Potential damage to central nervous system (CNS) neurons and synaptic plasticity, affecting cognitive processing',
            'Acute Radiation Syndrome (ARS) in the event of an unshielded encounter with an intense Solar Particle Event (SPE)',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Personal active silicon dosimeters and passive thermoluminescent badges worn 24/7 on astronaut flight suits',
                'Cytogenetic biodosimetry: fluorescent in situ hybridization (FISH) analysis of chromosome aberrations in astronaut lymphocytes',
                'Real-time space weather solar flare surveillance networks (NOAA Space Weather Prediction Center & NASA SWPC)',
            ],
            mitigation: [
                'Dedicated storm shelter compartments inside the spacecraft shielded by water tanks, food rations, and polyethylene blocks',
                'Operational flight rules restricting EVAs during solar maximums and aligning spacecraft engines toward incoming solar storms',
                'Research into dietary antioxidants, radioprotective medications, and specialized DNA repair-enhancing therapies',
            ],
        },
        scientificStatus: 'Active Ongoing Research',
        statusNotes: 'Basic physics of ionizing radiation and cell damage are firmly established. However, quantifying the precise risk from chronic, low-dose deep-space heavy ions (GCRs) on human cancer latency and CNS function remains an active research frontier at the NASA Space Radiation Laboratory (NSRL).',
        relatedOrgans: ['DNA / Genome', 'Central Nervous System', 'Heart', 'Ocular Lens'],
        iconName: 'Radio',
        color: '#FF647C',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'sleep-disturbances',
        category: 'Sleep & Circadian Physiology',
        riskTitle: 'Circadian Misalignment, Sleep Deprivation, and Chronic Fatigue',
        whatHappens: 'Astronauts on orbit sleep an average of only 5.9 to 6.2 hours per night—significantly below the recommended 8 hours. Sleep architecture is altered, with reductions in restorative slow-wave deep sleep and rapid eye movement (REM) sleep. Frequent awakenings and difficulty falling asleep are widely reported.',
        whyItHappens: 'In low-Earth orbit, the ISS circles Earth every 90 minutes, producing 16 sunrises and sunsets every 24 hours and completely dismantling normal astronomical day-night cues. Sleep is further disrupted by continuous ventilation fan noise, tethered sleeping bags without gravitational tactile cues, microgravity vestibular illusions, and heavy mission scheduling demands.',
        howItAffectsAstronauts: 'Astronauts experience daytime drowsiness, diminished working memory, mood lability, slower reaction times on critical operational tasks, and increased reliance on sleep aids (such as zolpidem) and morning caffeine stimulants.',
        possibleConsequences: [
            'Heightened probability of human operational error during safety-critical maneuvers (docking, robotic arm operations, EVAs)',
            'Exacerbation of neuro-immunological and metabolic strain, impairing glucose regulation and immunity',
            'Long-term cumulative sleep debt leading to chronic physical exhaustion and psychological vulnerability',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Actigraphy wristbands tracking continuous motor activity, rest-activity cycles, and estimated sleep architecture',
                'Validated daily cognitive vigilance testing using the 3-minute Psychomotor Vigilance Task (PVT-B)',
                'Subjective sleep quality logs and periodic polysomnography (EEG, EOG, EMG) sleep headbands',
            ],
            mitigation: [
                'Solid-State Light Assemblies (SSLA) in ISS crew quarters: blue-enriched light in the morning to promote wakefulness, dim red/warm light in the evening to stimulate melatonin',
                'Individual sound-dampened sleeping quarters equipped with personal temperature control and ventilation airflow',
                'Cognitive Behavioral Therapy for Insomnia (CBT-I) protocols and carefully managed pharmacological sleep aids',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Decades of polysomnography, actigraphy, and cognitive vigilance tests have conclusively established sleep loss and circadian disruption as major mission performance risks. Countermeasures have vastly improved sleep quality but chronic sleep deficit persists.',
        relatedOrgans: ['Brain', 'Pineal Gland (Melatonin)', 'Circadian Clock', 'Endocrine System'],
        iconName: 'Moon',
        color: '#FFCA72',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'psychological-stress',
        category: 'Behavioral Health & Psychology',
        riskTitle: 'Confinement Stress, Earth Detachment, and Interpersonal Crew Dynamics',
        whatHappens: 'Long-duration spaceflight places humans under prolonged psychological confinement. Crew members live in isolated, high-risk micro-environments with the same small group of people for months or years, carrying immense responsibility while unable to escape the habitat or interact directly with their broader social circles.',
        whyItHappens: 'Constant physical danger, separation from family milestones, lack of sensory variety, restricted personal space, and the psychological impact of seeing Earth diminish in size create chronic psychological strain. Interpersonal differences can magnify over time under stressful operational conditions.',
        howItAffectsAstronauts: 'Astronauts may experience fluctuations in mood, irritability, interpersonal tension, social withdrawal from team activities, homesickness, and motivational plateaus (particularly around the midpoint of the mission, known as the "third-quarter phenomenon").',
        possibleConsequences: [
            'Breakdown in crew cohesion and cooperation, which can degrade teamwork during critical high-stress operations',
            'Friction between the flight crew and ground mission support controllers ("us versus them" psychological displacement)',
            'Potential development of clinically significant anxiety, depressive episodes, or operational burnout in deep space',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Bi-weekly private psychological conferences (PPCs) conducted over encrypted audio/video with flight operational psychologists',
                'Validated Behavioral Health and Performance (BHP) digital self-assessments and crew cohesion surveys',
                'Unobtrusive behavioral indicators: communication latency, acoustic voice prosody analysis, and team interaction frequency',
            ],
            mitigation: [
                'Extensive pre-mission team building, cross-cultural communication training, and conflict resolution coaching',
                'Guaranteed private communication channels with spouses, children, and personal support networks',
                'Recreational resources including musical instruments, surprise care packages from Earth, books, and high-definition movie nights',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Behavioral stressors and psychological shifts are well-documented on the ISS, polar research stations (Antarctica), and submarine habitats. Understanding behavioral autonomy on 3-year autonomous Mars missions with 22-minute communication lag is a major ongoing research focus.',
        relatedOrgans: ['Brain (Limbic System)', 'Prefrontal Cortex', 'Neuroendocrine Axis'],
        iconName: 'Brain',
        color: '#9275FF',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
    {
        id: 'cognitive-behavioral-changes',
        category: 'Cognitive & Sensorimotor Health',
        riskTitle: 'Sensorimotor Adaptation, Cognitive Workload, and Motor Performance',
        whatHappens: 'Upon entering microgravity and upon returning to gravity, astronauts experience significant sensorimotor disorientation. The brain must rapidly rewire how it interprets sensory inputs from the eyes, inner ear (vestibular system), muscles, and joints. Astronauts experience illusions of self-motion, difficulty tracking moving targets, and temporary loss of fine motor coordination.',
        whyItHappens: 'On Earth, the otolith organs in the inner ear sense gravity to tell us which way is down. In free-fall, the otoliths no longer register a gravitational pull, confusing the brain’s vestibular-ocular reflex (VOR). Simultaneously, high operational workloads, sleep loss, and multisensory remapping place heavy demands on executive cognitive processing.',
        howItAffectsAstronauts: 'During initial days, astronauts experience space motion sickness (nausea, cold sweats, disorientation). Fine manual dexterity degrades slightly, hand-eye coordination requires conscious focus, and landing manual piloting skills can be temporarily compromised.',
        possibleConsequences: [
            'Impaired ability to walk, balance, or perform critical emergency egress maneuvers immediately after landing on a planetary surface',
            'Elevated error rates during complex tele-robotic arm operations, manual spacecraft docking, or spacewalk tool manipulation',
            'Cognitive overload and slower emergency reaction times when faced with unexpected multi-system flight anomalies',
        ],
        monitoringAndMitigation: {
            monitoring: [
                'Standardized NASA Cognition Test Battery: evaluating processing speed, spatial working memory, and abstraction',
                'Sensorimotor balance and dynamic posturography rails tested before and immediately upon landing',
                'Robotic simulation docking tasks measuring reaction latency and fine tracking precision',
            ],
            mitigation: [
                'Pre-flight vestibular habituation training and motion sickness desensitization regimens',
                'Short-acting anti-motion sickness medication (promethazine) during the initial 48-hour adaptation window',
                'Automated flight guidance and computerized flight checklist interfaces with built-in error trapping to reduce cognitive load',
            ],
        },
        scientificStatus: 'Established Finding',
        statusNotes: 'Sensorimotor adaptation and transient post-flight postural ataxia are universally observed and well-characterized. Long-term neuroplastic adaptation and potential cumulative cognitive risks on multi-year exploration flights remain actively researched.',
        relatedOrgans: ['Vestibular System (Inner Ear)', 'Cerebellum', 'Sensorimotor Cortex', 'Eyes'],
        iconName: 'Sparkles',
        color: '#53E7FF',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
    },
];

// -------------------------------------------------------------
// 3. NASA ONGOING HUMAN RESEARCH PROGRAM (HRP)
// -------------------------------------------------------------
export const NASA_HRP_OVERVIEW = {
    title: 'NASA Human Research Program (HRP)',
    subtitle: 'Pioneering scientific countermeasures to safeguard human exploration of the Moon and Mars',
    description: 'NASA’s Human Research Program (HRP) is dedicated to discovering the best ways to keep astronauts safe, healthy, and high-performing on long-duration exploration missions. Using the International Space Station as a microgravity laboratory, along with Earth-based space flight analogue facilities (such as the HERA habitat at Johnson Space Center and the :envihab facility in Germany), HRP researchers study the physiological, mental, and behavioral effects of space travel.',
    whyNASAConductsResearch: 'Space is an inherently hostile environment for human biology. For humans to travel to the Moon under the Artemis campaign, build the Lunar Gateway, and embark on a three-year journey to Mars, NASA must understand and develop verified countermeasures for the five hazards of spaceflight. Findings from this research also yield profound medical breakthroughs for people on Earth.',
    coreElements: [
        {
            name: 'Exploration Medical Capability (ExMC)',
            lead: 'Medical Autonomy & Clinical Informatics',
            focus: 'Developing autonomous medical decision-support systems, miniature point-of-care clinical diagnostics, and resilient medical consumables for deep space when real-time telemedicine from Earth is impossible.',
        },
        {
            name: 'Human Factors and Behavioral Performance (HFBP)',
            lead: 'Cognitive, Sleep & Team Resilience',
            focus: 'Investigating crew sleep patterns, circadian lighting, autonomous task scheduling, team dynamics, sensory-motor adaptation, and psychological well-being in prolonged extreme confinement.',
        },
        {
            name: 'Human Health Countermeasures (HHC)',
            lead: 'Physiological Systems & Exercise Science',
            focus: 'Devising innovative exercise hardware, nutritional countermeasures, pharmacological interventions, and artificial gravity systems to prevent cardiovascular, bone, muscle, and SANS vision degradation.',
        },
        {
            name: 'Research Operations and Integration (ROI)',
            lead: 'ISS & Analogue Mission Implementation',
            focus: 'Managing, scheduling, and executing all human flight experiments aboard the International Space Station, commercial crew vehicles, and Earth-based ground analogue habitats like HERA and Antarctica.',
        },
        {
            name: 'Space Radiation Element (SR)',
            lead: 'Radiation Physics & Radiobiology',
            focus: 'Developing high-fidelity space radiation risk assessment models, biological dosimeters, and physical/radioprotective shielding strategies using the NASA Space Radiation Laboratory (NSRL) at Brookhaven.',
        },
    ],
    missionSignificance: 'Every HRP experiment directly mitigates specific high-risk failure modes identified in NASA’s Human Research Roadmap, ensuring that when the first crew touches down on Mars, they can walk out of their lander, explore the Martian surface safely, and return to Earth in peak health.',
    officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
};

export const NASA_ONGOING_STUDIES: HRPStudy[] = [
    {
        id: 'cipher-study',
        title: 'CIPHER: Complement of Integrated Protocols for Human Exploration Research',
        element: 'Research Operations',
        elementFullName: 'Research Operations and Integration (ROI) / Multi-Element Flagship',
        objective: 'Conduct a comprehensive, integrated suite of 14 physiological and psychological studies across astronauts on missions of varying lengths—from short (weeks) to standard (6 months) and extended (up to a full year)—to systematically map human adaptation as a function of time in space.',
        scientificSignificance: 'CIPHER is the first multi-system study to compare the exact same medical protocols across different mission durations, establishing whether physiological and cognitive changes plateau or continue to deteriorate over long deep-space transit times.',
        currentStatus: 'Active on ISS',
        statusVerificationDate: 'Verified 2025/2026',
        astronautImpact: 'Tracks whole-body health: bone microstructure, cardiovascular stiffness, vision changes (SANS), immune cell profiles, cognitive processing speed, and microbiome shifts.',
        futureMissionRelevance: 'Provides essential baseline safety benchmarks for planning 1,000-day human round-trip expeditions to Mars.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            'Cardiovascular stiffening occurs early in flight but stabilizes with strict high-intensity countermeasure workouts',
            'Individual genetic variation plays a significant role in susceptibility to ocular structural changes (SANS)',
            'Integrated protocols reduce crew research overhead by synchronizing blood draws, DEXA scans, and cognitive tests',
        ],
    },
    {
        id: 'sprint-countermeasure',
        title: 'SPRINT: High-Intensity, Low-Volume Exercise Protocol Optimization',
        element: 'Human Health Countermeasures',
        elementFullName: 'Human Health Countermeasures (HHC)',
        objective: 'Evaluate whether high-intensity interval training (HIIT) on the ARED resistive exerciser and T2 treadmill can protect cardiovascular function, aerobic capacity (VO2 max), and bone-muscle mass more effectively than traditional high-volume, continuous exercise while saving crew time.',
        scientificSignificance: 'Astronauts currently spend 2.5 hours every day exercising. If an optimized high-intensity regimen can deliver equal or superior physiological protection in less time, it frees up critical crew hours for science operations and reduces hardware wear.',
        currentStatus: 'Active on ISS',
        statusVerificationDate: 'Verified 2025/2026',
        astronautImpact: 'Maintains muscle fiber cross-sectional area and cardiovascular stroke volume with fewer total hours of exercise per week.',
        futureMissionRelevance: 'Essential for compact exploration vehicles (like Orion and the Lunar Gateway) that cannot accommodate large exercise machines.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            'Interval aerobic workouts stimulate greater cardiac output adaptations than steady-state cardio alone',
            'High-resistance lower-body strength training effectively preserves bone mineral density in the femur and pelvis',
            'Reduces mechanical vibration loads transmitted to the spacecraft frame by shortening exercise duration',
        ],
    },
    {
        id: 'twins-study-longitudinal',
        title: 'NASA Twins Study: Longitudinal Multi-Omics and Telomere Dynamics',
        element: 'Space Radiation',
        elementFullName: 'Space Radiation (SR) & Genetics / Multi-Element',
        objective: 'Compare identical twin astronauts (Scott Kelly in space for 340 days; Mark Kelly on Earth as ground control) across genomics, epigenomics, telomere biology, transcriptomics, metabolomics, and cognitive performance.',
        scientificSignificance: 'Landmark multi-omics demonstration that proved human biology can largely maintain molecular resilience during a year in microgravity, while revealing unexpected telomere length and gene expression dynamics.',
        currentStatus: 'Completed Landmark Study',
        statusVerificationDate: 'Verified Baseline & Ongoing Follow-ups',
        astronautImpact: 'Discovered that Scott Kelly’s telomeres lengthened in space and then rapidly shortened upon return to Earth; 91% of gene expression changes normalized within six months post-flight.',
        futureMissionRelevance: 'Validates that human cellular systems can withstand long-duration spaceflight, identifying specific genetic biomarkers to monitor on Mars voyages.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            'Telomeres unexpectedly lengthened while in microgravity and rapidly shortened upon planetary return',
            'Immune and DNA repair gene expression spiked during spaceflight to compensate for radiation and cellular stress',
            'Cognitive speed and accuracy remained largely stable throughout the 340-day mission, with transient post-landing decline',
        ],
    },
    {
        id: 'food-physiology',
        title: 'Food Physiology: Dietary Optimization for Microbiome and Immune Resilience',
        element: 'Human Health Countermeasures',
        elementFullName: 'Human Health Countermeasures (HHC) & Nutrition',
        objective: 'Determine how a specialized, nutrient-dense exploration diet rich in bioactive flavonoids, carotenoids, polyphenols, omega-3 fatty acids, and fiber affects the human immune system, gut microbiome diversity, and nutritional status over 6+ month missions.',
        scientificSignificance: 'Links dietary composition directly to immune biomarker stability and gut microbiota diversity in an isolated closed-loop environment, showing food is an active medicine in space.',
        currentStatus: 'Active on ISS',
        statusVerificationDate: 'Verified 2025/2026',
        astronautImpact: 'Reduces systemic inflammation markers, boosts salivary antimicrobial proteins, and maintains diverse gut bacterial species that protect against GI infections.',
        futureMissionRelevance: 'Defines the exact shelf-stable nutritional requirements for the 3-year Mars food system.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            'Diets enriched in dietary fiber prevent gut microbial depletion caused by environmental stress and antibiotics',
            'Increased dietary antioxidants directly correlated with lower urinary markers of oxidative cellular damage',
            'Improved food variety and palatability delivered measurable improvements in crew psychological morale',
        ],
    },
    {
        id: 'sans-lbnp-countermeasure',
        title: 'SANS Countermeasures: Lower Body Negative Pressure (LBNP) Hemodynamics',
        element: 'Human Health Countermeasures',
        elementFullName: 'Human Health Countermeasures (HHC) / Ocular Health',
        objective: 'Evaluate whether applying negative atmospheric pressure to the lower body (using mobile LBNP suits and sealed chambers) can pull venous blood and interstitial fluid back down to the legs, safely lowering intracranial pressure and preventing optic nerve swelling.',
        scientificSignificance: 'Directly addresses the mechanical root cause of Spaceflight-Associated Neuro-ocular Syndrome (SANS) by restoring Earth-like gravitational hydrostatic fluid pressure gradients for several hours each day.',
        currentStatus: 'Active on ISS',
        statusVerificationDate: 'Verified 2025/2026',
        astronautImpact: 'Reverses optic nerve sheath engorgement, improves venous drainage from the internal jugular veins, and relieves ocular posterior globe pressure.',
        futureMissionRelevance: 'Crucial for preserving astronauts’ visual acuity so they can safely land spacecraft and inspect planetary surface instruments on Mars.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            '25 to 30 mmHg of negative pressure applied to lower limbs successfully shifts approximately 1 liter of fluid downward',
            'Jugular vein diameter and intracranial pressure indicators normalize toward standing Earth baseline values during LBNP',
            'Overnight wearable LBNP suits are being engineered as practical sleep enclosures for deep space exploration vehicles',
        ],
    },
    {
        id: 'space-flight-standard-measures',
        title: 'Space Flight Standard Measures: Standardized Longitudinal Physiological Repository',
        element: 'Research Operations',
        elementFullName: 'Research Operations and Integration (ROI)',
        objective: 'Collect a standardized set of core physiological, sensorimotor, behavioral, biological, and immune metrics from every participating astronaut across all ISS expeditions to build a multi-decade longitudinal research repository.',
        scientificSignificance: 'Provides the global scientific community with high-quality, standardized comparative data to evaluate the overall effectiveness of countermeasures across different crews and spacecraft environments.',
        currentStatus: 'Active on ISS',
        statusVerificationDate: 'Verified 2025/2026',
        astronautImpact: 'Standardizes blood, urine, saliva, actigraphy, cognitive, and ultrasound data collection across missions, minimizing duplication.',
        futureMissionRelevance: 'Creates the unified empirical baseline against which future Artemis Moon missions and Mars transit data will be evaluated.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        keyFindings: [
            'Enables cross-mission statistical power for human health anomalies that occur at low frequencies',
            'Standardized biospecimen freezing protocols ensure samples return to Earth in pristine condition for genomic sequencing',
            'Serves as the benchmark dataset for validating emerging AI predictive health algorithms',
        ],
    },
];

// -------------------------------------------------------------
// 4. CANADIAN SPACE AGENCY (CSA) PARTNER RESEARCH
// -------------------------------------------------------------
export const CSA_RADIATION_RESOURCE: CSAResourceData = {
    resourceId: 'csa-radiation-monitoring',
    title: 'Monitoring Radiation for Astronaut Health',
    agency: 'Canadian Space Agency (CSA)',
    officialUrl: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
    publicationDate: 'Official Canadian Space Agency Publication',
    summary: 'The Canadian Space Agency (CSA) plays a leading international role in monitoring space radiation and developing cutting-edge technologies to measure astronaut exposure, protecting human health in orbit and on future lunar and deep-space missions.',
    coreSections: [
        {
            title: '1. What Space Radiation Is & Why Astronauts Are Exposed',
            content: 'Space radiation consists of energetic subatomic particles—including protons, alpha particles, and high-energy heavy nuclei (HZE ions)—traveling through space at near the speed of light. In space, astronauts are exposed to two main sources: Galactic Cosmic Rays (GCRs), which originate outside our solar system from supernova explosions, and Solar Particle Events (SPEs), which are intense bursts of protons released during solar flares and coronal mass ejections. On Earth, our dense atmosphere and magnetosphere shield us from over 99% of this radiation. Above this protective shield, astronauts are continuously exposed to ionizing radiation that easily passes through conventional spacecraft walls.',
        },
        {
            title: '2. How Radiation Affects Human Health',
            content: 'Unlike the ionizing radiation commonly encountered on Earth (such as medical X-rays), space radiation includes heavy, highly charged particles. When these particles travel through human tissue, they create dense ionizing tracks that can cause severe cellular damage:',
            points: [
                'DNA Double-Strand Breaks: High-energy particles cleanly sever both strands of the DNA double helix in close proximity, making accurate cellular enzymatic repair difficult and increasing the probability of carcinogenic mutations.',
                'Increased Lifetime Cancer Risk: Long-term exposure increases the excess lifetime risk of developing fatal cancers, particularly leukemia, breast, lung, and gastrointestinal tumors.',
                'Degenerative Tissue Damage: Radiation can cause early-onset cataracts in the eyes, accelerate the stiffening of coronary arteries, and induce chronic vascular inflammation.',
                'Central Nervous System & Acute Effects: High cumulative doses can cause neuro-inflammation in brain tissue, potentially impacting cognitive flexibility and memory. A massive, unshielded solar storm could deliver acute doses capable of causing acute radiation sickness.',
            ],
        },
        {
            title: '3. Why Continuous Radiation Monitoring Is Vital',
            content: 'Radiation in space is not uniform or steady. An astronaut’s actual exposure fluctuates dramatically based on orbital altitude, inclination, solar cycle activity, and spacecraft orientation. For example, the ISS passes through the South Atlantic Anomaly (SAA)—a regional dip in Earth’s magnetic field—several times daily, causing sharp radiation spikes. Continuous real-time monitoring is critical to measure individual absorbed dose rates, trigger immediate emergency alerts when sudden solar particle events erupt, and enforce lifetime occupational radiation limits to guarantee astronaut safety.',
        },
        {
            title: '4. Canadian Technologies Measuring Space Radiation',
            content: 'Canada has developed world-renowned specialized instruments to detect, measure, and analyze cosmic radiation exposure:',
            points: [
                'EVARM (Extravehicular Activity Radiation Monitor): The first Canadian instrument designed to measure radiation dosages directly to astronauts’ skin and internal organs during spacewalks (EVAs). Compact dosimeters placed in suit pockets measure real-time exposure outside the station.',
                'Bubble Detectors & Neutron Dosimeters: Canadian-engineered bubble dosimeters detect neutral particles (neutrons), which are generated when cosmic rays strike the spacecraft’s aluminum hull and produce secondary radiation showers that are otherwise difficult to measure.',
                'Bio-Monitor (Smart Garment): A Canadian Space Agency wearable system that integrates non-invasive physiological monitoring (ECG, breathing, skin temperature, activity) with environmental exposure telemetry to understand how radiation and physical exertion interact.',
                'Active Semiconductor Silicon Sensors: Real-time electronic dosimeters that provide immediate feedback to flight surgeons and astronauts, displaying instantaneous dose rates in microSieverts per hour (μSv/h).',
            ],
        },
        {
            title: '5. How Scientists Assess Exposure & Support Astronaut Safety',
            content: 'Scientists assess astronaut exposure through a multi-layered approach that combines physical and biological dosimetry:',
            points: [
                'Physical Dosimetry: Continuous data logging from personal dosimeters worn on the body and area monitors installed in sleeping and work modules calculates the cumulative absorbed dose in Grays (Gy).',
                'Biological Dosimetry (Biodosimetry): Blood samples collected before and after space missions undergo cytogenetic analysis (such as FISH chromosome painting) to count actual chromosomal translocations and dicentrics in white blood cells. This reveals the precise biological damage incurred by the individual.',
                'Radiation Equivalent Dose: Translating absorbed physical energy into equivalent dose in Sieverts (Sv) by factoring in the specific biological damage multipliers (quality factors) of different cosmic particle species.',
            ],
        },
        {
            title: '6. Strategies to Reduce Astronaut Radiation Exposure',
            content: 'To keep astronaut exposure "As Low As Reasonably Achievable" (ALARA), space agencies deploy multiple passive and operational countermeasure strategies:',
            points: [
                'Hydrogen-Rich Shielding: Incorporating water walls, food storage supplies, and polyethylene blocks into spacecraft walls. Hydrogen atoms are particularly effective at slowing down and absorbing charged protons without generating excessive secondary radiation.',
                'Onboard Storm Shelters: Designated central areas within the spacecraft with maximum surrounding mass where astronauts can retreat during intense solar particle events.',
                'Operational Flight Timing: Scheduling spacewalks and deep-space transits during solar minimums (for solar storms) or solar maximums (when solar wind partially deflects galactic cosmic rays), and orienting the spacecraft so heavy propulsion tanks face incoming particle streams.',
            ],
        },
    ],
    technologiesOrProjects: [
        {
            name: 'EVARM (Extravehicular Activity Radiation Monitor)',
            description: 'Compact personal dosimeter system developed by the Canadian Space Agency, worn inside astronaut EVA spacesuits to measure real-time organ doses during spacewalks.',
            application: 'Spacewalk Radiation Safety & ISS Operations',
        },
        {
            name: 'Canadian Bubble Detectors',
            description: 'Specialized gel dosimeters containing microscopic liquid droplets that instantly vaporize into visible bubbles when struck by thermal and fast neutrons.',
            application: 'Secondary Neutron Radiation Detection',
        },
        {
            name: 'Bio-Monitor Wearable Platform',
            description: 'CSA-developed all-in-one biomedical shirt and wireless recording headband tracking heart rate, respiration, skin temperature, and blood oxygen alongside environmental telemetry.',
            application: 'Continuous Health and Stress Monitoring on ISS',
        },
    ],
};

export const CSA_SCIENCE_IN_SPACE_RESOURCE: CSAResourceData = {
    resourceId: 'csa-science-in-space',
    title: 'Why Do We Conduct Science Experiments in Space?',
    agency: 'Canadian Space Agency (CSA)',
    officialUrl: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
    publicationDate: 'Official Canadian Space Agency Publication',
    summary: 'The International Space Station provides a one-of-a-kind microgravity research laboratory. The Canadian Space Agency (CSA) conducts ground-breaking space research that advances medical science, pioneers robotics, benefits life on Earth, and prepares humanity for long journeys to the Moon and Mars.',
    coreSections: [
        {
            title: '1. What Makes the Space Environment Truly Unique',
            content: 'On Earth, gravity influences every physical, biological, and chemical process. It causes heavy particles to sink (sedimentation), hot fluids to rise above cold fluids (buoyancy-driven thermal convection), and liquids to deform under their own weight. In low-Earth orbit, the spacecraft and everything inside it are in a continuous state of free-fall around the planet, creating sustained weightlessness (microgravity). In this environment, buoyancy and sedimentation vanish, surface tension becomes the dominant fluid force, and researchers can isolate fundamental physical forces that are completely masked on Earth.',
        },
        {
            title: '2. How Microgravity Affects Scientific Experiments',
            content: 'Without gravity-driven convection and sedimentation, experimental conditions change dramatically:',
            points: [
                'Fluid Physics: Fluids form perfect spheres driven entirely by surface tension. Without buoyancy, heat transfers purely through slow, peaceful diffusion rather than turbulent currents.',
                'Combustion Science: Flames burn as cool, blue, perfectly spherical domes rather than rising teardrop shapes, allowing scientists to study soot formation and combustion efficiency with extreme clarity.',
                'Macromolecular Crystal Growth: Without convection currents disturbing the liquid, protein and virus crystals grow significantly larger, with fewer lattice defects and higher molecular purity than those grown in terrestrial laboratories.',
            ],
        },
        {
            title: '3. Why Researchers Study the Human Body in Space',
            content: 'In microgravity, an astronaut’s body experiences physical transformations that closely mirror the effects of accelerated aging and prolonged bed rest disuse on Earth:',
            points: [
                'Accelerated Osteoporosis Model: Astronauts lose bone mineral density ten times faster than post-menopausal women suffering from severe osteoporosis on Earth.',
                'Vascular Stiffening: In just six months in space, astronaut carotid arteries stiffen to a degree equivalent to 10 to 20 years of normal terrestrial cardiovascular aging.',
                'Muscle Disuse & Balance Loss: Postural muscles atrophy and balance systems decay in ways that parallel geriatric mobility decline and frailty.',
            ],
            callout: 'Spaceflight acts as an accelerated, reversible laboratory model for human aging. By studying young, healthy astronauts who experience these changes and recover upon return, scientists can unlock the biological mechanisms of osteoporosis, cardiovascular disease, and muscle wasting in months rather than decades.',
        },
        {
            title: '4. How Space Experiments Revolutionize Medical Research',
            content: 'Research conducted aboard the ISS directly transforms medical therapies and drug discovery:',
            points: [
                'Precision Drug Design: Pristine protein crystals grown in microgravity enable high-resolution X-ray crystallography, revealing the exact three-dimensional molecular structures of target disease proteins (such as those involved in Duchenne muscular dystrophy, cancer, and Alzheimer’s) and allowing pharmaceutical scientists to design targeted medications.',
                '3D Cell Cultures & Organoids: On Earth, cells grown in Petri dishes flatten out into artificial 2D sheets due to gravity. In microgravity, cells naturally self-assemble into complex, 3D spheroids and organoids that behave like real human tissues, revolutionizing drug testing without animal models.',
            ],
        },
        {
            title: '5. Canadian Technology Innovations: Canadarm to Medical Robotics',
            content: 'Canada’s leadership in space robotics—exemplified by Canadarm, Canadarm2, and the two-armed robotic handyman Dextre—has directly spun off into groundbreaking medical technologies on Earth:',
            points: [
                'neuroArm: The world’s first MRI-compatible surgical robot capable of performing microsurgery inside the human brain with sub-millimeter precision while the patient is inside an active MRI scanner, developed using Canadarm robotic engineering.',
                'IGAR (Image-Guided Autonomous Robot): A specialized robotic arm derived from space technology that performs highly precise, minimally invasive digital biopsies and localized treatments for early-stage breast cancer.',
            ],
        },
        {
            title: '6. Direct Benefits for People on Earth',
            content: 'Space research delivers tangible, life-saving benefits for terrestrial populations:',
            points: [
                'Osteoporosis & Bone Therapeutics: Knowledge gained from testing countermeasure diets and exercise has identified new drug targets for osteoporosis and age-related osteopenia affecting hundreds of millions worldwide.',
                'Remote Healthcare & Telemedicine: Autonomous diagnostic ultrasound protocols and remote wearable sensors developed for astronauts are deployed in remote Canadian Arctic and Indigenous communities where medical specialists are unavailable.',
                'Water Purification & Environmental Systems: Advanced closed-loop water filtration technology engineered for space recycling now provides clean drinking water to disaster zones and remote villages across the globe.',
            ],
        },
    ],
    technologiesOrProjects: [
        {
            name: 'MARROW Study (Canadian Space Agency Flagship)',
            description: 'Groundbreaking CSA experiment demonstrating that spaceflight causes accelerated destruction of red blood cells (space anemia) and increased fat accumulation in bone marrow.',
            application: 'Understanding Anemia in Bedridden and Elderly Patients',
        },
        {
            name: 'Vascular Series (Vascular, Vascular Echo, Vascular Aging)',
            description: 'Long-term CSA cardiovascular research assessing carotid artery wall stiffening, insulin resistance, and blood pressure regulation in astronauts.',
            application: 'Cardiovascular Disease Prevention & Healthy Aging on Earth',
        },
        {
            name: 'At Home in Space',
            description: 'First Canadian psychosocial study on the ISS, investigating how astronauts from diverse cultures adapt psychologically and create a cohesive home environment in confinement.',
            application: 'Team Dynamics in Extreme Isolated Workplaces (Arctic, Mining, Subsea)',
        },
        {
            name: 'Wayfinder Study',
            description: 'Collaborative CSA neuroscience experiment evaluating spatial navigation, vestibular-motor performance, and neuroplasticity during long-duration flight.',
            application: 'Neuro-rehabilitation for Stroke and Balance Disorders',
        },
    ],
    earthAndSpaceBenefits: [
        {
            inSpace: 'Maintains astronaut bone density and cardiovascular function during lunar and Mars missions',
            onEarth: 'Informs clinical treatments for osteoporosis, bed-rest muscle wasting, and arterial stiffening in the aging population',
        },
        {
            inSpace: 'Pioneers remote autonomous health monitoring with wearable Bio-Monitor shirts',
            onEarth: 'Provides telemedicine and continuous vital signs monitoring for patients in remote, rural, and northern communities',
        },
        {
            inSpace: 'Drives high-reliability Canadarm2 and Dextre robotics for satellite repair and lunar Gateway assembly',
            onEarth: 'Spawns neuroArm and IGAR surgical robots performing delicate brain surgery and early breast cancer biopsies',
        },
    ],
};

// -------------------------------------------------------------
// 5. OFFICIAL RESOURCE CENTER DIRECTORY
// -------------------------------------------------------------
export const OFFICIAL_RESOURCES: OfficialResourceItem[] = [
    {
        id: 'res-nasa-hazards',
        organization: 'NASA',
        organizationFullName: 'National Aeronautics and Space Administration (NASA)',
        resourceTitle: 'Five Hazards of Human Spaceflight',
        shortDescription: 'Official NASA Human Research Program portal detailing the five major hazards of space travel: Space Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, and Hostile/Closed Environments, along with mitigation technologies.',
        officialUrl: 'https://www.nasa.gov/hrp/hazards/',
        category: 'Hazards',
        verifiedDate: 'Verified 2025/2026',
    },
    {
        id: 'res-nasa-risks',
        organization: 'NASA',
        organizationFullName: 'National Aeronautics and Space Administration (NASA)',
        resourceTitle: 'Risks of Human Spaceflight',
        shortDescription: 'Comprehensive NASA Human Research Program registry outlining human health and performance risks, including bone and muscle loss, SANS vision changes, cardiovascular deconditioning, immune dysregulation, and behavioral health.',
        officialUrl: 'https://www.nasa.gov/hrp/risks/',
        category: 'Risks',
        verifiedDate: 'Verified 2025/2026',
    },
    {
        id: 'res-nasa-ongoing-hrp',
        organization: 'NASA',
        organizationFullName: 'National Aeronautics and Space Administration (NASA)',
        resourceTitle: 'Ongoing HRP Research in Space',
        shortDescription: 'Official NASA HRP research tracker detailing active and ongoing experiments aboard the International Space Station and ground analogues, including the CIPHER study, SPRINT exercise protocol, food physiology, and SANS countermeasures.',
        officialUrl: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
        category: 'Ongoing Research',
        verifiedDate: 'Verified 2025/2026',
    },
    {
        id: 'res-csa-radiation',
        organization: 'CSA',
        organizationFullName: 'Canadian Space Agency / Agence spatiale canadienne (CSA-ASC)',
        resourceTitle: 'Monitoring Radiation for Astronaut Health',
        shortDescription: 'Canadian Space Agency scientific publication explaining space radiation exposure, biological impacts on cellular DNA, necessity of continuous tracking, and Canadian technologies such as EVARM, bubble detectors, and the Bio-Monitor.',
        officialUrl: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
        category: 'Radiation Science',
        verifiedDate: 'Verified 2025/2026',
    },
    {
        id: 'res-csa-science-in-space',
        organization: 'CSA',
        organizationFullName: 'Canadian Space Agency / Agence spatiale canadienne (CSA-ASC)',
        resourceTitle: 'Why Do We Conduct Science Experiments in Space?',
        shortDescription: 'Canadian Space Agency comprehensive overview detailing the unique microgravity environment, accelerated aging biological models, macromolecular crystal growth, Canadarm-to-neuroArm medical robotics spinoffs, and terrestrial health benefits.',
        officialUrl: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
        category: 'Space Experiments',
        verifiedDate: 'Verified 2025/2026',
    },
];

// -------------------------------------------------------------
// 6. OFFICIAL NASA DISCLAIMER
// -------------------------------------------------------------
export const NASA_DISCLAIMER_TEXT =
    'NASA does not endorse non-U.S. Government entities. Users visiting external non-U.S. Government websites are responsible for reviewing and following the data-use policies and terms of those websites.';

