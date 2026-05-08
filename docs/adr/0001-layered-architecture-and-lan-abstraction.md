# ADR-0001: Layered architecture and LAN abstraction

- **Status:** Accepted
- **Date:** 2026-05-08

## Context

The project needs to deliver a responsive RGBIC control UI quickly while remaining ready for real LAN integration.  
Device protocols may vary by model, and network discovery can be unstable depending on local topology.  
Directly coupling UI components to transport logic would increase change cost and implementation risk.

## Decision

Adopt a layered architecture with explicit boundaries:

1. **Presentation layer** (`app`, `components`) for UI and user interactions.
2. **Application/API layer** (`app/api`) for route handlers and request contracts.
3. **Domain/state layer** (`lib/domain`, `lib/state`, `lib/mocks`) for shared types and predictable client-side state transitions.
4. **Infrastructure layer** (`lib/govee`) for discovery and command transport implementations.

Use a mock-first strategy in infrastructure to unblock UI and state development before hardware-specific integration.

## Consequences

### Positive

- UI can evolve independently from transport protocol changes.
- API contracts become the stable integration surface.
- Development remains productive without requiring physical devices.
- Testing can target each layer with reduced setup complexity.

### Trade-offs

- Adds initial structure and extra files earlier in the project lifecycle.
- Requires discipline to keep concerns separated across layers.

## Follow-up

- Introduce payload validation at API boundaries.
- Add service-level tests for LAN client and discovery behavior.
- Extend infrastructure with model-specific adapters and manual IP fallback.
