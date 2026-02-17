# Donut Backend — Workspace Refactor Guide

## 🎯 Goal

Refactor the current single-crate backend into a **workspace-based modular monolith** so that:

- The **workflow engine** can be open-sourced in the future.
- The **platform logic** can remain closed-source.
- The system stays deployable as a single binary.
- Separation between engine and platform is enforced at compile-time.

This refactor does **NOT** introduce microservices.
It introduces **clean crate boundaries** inside one repository.

---

# 🧠 Target Architecture

After refactor, the backend should look like:

```
backend/
├── Cargo.toml                # Workspace root
│
├── crates/
│   ├── engine/               # 🔥 Future open-source workflow engine
│   ├── platform/             # 🔒 Closed-source platform logic
│   ├── boundary/             # Shared contracts (engine ↔ platform)
│   └── infra/                # Infrastructure adapters (DB, cache, etc.)
│
├── apps/
│   └── server/               # Final binary crate (composition root)
│
└── migrations/
```

---

# 🧩 Architectural Responsibilities

## 🔥 `engine` Crate (Open-Source Candidate)

Contains:

- Runtime execution engine
- Node trait
- Execution context
- Scheduler
- Sandbox
- All node implementations

Must NOT contain:

- User accounts
- Billing logic
- Project management
- Platform DB models
- Platform authentication

Engine must depend ONLY on:

- `boundary`
- Rust ecosystem crates

Engine must compile independently:

```bash
cargo build -p engine
```

---

## 🔒 `platform` Crate (Closed Source)

Contains:

- User authentication
- Projects
- Canvas storage
- Workflow compilation
- Deployment logic
- API routes
- Permissions

Platform does NOT execute workflows.

Platform produces:

```
ExecutionArtifact (defined in boundary)
```

---

## 🧩 `boundary` Crate (Contract Layer)

Contains only:

- ExecutionArtifact
- ExecutionLimits
- Shared error types
- Serializable execution types

Contains NO:

- Database logic
- Business logic
- Side effects

This crate is the future API contract if engine and platform split.

---

## 🏗 `infra` Crate (Infrastructure Layer)

Contains:

- Database pool
- Cache
- Queue
- Configuration
- Generic error types

Contains NO business logic.

---

## 🚀 `apps/server` (Composition Root)

Contains:

- `main.rs`
- HTTP server wiring
- Dependency injection
- Application startup logic

This crate ties together:

- engine
- platform
- infra

It should contain almost no domain logic.

---

# 🔄 Step-by-Step Migration Plan

Follow these steps in order.

---

## ✅ Phase 0 — Snapshot

Before refactoring:

```bash
git add .
git commit -m "pre-workspace refactor snapshot"
```

---

## ✅ Phase 1 — Convert to Workspace

### 1. Move Current Binary Into `apps/server`

```bash
mkdir -p apps/server
mv src apps/server/
mv Cargo.toml apps/server/Cargo.toml
```

Now create a new root `backend/Cargo.toml`:

```toml
[workspace]
members = [
    "crates/engine",
    "crates/platform",
    "crates/boundary",
    "crates/infra",
    "apps/server"
]

resolver = "2"
```

---

## ✅ Phase 2 — Create New Crates

From backend root:

```bash
cargo new crates/engine --lib
cargo new crates/platform --lib
cargo new crates/boundary --lib
cargo new crates/infra --lib
```

---

## ✅ Phase 3 — Move Engine Code

Move:

```
apps/server/src/runtime  → crates/engine/src/runtime
apps/server/src/nodes    → crates/engine/src/nodes
```

Update `crates/engine/src/lib.rs`:

```rust
pub mod runtime;
pub mod nodes;
```

---

## ✅ Phase 4 — Move Platform Code

Move:

```
apps/server/src/platform → crates/platform/src/
apps/server/src/api      → crates/platform/src/
```

Update `crates/platform/src/lib.rs`:

```rust
pub mod platform;
pub mod api;
```

---

## ✅ Phase 5 — Move Storage to Infra

Move:

```
apps/server/src/storage → crates/infra/src/
```

Update `crates/infra/src/lib.rs`:

```rust
pub mod storage;
```

---

## ✅ Phase 6 — Extract Shared Types into Boundary

Move shared execution-related types into:

```
crates/boundary/src/
```

Examples:

- ExecutionArtifact
- ExecutionLimits
- NodeId
- Shared runtime errors

Update `crates/boundary/src/lib.rs`:

```rust
pub mod artifacts;
pub mod limits;
pub mod errors;
```

---

## ✅ Phase 7 — Configure Dependencies

### `crates/engine/Cargo.toml`

```toml
[dependencies]
boundary = { path = "../boundary" }
serde = "1"
tokio = "1"
```

---

### `crates/platform/Cargo.toml`

```toml
[dependencies]
boundary = { path = "../boundary" }
infra = { path = "../infra" }
axum = "0.7"
serde = "1"
```

---

### `apps/server/Cargo.toml`

```toml
[dependencies]
engine = { path = "../../crates/engine" }
platform = { path = "../../crates/platform" }
infra = { path = "../../crates/infra" }
boundary = { path = "../../crates/boundary" }
```

---

## ✅ Phase 8 — Fix Cross-Crate Coupling

Engine must NOT import:

```rust
crate::platform::
crate::storage::
```

Instead, define traits inside engine:

```rust
pub trait DataStore {
    async fn query(&self, ...);
}
```

Platform or infra implements these traits.

Engine receives them via dependency injection.

---

## ✅ Phase 9 — Wire Everything in `apps/server`

In `apps/server/src/main.rs`:

```rust
use engine::runtime::engine::Engine;
use platform::api::routes::build_router;

#[tokio::main]
async fn main() {
    let engine = Engine::new();
    let app = build_router(engine);
}
```

This crate composes the system.

---

## ✅ Phase 10 — Verify Isolation

From backend root:

```bash
cargo build
cargo build -p engine
cargo build -p platform
```

Engine must build independently.

---

# 🚨 Architectural Rules (Do Not Break)

1. Engine must NEVER import platform.
2. Platform must NEVER import engine internals.
3. All shared types must live in boundary.
4. DB models must remain in platform or infra.
5. Engine communicates via traits only.
6. Apps/server contains no business logic.

---

# 🧠 Future Open-Source Plan

When ready to open-source:

1. Move `crates/engine` to public repo.
2. Move `crates/boundary` with it.
3. Keep `platform` private.
4. Keep frontend private.

No rewrite required.

---

# 🏁 End State

You will have:

- A modular monolith
- Strong separation
- Compile-time enforced boundaries
- Open-source ready engine
- Closed-source platform
- Single deployable binary
