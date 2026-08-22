# jitsi-keycloak

![Build Status](https://img.shields.io/github/actions/workflow/status/d3473r/jitsi-keycloak/docker-image.yml)
![Latest Version](https://img.shields.io/github/v/tag/d3473r/jitsi-keycloak?label=Latest%20Version)
![Docker Pulls](https://img.shields.io/docker/pulls/d3473r/jitsi-keycloak)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/d3473r/jitsi-keycloak/latest)

A [Jitsi Meet](https://jitsi.org) authentication bridge that integrates [Keycloak](https://www.keycloak.org) (OIDC) with Jitsi Meet. Users log in via Keycloak, and the app generates a signed JWT that Jitsi uses to authenticate the user into a meeting room.

Built with **Nuxt 3**, **TailwindCSS**, and **Nitro**.

## Installation

```bash
npm install
```

## Configuration

### Keycloak

- Add a public openid-connect client in your Keycloak realm
- Download the `keycloak.json` file for your client and put it in the `config` directory
- Allow this app from Keycloak (`jitsi-keycloak` running on https://auth.meet.example.com)

- If you want to have an avatar displayed in Jitsi, add an avatar custom attribute in Keycloak to your desired users

### Jitsi

- Set `ENABLE_AUTH=1`, `AUTH_TYPE=jwt` and `JWT_APP_ID=jitsi` in your Jitsi environment
- Set `JWT_APP_SECRET` to a random string (e.g. `node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"`)
- To enable an automatic redirect from Jitsi to login, set the URL of this container: `TOKEN_AUTH_URL=https://auth.example.com/{room}`
- To enable the guest lobby feature for every new room, add `XMPP_MODULES=muc_lobby_rooms,persistent_lobby` and `XMPP_MUC_MODULES=lobby_autostart,token_lobby_bypass`. The `lobby_bypass` attribute is automatically enabled for every logged-in user.

### Environment Variables

Create a `.env` file (see `.env.example`) or pass the following as environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `JITSI_SECRET` | Shared secret from Jitsi (`JWT_APP_SECRET`) | - |
| `DEFAULT_ROOM` | Default room name | - |
| `JITSI_URL` | URL of your Jitsi server | - |
| `ALLOWED_SUB` | Allowed sub in JWT | `*` |
| `ALLOWED_ROOM` | Allowed room in JWT | `*` |
| `KEYCLOAK_CONFIG_PATH` | Path to `keycloak.json` | `./config/keycloak.json` |

## Run

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
node .output/server/index.mjs
```

## Build with Docker

```bash
docker build -t jitsi-keycloak .
```

## Run with Docker

```bash
docker run -it --rm -p 3000:3000 -v $(pwd)/config:/app/config jitsi-keycloak
```

## Run with Docker Compose

```bash
cd example
docker-compose up -d
```

## Architecture

| Layer | Technology |
|-------|-----------|
| **Full-stack** | Nuxt 3 (Nitro server engine) |
| **UI** | TailwindCSS |
| **Client auth** | keycloak-js (OIDC) |
| **Server auth** | JWT verification via Keycloak JWKS |
| **JWT signing** | jsonwebtoken |

### API Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/config` | Bearer token | Returns Jitsi JWT + Jitsi URL + default room |
| `GET /api/invite?name=` | Bearer token | Signs a guest JWT |
| `GET /api/keycloak.json` | Public | Serves Keycloak config to client |
