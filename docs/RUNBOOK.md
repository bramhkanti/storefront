# Operational Runbook & Site Reliability Guide

> Production operational manual for maintaining, monitoring, troubleshooting, and deploying **Bramhkanti** (`bramhkanti.com`).

---

## 1. Service Overview & Ports

| Component               | Container Name | Internal Port |  External Port   | Healthcheck Endpoint |
| ----------------------- | -------------- | :-----------: | :--------------: | -------------------- |
| **Next.js Storefront**  | `storefront`   |    `3000`     | Exposed to Caddy | `GET /api/health`    |
| **Caddy Reverse Proxy** | `caddy`        |  `80`, `443`  |   `80`, `443`    | TCP port probe       |

---

## 2. Deployment Procedures

### Standard Production Deployment (Docker Compose)

To deploy the latest release:

```bash
# 1. Pull latest code
git pull origin main

# 2. Build and restart containers with zero downtime
docker compose up -d --build

# 3. Verify container status
docker compose ps

# 4. Verify application health probe
curl -f http://localhost:3000/api/health
```

Expected healthcheck response:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "adapter": "mock",
  "uptime": 124.5,
  "timestamp": "2026-10-12T03:30:00.000Z"
}
```

---

## 3. Cache Invalidation Playbook

Next.js 16 caches catalog queries on the server. When products, prices, or inventory update in Medusa, invoke the on-demand revalidation endpoint:

### Revalidation Endpoint Details:

- **URL**: `POST https://bramhkanti.com/api/revalidate`
- **Header**: `x-revalidate-secret: <REVALIDATE_SECRET>` (min 32 characters)
- **Rate Limit**: 30 requests per minute with burst of 10.

### Operations:

#### 1. Invalidate Entire Catalog

```bash
curl -X POST https://bramhkanti.com/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag": "catalog"}'
```

#### 2. Invalidate a Specific Product

```bash
curl -X POST https://bramhkanti.com/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag": "product:heritage-aam-ka-achar"}'
```

#### 3. Invalidate Category Taxonomy & Navigation

```bash
curl -X POST https://bramhkanti.com/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag": "categories"}'
```

---

## 4. Live Medusa Cutover Procedure

To switch the storefront from the built-in `MockAdapter` to your live Medusa.js v2 backend:

1. Update your production `.env` or `docker-compose.yml` environment variables:
   ```env
   # Switch active adapter
   API_ADAPTER=medusa

   # Live Medusa API endpoint
   API_BASE_URL=https://api.bramhkanti.com

   # Medusa Publishable API key
   MEDUSA_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
   MEDUSA_REGION_ID=reg_in

   # HTTP Client Resiliency
   API_TIMEOUT_MS=8000
   API_MAX_RETRIES=2
   ```
2. Restart the storefront container:
   ```bash
   docker compose up -d --no-deps storefront
   ```
3. Inspect `GET /api/health` to confirm the Medusa connection:
   ```json
   {
     "status": "ok",
     "adapter": "medusa",
     "medusaPing": "connected"
   }
   ```
   **Zero code changes or rebuilds are required.**

---

## 5. Troubleshooting & Incident Response

### Issue 1: Container Fails Healthcheck / Restarts Loop

- **Symptom**: `docker compose ps` reports `(unhealthy)`.
- **Remedy**:
  1. Inspect logs: `docker compose logs storefront --tail=100`.
  2. Check memory limits: Node 24 runtime requires at least 512MB RAM.
  3. Verify port 3000 isn't bound by an external process: `lsof -i :3000`.

### Issue 2: 502 Bad Gateway from Caddy

- **Symptom**: Visitors see a Caddy 502 error page.
- **Remedy**:
  1. Verify the `storefront` container is running on the shared docker network: `docker network inspect bramhkanti_default`.
  2. Test internal connectivity from within the Caddy container:
     ```bash
     docker compose exec caddy wget -qO- http://storefront:3000/api/health
     ```

### Issue 3: Rate Limit Exceeded (HTTP 429) on /api/revalidate

- **Symptom**: Automated webhooks receive `429 Too Many Requests`.
- **Remedy**:
  1. Batch invalidation requests instead of firing per-item webhooks. Invalidate the parent `catalog` or `categories` tag rather than 50 individual product tags.
  2. Wait 60 seconds for the Token Bucket rate limiter to replenish tokens.

---

## 6. Rollback Playbook

If a critical production defect is detected:

```bash
# 1. Revert to previous git release tag or commit
git checkout HEAD~1

# 2. Recompile and restart with standalone build
docker compose up -d --build

# 3. Invalidate edge CDN cache
curl -X POST https://bramhkanti.com/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag": "catalog"}'

# 4. Verify health
curl -f https://bramhkanti.com/api/health
```
