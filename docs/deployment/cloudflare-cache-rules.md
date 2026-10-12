# Cloudflare CDN & Edge Cache Configuration for Bramhkanti

This document details the exact Cloudflare Cache Rules, Page Rules, and Edge SSL settings for `bramhkanti.com`.

---

## 1. Overview & Multi-Layer Caching Architecture

The storefront employs three distinct caching layers:

1. **Browser / Client Cache**: Long-lived for hashed static bundles; ephemeral for dynamic HTML.
2. **Cloudflare Edge CDN**: Caches static assets globally across 300+ PoPs; respects Next.js 16 `cacheLife` headers for catalog pages.
3. **Next.js 16 Origin Cache**: Server-side `'use cache'`, PPR (Partial Prerendering), and ISR tags.

---

## 2. Cloudflare Cache Rules (Rules > Cache Rules)

Create the following rules in order of execution:

### Rule 1: Immutable Static Bundles (Highest Priority)

- **Rule Name**: `Next.js Static Assets (Immutable)`
- **Expression**:
  ```text
  (http.request.uri.path starts_with "/_next/static/")
  ```
- **Cache Eligibility**: Eligible for cache
- **Edge TTL**: Override origin &rarr; **1 Year** (31,536,000 seconds)
- **Browser TTL**: Respect origin headers (`public, max-age=31536000, immutable`)
- **Serve stale content while revalidating**: Enabled

### Rule 2: Transactional & Private Endpoints (Bypass Cache)

- **Rule Name**: `Bypass Cart, Checkout & API`
- **Expression**:
  ```text
  (http.request.uri.path starts_with "/api/") or
  (http.request.uri.path starts_with "/cart") or
  (http.request.uri.path starts_with "/checkout") or
  (http.cookie contains "bramhkanti_cart_id")
  ```
- **Cache Eligibility**: Bypass cache
- **Origin Cache Control**: Respect origin

### Rule 3: Public Catalog HTML Pages

- **Rule Name**: `Catalog Pages & Hubs`
- **Expression**:
  ```text
  (http.request.uri.path eq "/") or
  (http.request.uri.path starts_with "/products/") or
  (http.request.uri.path starts_with "/collections") or
  (http.request.uri.path matches "^/(achar|sweets|makhana).*$")
  ```
- **Cache Eligibility**: Eligible for cache
- **Edge TTL**: Respect origin headers (Next.js 16 sends `s-maxage=900, stale-while-revalidate=85500`)
- **Browser TTL**: Respect origin headers
- **Serve stale content while revalidating**: Enabled

---

## 3. SSL / TLS & Security Configuration

1. **Encryption Mode**: **Full (Strict)**
   - Requires valid TLS certificate between Cloudflare and Caddy origin (managed automatically by Caddy's ACME/Let's Encrypt).
2. **Minimum TLS Version**: **TLS 1.3** (or TLS 1.2 minimum fallback).
3. **Always Use HTTPS**: Enabled.
4. **Automatic HTTPS Rewrites**: Enabled.
5. **HTTP/2 & HTTP/3 (QUIC)**: Enabled for ultra-low latency mobile page loads.

---

## 4. WAF & Rate Limiting for Webhooks

- **Endpoint**: `POST /api/revalidate`
- **Rule**:
  ```text
  (http.request.uri.path eq "/api/revalidate" and http.request.method eq "POST")
  ```
- **Action**: Rate Limit &rarr; 60 requests per minute per IP.
- **Header Verification**: Enforces `x-revalidate-secret` presence at the edge before hitting the origin server.
