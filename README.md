# dagster-gateway

`dagster-gateway` is an authentication and authorization portal for Dagster Core. It authenticates users against Keycloak, reads the `groups` claim, and renders only the Dagster platform routes that are explicitly allowlisted for those groups.

## Current Scope

- React + TypeScript frontend with a desktop-first operational UI
- OIDC-ready frontend flow using `react-oidc-context` and Authorization Code + PKCE
- Static environment-scoped registry loaded from `public/config/*.json`
- Safe redirect enforcement so only registry-approved platform URLs can be opened
- Demo auth mode for local UI preview before the real `snd-dagster-gateway` client is bootstrapped in Keycloak

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file only if you want to pin explicit local env values:

```bash
cp .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

By default the project loads `/config/snd.registry.local.json` on `localhost`. That committed local registry now defaults to `authMode: "demo"`, so a fresh `npm run dev` opens the demo-preview flow without any extra setup. It still carries the sandbox issuer (`https://idp.apps.metasync.cc/realms/snd`) and `http://localhost:5173/` logout URI so you can switch the same local registry back to OIDC when needed.

Supported registry files:

- `/config/snd.registry.local.json`: local development on `localhost`
- `/config/snd.registry.public.json`: deployed sandbox gateway on `snd-dagster-gateway.apps.metasync.cc`
- `/config/prd.registry.public.json`: committed production-shaped sample for non-`snd` hosts and documentation
This repository commits all three sample registry files so the hostname-based fallback logic exists in source as well as in deployment. In Kubernetes deployments, the public registry files are still typically replaced or supplied by the GitOps overlay rather than treated as the final environment-specific assets.

## Release Workflow

`dagster-gateway` uses the semantic version in `package.json` as the source of truth for the container image tag.

Common tasks:

```bash
make install
make build-web
make test
make build-image
make push-image
make sync-version
```

Combined release flow:

```bash
make release
```

Version bump helpers:

```bash
make bump-patch
make bump-minor
make bump-major
```

`make sync-version` updates `../luban-ci/manifests/config/luban-dagster-gateway-config.yaml` so `gateway_image_tag` stays aligned with the app version and runtime image tag.

`make sync-version` and `make release` expect `luban-ci` to be checked out at `../luban-ci` by default. Override `LUBAN_CI_ROOT` if your local workspace uses a different path.

The default release settings target Harbor:

```bash
REGISTRY_SERVER=harbor.luban.metasync.cc
REGISTRY_NAMESPACE=luban-ci
```

This Harbor repository is intended to be the shared runtime image source for all Dagster Gateway deployments.

To keep Harbor writer credentials local to this repository, create `secrets/harbor.env` with:

```bash
REGISTRY_USERNAME=robot$...
REGISTRY_PASSWORD=...
```

`Makefile.env` includes that file only when it exists, and `.gitignore` excludes it from version control.

## Runtime Configuration

Environment variables:

- `VITE_GATEWAY_AUTH_MODE`
  - `demo`: local preview using seeded demo users from the registry
  - `oidc`: real Keycloak login flow
- `VITE_GATEWAY_REGISTRY_URL`
  - URL to the gateway registry JSON file

When `VITE_GATEWAY_REGISTRY_URL` is unset, the app resolves the default registry by hostname:

- `localhost` / `127.0.0.1` -> `/config/snd.registry.local.json`
- `snd-*` hosts -> `/config/snd.registry.public.json`
- other hosts -> `/config/prd.registry.public.json`

For real local OIDC testing, set `VITE_GATEWAY_AUTH_MODE=oidc` in `.env` or point `VITE_GATEWAY_REGISTRY_URL` at a registry JSON that declares `authMode: "oidc"`.

Registry fields:

- `environment`: `snd` or `prd`
- `displayName`: UI label for the environment
- `issuer`: OIDC issuer URL for the current environment
- `clientId`: Keycloak client id
- `postLogoutRedirectUri`: logout return target
- `platforms[]`: allowlisted Dagster destinations and required groups
- `demoUsers[]`: local preview identities

## Sandbox OIDC Setup

For real sandbox login, keep `VITE_GATEWAY_AUTH_MODE=oidc` and bootstrap a Keycloak client with these settings:

- realm: `snd`
- client id: `snd-dagster-gateway`
- local issuer: `https://idp.apps.metasync.cc/realms/snd`
- direct local cluster issuer: `https://idp.apps.k8s.orb.local/realms/snd`
- deployed issuer: `https://idp.apps.metasync.cc/realms/snd`
- redirect URI: `http://localhost:5173/oidc/callback` for local dev
- redirect URI: `https://snd-dagster-gateway.apps.k8s.orb.local/oidc/callback` for local cluster use
- redirect URI: `https://snd-dagster-gateway.apps.metasync.cc/oidc/callback` for cluster use
- logout redirect URI: `/`
- token claim used for filtering: `groups`

The current sandbox realm already exposes a flat `groups` claim. The registry sample intentionally includes one route requiring `dagster-access` so the existing `alice.dagster` bootstrap user has a visible platform once the client exists. If local DNS is unavailable, you can still point the registry to an alternate issuer through `VITE_GATEWAY_REGISTRY_URL`.

Bootstrap sandbox users:

- `alice.dagster` / `change-me-snd-alice`
- `blocked.dagster` / `change-me-snd-blocked`

`alice.dagster` is in the `dagster-access` group and should see the initial sandbox platform. `blocked.dagster` has no access group and is useful for validating the denied/empty-state experience.

## Quality Checks

```bash
npm run check
npm run lint
npm test
npm run build
```

## Container Build

The repository includes a production `Dockerfile` and `nginx.conf` for serving the built frontend as a static site with SPA route fallback support.
