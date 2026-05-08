# Goove Web

[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/next.js-16-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Lint](https://img.shields.io/badge/lint-eslint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)

Goove Web is a responsive web control panel for RGBIC lights, inspired by the Govee app experience and designed for LAN-first device control.  
It provides a modular frontend architecture that can evolve from mock-based development to real network transport with minimal UI coupling.

## Why this project exists

Most mobile-first smart lighting apps provide polished UX but limited desktop workflows and weak interoperability for local automation.  
Goove Web addresses this gap with:

- A desktop and mobile-friendly control surface
- An internal API boundary between UI and device transport
- A domain-driven model for devices, scenes, segments, and effects
- A foundation for local-network control and future automation features

## Core capabilities

- Responsive application shell with:
  - desktop sidebar navigation
  - mobile bottom navigation
- Device management UI (power, status, brightness controls)
- Scene and automation-oriented pages for future expansion
- Built-in bilingual interface support (Portuguese and English)
- Internal Next.js API routes for device listing and state updates
- Mock-first LAN service layer for safe development without hardware
- Manual IP fallback flow for devices that are not discovered automatically
- Model adapter registry for progressive real-LAN integration by device family

## Architecture at a glance

Goove Web follows a layered structure:

1. **Presentation layer** (`app`, `components`)  
   User interface and interaction flows.
2. **Application/API layer** (`app/api`)  
   Route handlers used by the frontend to avoid direct transport coupling.
3. **Domain + state layer** (`lib/domain`, `lib/state`, `lib/mocks`)  
   Shared data contracts, state transitions, and development fixtures.
4. **Infrastructure layer** (`lib/govee`)  
   LAN discovery and command client abstractions.

This separation enables transport changes (mock, UDP, vendor adapters) without requiring broad UI rewrites.

## Repository structure

```text
app/
  (dashboard)/            # Main app shell and top-level pages
  api/                    # Internal API route handlers
components/
  devices/                # Device-focused UI blocks
  layout/                 # Responsive shell and navigation
  providers/              # Theme and language providers
  ui/                     # shadcn/ui primitives
lib/
  domain/                 # Domain entities and shared types
  govee/                  # LAN discovery and control abstractions
  i18n/                   # Translation dictionaries
  mocks/                  # Mock fixtures for local development
  state/                  # Zustand global store
docs/
  adr/                    # Architecture Decision Records
```

## Screenshots and demos

Use this section to present the product experience for contributors and stakeholders.

- `docs/media/dashboard-desktop.png` - Main dashboard on desktop layout
- `docs/media/devices-mobile.png` - Devices page on mobile layout
- `docs/media/brightness-control.gif` - Brightness slider and quick controls interaction

Example markdown snippet:

```md
![Dashboard (Desktop)](docs/media/dashboard-desktop.png)
![Devices (Mobile)](docs/media/devices-mobile.png)
![Brightness Control](docs/media/brightness-control.gif)
```

PRs use a default template with a screenshot checklist at `.github/pull_request_template.md`.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Run in development mode

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Quality checks

Run static analysis before opening a pull request:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Build production bundle locally before release:

```bash
pnpm build
```

## Lighthouse mobile checklist

Use this checklist before tagging a release:

- Run Lighthouse on mobile profile against a production build (never `next dev`).
- Recommended flow:
  - `pnpm build`
  - `pnpm exec next start -p 3001`
  - `pnpm dlx lighthouse "http://localhost:3001" --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo`
- Verify no critical accessibility errors (labels, contrast, focus visibility, tap targets).
- Confirm there are no layout shifts during first paint and initial device sync.
- Validate interaction latency on brightness controls and device toggle actions.
- Capture and store the audit report summary in the pull request description.

## API overview

### `GET /api/devices`

Returns the current list of discovered devices (mock/in-memory in local development).

### `PATCH /api/devices/[id]/state`

Updates device state with partial payload support:

- `power` (`"on"` | `"off"`)
- `brightness` (`0-100`)
- `color` (hex string)

The route validates payloads and returns clear `400` responses for invalid data.

### `POST /api/devices`

Registers a manual device for LAN fallback scenarios.

- `ip` (required, valid IPv4)
- `name` (optional)
- `model` (optional)

### `GET /api/system/status`

Returns active LAN runtime mode flags used by the UI status indicator:

- `adapterEnabled`
- `transportMode` (`mock` | `udp`)
- `discoveryMode` (`mock` | `udp`)
- `debugEnabled`

## LAN adapter architecture

The LAN control layer supports model-aware adapters:

- `lib/govee/adapters/types.ts`: adapter contract
- `lib/govee/adapters/registry.ts`: adapter resolution by model
- `lib/govee/adapters/h6-rgbic-adapter.ts`: baseline adapter for `H6*` models
- `lib/govee/protocol/h6-commands.ts`: command builders
- `lib/govee/protocol/discovery.ts`: discovery request/response helpers
- `lib/govee/transport/udp.ts`: UDP transport helper
- `lib/govee/transport/discovery-udp.ts`: UDP discovery helper

You can disable adapter execution through:

- `GOVEE_LAN_ADAPTER_ENABLED=false`
- `GOVEE_LAN_TRANSPORT=mock|udp` (default: `mock`)
- `GOVEE_LAN_UDP_PORT=4003` (optional override)
- `GOVEE_LAN_DISCOVERY_MODE=mock|udp` (default: `mock`)
- `GOVEE_LAN_DISCOVERY_PORT=4001` (optional override)
- `GOVEE_LAN_DISCOVERY_BROADCAST=255.255.255.255` (optional override)
- `GOVEE_LAN_DISCOVERY_TIMEOUT_MS=1200` (optional override)
- `GOVEE_DEBUG=true|false` (default: `false`)

When no adapter matches a model, the system falls back to in-memory patch behavior.
When UDP discovery fails or returns no devices, the system safely falls back to mock devices.
Dashboard and Devices pages display a live system-mode badge so users can verify whether runtime is mock or real LAN.

## Internationalization

Language dictionaries are defined in `lib/i18n/dictionaries.ts` and exposed through a client language provider.  
Current supported locales:

- `pt` (Portuguese)
- `en` (English)

The selected language is persisted locally in the browser.

## Device synchronization and resilience

- The UI syncs devices from `/api/devices` on startup and periodically (15s).
- Device actions (power/brightness) are persisted through `/api/devices/[id]/state`.
- Settings page supports manual device registration by IP when discovery is incomplete.
- Network/API failures are surfaced through inline error states with retry actions.
- Loading and empty-state feedback is provided when discovery returns no devices.
- Background polling is visibility-aware and avoids sync calls when the tab is hidden.
- Brightness slider uses draft interaction and commits changes on interaction end, reducing request bursts.
- Service-layer tests live in `lib/govee/__tests__/lan-client.test.ts`.

## Design and UX principles

- Mobile-first layout with desktop parity
- Clear interaction affordances for frequent actions
- Fast, glanceable device status
- Progressive enhancement toward real-time and LAN-native behavior
- Accessible controls with descriptive labels and disabled states for offline devices

## Roadmap

- Robust error/reconnection states in UI and service layer
- Service-level tests and request payload validation
- Accessibility and mobile Lighthouse performance hardening
- Real LAN transport integration with model-specific adapters

## Architecture decisions (ADR)

Architectural decisions are documented under `docs/adr`.

- [`ADR-0001: Layered architecture and LAN abstraction`](docs/adr/0001-layered-architecture-and-lan-abstraction.md)

## Contributing

1. Create a feature branch from `main`
2. Keep changes focused and documented
3. Run `pnpm typecheck` and `pnpm lint`
4. Open a pull request with:
   - problem statement
   - implementation rationale
   - test/validation notes

## License

This project is licensed under the [MIT License](./LICENSE).
