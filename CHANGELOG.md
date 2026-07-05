# Changelog

All notable changes to `dagster-gateway` will be documented in this file.

## [Unreleased]

### Fixed

- Enforced that every platform entry matches the registry environment during config parsing.
- Hardened `make sync-version` so release config updates fail loudly when `gateway_image_name` or `gateway_image_tag` cannot be found.
- Defaulted the localhost sample registry to demo mode and documented explicit local OIDC opt-in.
- Improved the identity panel fallback so authenticated users can still display a stable identifier when richer profile claims are absent.

## [0.1.0] - 2026-07-05

### Added

- Initial Dagster gateway portal with OIDC and demo auth flows, static registry-driven platform routing, and container/release tooling.
