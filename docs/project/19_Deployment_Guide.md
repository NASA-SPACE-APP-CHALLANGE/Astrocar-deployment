# AstroCare – Production Deployment Guide

## 1. Overview and Deployment Models

AstroCare can be deployed across multiple environments depending on mission needs:
1. **Local Mission Console / Edge Flight Node**: Running directly on an onboard vehicle workstation or local laptop with zero internet connectivity.
2. **Standard Docker Container Stack**: Unified multi-container deployment using Docker and Docker Compose.
3. **Enterprise Cloud / Ground Control Center**: Scaled deployment with static CDN frontend hosting, containerized FastAPI backend workers, and managed PostgreSQL storage.

---

## 2. Frontend Production Build

The frontend is built using TypeScript, React 19, and Vite.

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Build Production Bundle
```bash
npm run build
```
This runs `tsc -b` for strict type checking followed by `vite build`. Optimized static distribution assets are emitted to `frontend/dist/`.

### Chunk Distribution Characteristics
- `index.html` (entry)
- `dist/assets/index-[hash].js` (~342 kB core application bundle)
- `dist/assets/react-vendor-[hash].js` (React, React-DOM, React Router)
- `dist/assets/chart-vendor-[hash].js` (Recharts & D3 dependencies)
- `dist/assets/lucide-vendor-[hash].js` (Vector iconography)
- `dist/assets/index-[hash].css` (~65 kB consolidated CSS bundle)

---

## 3. Nginx Reverse Proxy Configuration

For production ground stations and web servers, serve static files with Nginx and proxy API / WebSocket requests to the FastAPI backend:

```nginx
server {
    listen 80;
    server_name astrocare.mission.nasa.gov;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name astrocare.mission.nasa.gov;

    ssl_certificate /etc/ssl/certs/astrocare.crt;
    ssl_certificate_key /etc/ssl/private/astrocare.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Static Frontend SPA Assets
    root /var/www/astrocare/frontend/dist;
    index index.html;

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # REST API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Telemetry Stream Proxy
    location /ws/ {
        proxy_pass http://127.0.0.1:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Backend Deployment with Gunicorn / Uvicorn

In production, run FastAPI behind Gunicorn with Uvicorn worker processes:

```bash
cd backend

# Create virtual environment & install requirements
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Launch Gunicorn with 4 Uvicorn workers
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/astrocare/access.log \
    --error-logfile /var/log/astrocare/error.log \
    --daemon
```

---

## 5. Docker Multi-Stage Deployment

### `Dockerfile` (Unified Frontend & Static Hosting)
```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=sqlite:///./astrocare.db
      - SECRET_KEY=astrocare_flight_secret_key_change_in_prod
      - ALLOWED_ORIGINS=http://localhost,http://localhost:80
    ports:
      - "8000:8000"
    restart: always
```

---

## 6. Health Checks and Monitoring

- **Frontend Health**: `GET /` returns `200 OK` with HTML containing root `#root`.
- **Backend Health Endpoint**: `GET http://127.0.0.1:8000/api/health`
  - Response:
    ```json
    {
      "status": "online",
      "system": "AstroCare Biosensor Core",
      "version": "2.0.0",
      "timestamp": "2026-11-13T23:00:00Z"
    }
    ```
- **Automated Restart**: Ensure systemd service units or Docker `--restart unless-stopped` flags are enabled for unmanned edge nodes.

