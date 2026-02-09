# Donut Backend Architecture

This backend is designed as a **modular monolith** with **clear internal boundaries**, so it can scale today without microservices and still be **cleanly split in the future** if required.

The core idea is simple:

> **Two different systems live in one codebase and one process — but they never mix responsibilities.**

---

## High-Level Mental Model

The backend is divided into two conceptual planes:

```

┌──────────────────────────┐
│  CONTROL PLANE           │  (Platform / Product logic)
└──────────┬───────────────┘
│  immutable contracts
▼
┌──────────────────────────┐
│  DATA PLANE              │  (Runtime / Execution engine)
└──────────────────────────┘

```

- **Control Plane** decides _what_ should exist and _what_ is allowed
- **Data Plane** executes workflows and handles runtime logic
- They only communicate through **explicit contracts**

This keeps the system:

- Easy to reason about
- Easy to scale horizontally
- Easy to split later without rewrites

---

## Folder Structure Overview

```

src/
├── control_plane/   # Platform & product logic
├── data_plane/      # Runtime & execution engine
├── boundary/        # Shared contracts between planes
├── infra/           # Infrastructure & plumbing
├── server.rs        # HTTP routing & middleware
└── main.rs          # Application entry point

```

---

## `control_plane/` — Platform Backend (Control Plane)

This folder contains **everything users interact with**.

If it appears in the dashboard, billing page, or workflow editor, it belongs here.

```

control_plane/
├── auth/           # Authentication & API keys
├── orgs/           # Organizations & teams
├── projects/       # Project management
├── workflows/      # Workflow canvas & compilation
├── deployment/     # Versioning & publishing
├── billing/        # Plans, quotas, metering rules
├── permissions/    # Access control & roles
└── storage/        # Platform database (Postgres)

```

### What the Control Plane does

- User authentication & authorization
- Workflow creation and editing
- Validation and compilation of workflows
- Billing and subscription enforcement
- Deployment and version management

### What it never does

- ❌ Execute workflows
- ❌ Access SurrealDB user data
- ❌ Call agents or tools
- ❌ Run user-defined logic

It **decides**, but never **executes**.

---

### `control_plane/workflows/`

This is the most important submodule.

```

workflows/
├── canvas.rs      # UI-level graph representation
├── compiler.rs    # Converts canvas → execution graph
└── artifacts.rs   # Produces immutable execution artifacts

```

- **canvas.rs**  
  Stores and validates the node graph exactly as the user designs it.

- **compiler.rs**  
  Converts the visual graph into an execution-ready structure.
  UI concepts are stripped out here.

- **artifacts.rs**  
  Wraps the compiled graph with limits, permissions, and versioning
  to produce an `ExecutionArtifact`.

This artifact is the **only thing handed to the runtime**.

---

## `data_plane/` — Runtime Engine (Data Plane)

This folder contains **everything that executes workflows**.

```

data_plane/
├── engine/          # Core execution logic
├── graph/           # Compiled graph handling
├── nodes/           # All executable nodes
├── triggers/        # HTTP / WS / cron entry points
├── agents/          # Agentic workflows & LLM calls
├── surreal/         # SurrealDB integration
└── observability/   # Logs, metrics, runtime events

```

### What the Data Plane does

- Executes compiled workflows
- Handles HTTP, WebSocket, and async triggers
- Runs agentic and non-agentic workflows
- Reads and writes user data (SurrealDB)
- Enforces execution limits

### What it never does

- ❌ Authenticate users
- ❌ Manage billing or subscriptions
- ❌ Modify platform state
- ❌ Know about UI or canvas concepts

It **executes**, but never **decides**.

---

### `data_plane/engine/`

The heart of the runtime.

```

engine/
├── executor.rs     # Walks and executes the graph
├── scheduler.rs    # Async jobs, retries, delays
└── context.rs      # Execution context passed to nodes

```

- All nodes operate on a shared `ExecutionContext`
- No global state is used
- Execution is stateless and horizontally scalable

---

## `boundary/` — Shared Contracts (Critical)

This folder defines the **only shared types** between control and data planes.

```

boundary/
├── artifacts.rs    # ExecutionArtifact definition
├── events.rs       # Runtime → platform events
├── limits.rs       # Shared execution limits
└── errors.rs       # Shared error vocabulary

```

### Rules for this folder

- Serializable types only
- No database models
- No business logic
- No side effects

If the system is ever split into separate services, **this folder becomes the API contract**.

---

## `infra/` — Infrastructure & Plumbing

```

infra/
├── queue.rs        # Message queues
├── cache.rs        # Caching (Redis, etc.)
└── config.rs       # Environment & feature flags

```

This is low-level glue code:

- No domain logic
- No workflow logic
- No business rules

---

## Request Lifecycle (Example)

1. User edits a workflow  
   → handled by **control_plane**

2. Workflow is compiled and deployed  
   → `ExecutionArtifact` is created

3. HTTP request or event arrives  
   → handled by **data_plane**

4. Runtime executes the workflow  
   → nodes run, DB queried, agents invoked

5. Runtime emits events  
   → control plane updates usage & billing

No circular dependencies. No shared state.

---

## Why This Architecture Exists

- Enables **horizontal scaling** without microservices
- Prevents accidental coupling
- Makes future separation cheap and safe
- Keeps execution fast and predictable
- Optimized for a small team moving fast

> **This is not a microservice architecture.  
> It is a disciplined monolith.**

---

## Key Rules (Do Not Break)

1. Control plane never imports data plane code
2. Data plane never imports control plane code
3. All cross-boundary communication goes through `boundary/`
4. Execution artifacts are immutable
5. Runtime is stateless

If these rules are followed, the architecture will scale cleanly for years.

---

## Summary

- **control_plane** → product & decisions
- **data_plane** → execution & runtime
- **boundary** → contracts & guarantees
- **infra** → plumbing

This structure gives the speed of a monolith today and the flexibility of services tomorrow — without premature complexity.
