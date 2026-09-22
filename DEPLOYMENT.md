# Nova Desk — Home Server Deployment Guide 🚀

This guide explains how to deploy **Nova Desk** on your home server using **Docker** and **Docker Compose**, with support for custom domains, reverse proxies (Caddy, Nginx, Traefik), and Cloudflare Tunnels.

---

## 📋 Prerequisites

- **Docker** (`>= 24.0.0`)
- **Docker Compose** (`>= v2.20.0`)
- Git

---

## ⚡ Quick Start (Docker Compose)

### 1. Clone the Repository
```bash
git clone https://github.com/radheshpai87/SaaSRBAC.git novadesk
cd novadesk
```

### 2. Configure Environment Variables
Create your production `.env` file:
```bash
cp .env.example .env
```

Generate a secure random secret for authentication:
```bash
openssl rand -base64 32
```

Update `.env`:
```env
# Production secret for NextAuth JWT encryption
AUTH_SECRET="your_generated_32_char_secret_key"

# Public URL of your instance (IP or domain name)
NEXTAUTH_URL="http://192.168.1.100:3000"
# OR with domain: NEXTAUTH_URL="https://desk.yourhomedomain.com"

# Exposed port on your host machine
PORT=3000
```

### 3. Launch the Container
```bash
docker compose up -d --build
```

### 4. Check Health & Logs
```bash
# Check container status
docker compose ps

# View live logs
docker compose logs -f novadesk
```

Open your browser at `http://<YOUR_SERVER_IP>:3000` or your configured domain.

---

## 🌐 Reverse Proxy Configuration

### Option A: Caddy (Recommended for Auto-HTTPS)
Add this to your `Caddyfile`:
```caddy
desk.yourhomedomain.com {
    reverse_proxy localhost:3000
}
```
Reload Caddy:
```bash
caddy reload
```

### Option B: Nginx
```nginx
server {
    listen 80;
    server_name desk.yourhomedomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option C: Cloudflare Tunnels (Zero Trust)
In your Cloudflare Zero Trust dashboard:
1. Go to **Access > Tunnels**.
2. Create a Public Hostname pointing to:
   - **Service Type**: `HTTP`
   - **URL**: `localhost:3000` (or container name `novadesk:3000` if in same network).

---

## 💾 Backup & Data Persistence

All embedded database states and uploaded artifacts are stored in the named Docker volume `novadesk-data`.

### Backup:
```bash
docker run --rm -v novadesk_novadesk-data:/data -v $(pwd):/backup alpine tar czf /backup/novadesk-backup-$(date +%F).tar.gz /data
```

### Restore:
```bash
docker run --rm -v novadesk_novadesk-data:/data -v $(pwd):/backup alpine tar xzf /backup/novadesk-backup-<date>.tar.gz -C /
```

---

## 🔄 Updates & Maintenance

To update to the latest version:
```bash
git pull origin master
docker compose down
docker compose up -d --build
```
