# AstroCare – Security, Privacy, and Data Governance

## 1. Overview and Architectural Security Posture

AstroCare processes highly sensitive biomedical telemetry, psychological indices, and operational habitat metrics. In alignment with aerospace flight software safety standards (NASA-STD-8719.13), medical device data handling guidelines, and international data privacy principles (HIPAA Security Rule & GDPR Article 9), AstroCare enforces defense-in-depth across the entire data lifecycle.

```
+-------------------------------------------------------------------------+
|                         Defense-in-Depth Model                          |
|                                                                         |
|  [Layer 1: Edge & Network]    TLS 1.3 / WSS Enforced, Strict CSP        |
|  [Layer 2: Authentication]    JWT Tokens, SHA-256 Hashing, Session TTL  |
|  [Layer 3: Authorization]     Role-Based Access Control (Surgeon/Crew)  |
|  [Layer 4: Data Protection]   Simulated Datasets, Pseudonymization      |
|  [Layer 5: Audit & Tamper]    Immutable Log Traces, Deterministic Hashes|
+-------------------------------------------------------------------------+
```

---

## 2. Medical Data Privacy and Synthetic Data Governance

### 2.1. Protection of Identifiable Human Research Data
In terrestrial clinical and research operations involving astronauts (e.g., NASA Twins Study, CSA MARROW study), real human biological telemetry is classified as Protected Health Information (PHI) and restricted Human Research Data.

- **Synthetic Telemetry Guarantee**: For the NASA Space Apps Challenge, public demonstrations, and open-source testing, AstroCare uses exclusively synthetic, algorithmically generated biometric data. No actual astronaut medical records, real genomic data, or classified flight logs are stored or processed.
- **De-Identification & Pseudonymization**: Astronaut IDs in the prototype use standardized identifiers (`ASTRO-01` through `ASTRO-06`) coupled with operational role designations (e.g., Commander, EVA Specialist, Flight Engineer) rather than personal legal identities.

### 2.2. HIPAA Compliance Principles Followed
1. **Minimum Necessary Access**: Crew members only have access to their personal health dashboards and generalized habitat conditions, while designated Medical Officers / Flight Surgeons have fleet-wide triage authority.
2. **Data Integrity Verification**: Telemetry records are tagged with cryptographic checksums to prevent data corruption during store-and-forward transmissions over deep-space delay lines.
3. **Audit Controls**: All alert acknowledgments, clinical risk overrides, and triage notes record the actor's ID, timestamp, and justification.

---

## 3. Authentication and Authorization Architecture

### 3.1. Role-Based Access Control (RBAC) Matrix

| Permission / Functionality | Flight Surgeon / Medical Officer | Mission Commander | Flight Crew Astronaut | Ground Systems Engineer | Guest / Reviewer |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Real-Time Dashboard** | Yes | Yes | Yes (Self Only) | Yes (Habitat Only) | Yes (Demo Read) |
| **View Fleet Risk Assessments** | Yes | Yes | Self Only | No | Yes (Simulated) |
| **Acknowledge / Triage Alerts**| Yes | Yes | Acknowledge Only | No | No |
| **Adjust AI Sensitivity** | Yes | No | No | Yes | No |
| **Inject Simulation Scenarios**| Yes (Sim Mode) | Yes (Sim Mode) | No | Yes (Sim Mode) | Yes (Sim Mode) |
| **Export Medical Records** | Yes (Encrypted) | Summary Only | Self Only | No | Redacted CSV |
| **Modify Baseline Vitals** | Yes | No | No | No | No |

### 3.2. Password and Token Management
- **Password Storage**: Passwords are never stored in plaintext. If backend persistence is active, passwords are salted and hashed using `bcrypt` (work factor 12).
- **Session Tokens**: Authentication tokens are signed using JSON Web Tokens (JWT) with HMAC-SHA256, carrying an expiration TTL of 8 hours, suitable for typical mission shift handovers.

---

## 4. Network and API Security

### 4.1. Transport Security
- **Enforced Encryption**: All REST API traffic is transmitted via HTTPS (TLS 1.3), and streaming telemetry is transported via Secure WebSockets (`wss://`).
- **CORS Configuration**: The FastAPI backend restricts Cross-Origin Resource Sharing (`CORS`) explicitly to whitelisted mission control origins (`http://localhost:5173`, `http://127.0.0.1:5173`, and designated ground control subdomains), rejecting wildcard `*` origins in production mode.

### 4.2. Input Validation and Sanitization
- **Strict Pydantic Type Boundaries**: Every REST request payload is rigorously validated by Pydantic models. String lengths, floating-point numeric intervals (e.g., Heart Rate `0.0 <= HR <= 300.0`), and enumerated status strings are validated before being passed to application logic.
- **XSS & Injection Mitigation**: Frontend rendering utilizes React's JSX virtual DOM escape mechanisms, preventing HTML and script injection from external sensor telemetry strings.

---

## 5. Offline Autonomous Security (Deep Space Resiliency)

Deep-space exploration vehicles traveling outside Low Earth Orbit (cislunar, lunar surface, Mars transit) must operate autonomously without dependency on continuous terrestrial cloud authentication servers:

1. **Local Vehicle Boundary Isolation**: The AstroCare onboard node operates in an isolated local area network (LAN) inside the spacecraft. It has zero external dependencies on terrestrial identity providers (IdPs).
2. **Cryptographic Store-and-Forward**: Telemetry generated during occultation or solar conjunction is buffered in an encrypted SQLite/PostgreSQL storage partition. When line-of-sight communication with Deep Space Network (DSN) ground antennas is restored, the buffered telemetry is transmitted with forward error correction (FEC) and signature validation.
3. **Fail-Safe Autonomous Defaults**: If ground authentication links are severed, onboard crew credentials automatically retain life-support triage access to ensure emergency countermeasures can be deployed without artificial access lockouts.

