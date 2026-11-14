# 13 — Installation, Environment Configuration & Startup Guide

---

## 1. Prerequisites & System Requirements

### Hardware Requirements
- **CPU:** Dual-core 2.0 GHz or higher (x86_64 or ARM64 / Apple Silicon).
- **RAM:** Minimum 4 GB (8 GB recommended).
- **Storage:** Minimum 500 MB free space.

### Software Requirements
- **Node.js:** v18.0.0 or higher (v20+ recommended).
- **npm:** v9.0.0 or higher.
- **Python:** Python 3.10 to 3.14 (optional, for standalone backend execution).
- **Web Browser:** Modern Chromium (Chrome, Edge, Brave), Firefox, or Safari supporting CSS backdrop-filter.

---

## 2. Fast-Track Frontend Startup (Standalone / Client Resilient)

AstroCare’s frontend includes full client-side simulated telemetry and AI models, allowing complete standalone execution without requiring Python backend setup.

```bash
# 1. Clone or navigate to the project directory
cd /path/to/AstroCare-main

# 2. Navigate to frontend directory
cd frontend

# 3. Install npm dependencies
npm install

# 4. Start the Vite development server
npm run dev
```

The application will be accessible at:  
👉 **`http://localhost:5173/`** (or `http://127.0.0.1:5173/`)

---

## 3. Backend Setup & Configuration (FastAPI & SQLite)

To run the complete full-stack backend server:

```bash
# 1. Navigate to backend directory
cd /path/to/AstroCare-main/backend

# 2. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 3. Install Python requirements
pip install -r requirements.txt

# 4. Seed initial database records (generates 500 records)
python app/data/generate_dataset.py

# 5. Launch FastAPI via Uvicorn
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at:  
👉 **`http://127.0.0.1:8000/api/health`**  
👉 Interactive Swagger Docs: **`http://127.0.0.1:8000/api/docs`**

---

## 4. Production Build & Verification

```bash
# In frontend/ directory:
npm run build
```

Expected Output:
```
> astrocare-frontend@1.0.0 build
> tsc -b && vite build

vite v6.4.4 building for production...
✓ 2291 modules transformed.
dist/index.html                                   1.20 kB │ gzip:   0.60 kB
dist/assets/index-BkKK-Ba2.css                   10.10 kB │ gzip:   2.91 kB
dist/assets/index-DClD8wUl.js                   342.64 kB │ gzip: 111.16 kB
dist/assets/vendor-charts-Certfm2a.js           421.83 kB │ gzip: 113.59 kB
dist/assets/vendor-icons-CFtjW1dC.js             39.10 kB │ gzip:  10.04 kB
✓ built in 4.03s
```

To preview the production build locally:
```bash
npm run preview
```

