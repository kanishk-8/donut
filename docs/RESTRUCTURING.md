# Backend Restructuring Plan

## Overview

This document outlines the proposed changes to align the backend structure with the **node-based architecture vision** described in `idea.md`. The current implementation is a traditional REST API, but the goal is to build a **compiler + runtime system** for visual backend creation.

---

## Current Problems

### 1. **Architectural Mismatch**
- **Current:** Traditional Axum REST API with auth
- **Vision:** Node graph compiler + runtime execution engine
- **Gap:** No runtime engine, no nodes, no graph execution

### 2. **Critical Empty Folders**
```
backend/src/nodes/      ← Should contain all node implementations
backend/src/runtime/    ← THE CORE of the entire system
backend/src/platform/   ← Projects, canvas, deployment management
```

### 3. **Misplaced Code**
- `src/core/` is a dumping ground for auth, models, errors
- Auth logic belongs in `platform/auth/`
- No separation between platform backend and user runtime

### 4. **Missing Components**
- No `Node` trait definition
- No execution `Context`
- No graph `Engine`
- No `Compiler`
- No canvas/project storage
- No deployment system

---

## Proposed Structure

```
backend/
├── src/
│   ├── main.rs
│   │
│   ├── platform/              # Platform backend (your product)
│   │   ├── mod.rs
│   │   │
│   │   ├── auth/              # Platform user authentication
│   │   │   ├── mod.rs
│   │   │   ├── handlers.rs    # login, signup, logout for platform
│   │   │   ├── middleware.rs  # JWT auth middleware
│   │   │   └── models.rs      # User, Claims, AuthResponse
│   │   │
│   │   ├── projects/          # User project management
│   │   │   ├── mod.rs
│   │   │   ├── handlers.rs    # CRUD operations
│   │   │   ├── repository.rs  # DB queries
│   │   │   └── models.rs      # Project, ProjectConfig
│   │   │
│   │   ├── canvas/            # Node graph storage
│   │   │   ├── mod.rs
│   │   │   ├── handlers.rs    # Save/load graphs
│   │   │   ├── repository.rs  # Graph persistence
│   │   │   └── models.rs      # NodeGraph, NodeConfig, Edge
│   │   │
│   │   ├── deployment/        # Graph compilation & deployment
│   │   │   ├── mod.rs
│   │   │   ├── compiler.rs    # Compile graph to executable
│   │   │   ├── validator.rs   # Validate graph structure
│   │   │   └── deployer.rs    # Deploy compiled graph
│   │   │
│   │   └── agents/            # Agent management
│   │       ├── mod.rs
│   │       ├── handlers.rs    # CRUD agents
│   │       ├── repository.rs  # Agent storage
│   │       └── models.rs      # Agent, AgentConfig
│   │
│   ├── runtime/               # ⭐ EXECUTION ENGINE (CORE)
│   │   ├── mod.rs
│   │   │
│   │   ├── engine.rs          # Graph execution orchestrator
│   │   │   # - Loads compiled graphs
│   │   │   # - Manages execution flow
│   │   │   # - Handles node sequencing
│   │   │
│   │   ├── node.rs            # Node trait definition
│   │   │   # pub trait Node {
│   │   │   #     fn id(&self) -> NodeId;
│   │   │   #     fn execute(&self, ctx: &mut Context) -> NodeResult;
│   │   │   # }
│   │   │
│   │   ├── context.rs         # Execution context
│   │   │   # pub struct Context {
│   │   │   #     request: Request,
│   │   │   #     response: ResponseBuilder,
│   │   │   #     auth: AuthState,
│   │   │   #     db: DbAccess,
│   │   │   #     secrets: Secrets,
│   │   │   #     variables: HashMap,
│   │   │   # }
│   │   │
│   │   ├── scheduler.rs       # Async execution orchestration
│   │   │   # - Parallel node execution
│   │   │   # - Dependency resolution
│   │   │   # - Error handling
│   │   │
│   │   ├── sandbox.rs         # Security & isolation
│   │   │   # - Resource limits
│   │   │   # - Timeout enforcement
│   │   │   # - Permission checks
│   │   │
│   │   └── types.rs           # Common runtime types
│   │       # NodeId, NodeResult, ExecutionState
│   │
│   ├── nodes/                 # All user-facing nodes
│   │   ├── mod.rs
│   │   │
│   │   ├── core/              # Core flow nodes
│   │   │   ├── mod.rs
│   │   │   ├── request.rs     # Entry point (routes)
│   │   │   ├── response.rs    # Return response
│   │   │   ├── condition.rs   # If/else logic
│   │   │   ├── transform.rs   # Data transformation
│   │   │   └── variable.rs    # Set/get variables
│   │   │
│   │   ├── db/                # Database operation nodes
│   │   │   ├── mod.rs
│   │   │   ├── query.rs       # SELECT operations
│   │   │   ├── insert.rs      # INSERT operations
│   │   │   ├── update.rs      # UPDATE operations
│   │   │   ├── delete.rs      # DELETE operations
│   │   │   └── transaction.rs # Transaction wrapper
│   │   │
│   │   ├── auth/              # Authentication nodes
│   │   │   ├── mod.rs
│   │   │   ├── auth_check.rs  # Check if authenticated
│   │   │   ├── internal_auth.rs # Built-in auth (login/signup)
│   │   │   ├── clerk.rs       # Clerk integration
│   │   │   ├── jwt_verify.rs  # JWT validation
│   │   │   └── oauth.rs       # OAuth providers (future)
│   │   │
│   │   ├── integrations/      # External service nodes
│   │   │   ├── mod.rs
│   │   │   ├── http.rs        # HTTP requests
│   │   │   ├── stripe.rs      # Stripe payments
│   │   │   ├── webhook.rs     # Webhook receiver
│   │   │   ├── sendgrid.rs    # Email sending (future)
│   │   │   └── twilio.rs      # SMS sending (future)
│   │   │
│   │   └── agents/            # AI agent nodes
│   │       ├── mod.rs
│   │       ├── agent_call.rs  # Call single agent
│   │       ├── agent_chain.rs # Chain multiple agents
│   │       └── agent_loop.rs  # Iterative agent execution
│   │
│   ├── storage/               # Renamed from db/
│   │   ├── mod.rs
│   │   │
│   │   ├── database.rs        # Postgres connection & config
│   │   │   # - Connection pool
│   │   │   # - Migration runner
│   │   │
│   │   ├── cache.rs           # Redis cache (future)
│   │   │   # - Session storage
│   │   │   # - Graph cache
│   │   │
│   │   ├── queue.rs           # Message queue (future)
│   │   │   # - Async execution
│   │   │   # - Background jobs
│   │   │
│   │   ├── models.rs          # Database models
│   │   │   # User, Project, Graph, Agent, Data
│   │   │
│   │   └── repositories/      # Query modules
│   │       ├── mod.rs
│   │       ├── users.rs       # User queries
│   │       ├── projects.rs    # Project queries
│   │       ├── graphs.rs      # Graph queries
│   │       └── agents.rs      # Agent queries
│   │
│   ├── api/                   # Platform REST APIs
│   │   ├── mod.rs
│   │   │
│   │   ├── routes/            # Route definitions
│   │   │   ├── mod.rs
│   │   │   ├── auth.rs        # /auth/login, /auth/signup
│   │   │   ├── projects.rs    # /projects/*
│   │   │   ├── canvas.rs      # /canvas/*
│   │   │   ├── deployments.rs # /deployments/*
│   │   │   └── agents.rs      # /agents/*
│   │   │
│   │   ├── handlers/          # Request handlers
│   │   │   ├── mod.rs
│   │   │   └── (mirrors routes structure)
│   │   │
│   │   └── middleware/        # HTTP middleware
│   │       ├── mod.rs
│   │       ├── auth.rs        # JWT verification
│   │       ├── cors.rs        # CORS configuration
│   │       └── logging.rs     # Request logging
│   │
│   └── core/                  # Shared utilities
│       ├── mod.rs
│       │
│       ├── config.rs          # Application configuration
│       │   # - Environment variables
│       │   # - Service settings
│       │
│       ├── errors.rs          # Error types
│       │   # AppError enum with all variants
│       │
│       ├── auth/              # ⭐ SHARED auth utilities
│       │   ├── mod.rs
│       │   ├── crypto.rs      # Password hashing (reusable)
│       │   ├── jwt.rs         # JWT generation/verification (reusable)
│       │   └── session.rs     # Session management (reusable)
│       │
│       └── types.rs           # Common types
│           # Result types, ID types, etc.
│
├── migrations/
│   ├── 20250101000000_create_users_table.sql
│   ├── 20250102000000_create_projects_table.sql
│   ├── 20250103000000_create_graphs_table.sql
│   ├── 20250104000000_create_agents_table.sql
│   └── 20250105000000_create_data_table.sql
│
└── Cargo.toml
```

---

## Auth Sharing Strategy

### Question: Can we reuse auth for both platform and user backends?

**Answer: Yes, but with separation of concerns**

### Architecture

```
core/auth/              ← Shared utilities (crypto, JWT)
  ├── crypto.rs         ← Password hashing (Argon2)
  ├── jwt.rs            ← Token generation/verification
  └── session.rs        ← Session/cookie management

platform/auth/          ← Platform authentication
  ├── handlers.rs       ← Platform login/signup endpoints
  ├── middleware.rs     ← Platform auth middleware
  └── models.rs         ← Platform user models

nodes/auth/             ← Auth nodes for user-created backends
  ├── internal_auth.rs  ← Node: login/signup logic
  ├── auth_check.rs     ← Node: verify authentication
  ├── clerk.rs          ← Node: Clerk integration
  └── jwt_verify.rs     ← Node: custom JWT verification
```

### What Gets Shared?

#### ✅ **Shared (in `core/auth/`):**
1. **Password hashing** - `crypto.rs`
   - `password_hash()` - Hash passwords with Argon2
   - `password_verify()` - Verify password against hash
   
2. **JWT utilities** - `jwt.rs`
   - `generate_token()` - Create JWT tokens
   - `verify_token()` - Validate JWT tokens
   - `decode_claims()` - Extract claims
   
3. **Session management** - `session.rs`
   - `create_session_cookie()` - Generate cookies
   - `parse_cookie()` - Extract from cookies

#### ❌ **Not Shared:**
1. **Platform auth handlers** - Stay in `platform/auth/`
   - These handle YOUR platform's user login
   
2. **Auth nodes** - Stay in `nodes/auth/`
   - These are building blocks for user-created backends
   - They CALL the shared utilities but implement node interface

### Example Usage

#### Platform Auth (Platform Users Login):
```rust
// platform/auth/handlers.rs
use crate::core::auth::{crypto, jwt};

pub async fn login(request: LoginRequest) -> Result<AuthResponse> {
    let user = find_user(&request.email).await?;
    crypto::password_verify(&request.password, &user.password_hash)?;
    let token = jwt::generate_token(&user)?;
    Ok(AuthResponse { token, user })
}
```

#### Auth Node (User's Backend Uses This):
```rust
// nodes/auth/internal_auth.rs
use crate::core::auth::{crypto, jwt};
use crate::runtime::{Node, Context};

pub struct InternalAuthNode {
    config: AuthConfig,
}

impl Node for InternalAuthNode {
    fn execute(&self, ctx: &mut Context) -> NodeResult {
        let email = ctx.get_variable("email")?;
        let password = ctx.get_variable("password")?;
        
        // Reuse shared crypto utilities
        let user = ctx.db.find_user_by_email(email).await?;
        crypto::password_verify(password, &user.password_hash)?;
        
        // Reuse shared JWT utilities
        let token = jwt::generate_token(&user)?;
        
        ctx.auth.set_user(user);
        ctx.set_variable("token", token);
        Ok(())
    }
}
```

**Key Insight:** 
- Platform auth = Traditional REST handlers
- Node auth = Same logic wrapped in Node trait
- Both reuse `core/auth/` utilities

---

## Migration Steps

### Phase 1: Restructure Existing Code (No Breaking Changes)

1. **Create new folder structure**
   ```bash
   mkdir -p src/{platform,runtime,nodes,storage/repositories}
   mkdir -p src/platform/{auth,projects,canvas,deployment,agents}
   mkdir -p src/runtime
   mkdir -p src/nodes/{core,db,auth,integrations,agents}
   ```

2. **Move existing code:**
   - `src/core/auth/` → Keep in `src/core/auth/` (it's shared!)
   - `src/core/models.rs` → Split:
     - Auth models → `src/platform/auth/models.rs`
     - Other models → `src/storage/models.rs`
   - `src/db/` → `src/storage/`
   - `src/api/handlers/auth.rs` → `src/platform/auth/handlers.rs`
   - `src/api/routes/auth.rs` → `src/api/routes/auth.rs` (keep for now)

3. **Update imports** in moved files

4. **Update `main.rs`:**
   ```rust
   mod api;
   mod core;
   mod storage;     // renamed from db
   mod platform;    // new
   mod runtime;     // new
   mod nodes;       // new
   ```

### Phase 2: Build Core Runtime (New Features)

1. **Define Node trait** (`runtime/node.rs`)
2. **Build execution Context** (`runtime/context.rs`)
3. **Create execution Engine** (`runtime/engine.rs`)
4. **Implement scheduler** (`runtime/scheduler.rs`)

### Phase 3: Implement Basic Nodes

1. **Core nodes:** Request, Response
2. **Auth nodes:** AuthCheck, InternalAuth
3. **DB nodes:** Query, Insert

### Phase 4: Platform Features

1. **Projects module** - CRUD for user projects
2. **Canvas module** - Save/load node graphs
3. **Compiler** - Validate and compile graphs
4. **Deployment** - Execute compiled graphs

### Phase 5: Advanced Features

1. **Agent system**
2. **Integration nodes** (Stripe, HTTP, etc.)
3. **Sandbox & security**
4. **Horizontal scaling**

---

## Database Schema Changes

### New Tables Needed

#### `projects`
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### `graphs`
```sql
CREATE TABLE graphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    graph_data JSONB NOT NULL,  -- Node graph JSON
    is_deployed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, name, version)
);
```

#### `agents`
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,  -- Agent configuration
    version INTEGER NOT NULL DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### `data` (Multi-tenant user data)
```sql
CREATE TABLE data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    table_name VARCHAR(255) NOT NULL,
    row_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_table (project_id, table_name)
);
```

---

## File-Specific Changes

### `src/main.rs`
**Current:**
```rust
mod api;
mod core;
mod db;
```

**Proposed:**
```rust
mod api;
mod core;
mod storage;
mod platform;
mod runtime;
mod nodes;
```

### `src/core/models.rs`
**Action:** Split into multiple files

**Move to `src/platform/auth/models.rs`:**
- `LoginRequest`
- `SignUpRequest`
- `UpdatePasswordRequest`
- `ForgotPasswordRequest`
- `Claims`
- `TokenResponse`
- `AuthResponse`

**Move to `src/storage/models.rs`:**
- `User`
- `UserRole`

**New models needed:**
- `Project`, `Graph`, `Agent` in respective modules

### `src/api/routes/auth.rs`
**Fix:**
```rust
// Uncomment and implement middleware
let protected_routes = Router::new()
    .route("/update-password", post(update_password))
    .route("/logout", post(logout))
    .route_layer(from_fn_with_state(state.clone(), auth_middleware));
```

### `UserRole` enum
**Current:**
```rust
pub enum UserRole {
    Admin,
    PlatformUser,
    NodeUser,  // ← Confusing name
}
```

**Proposed:**
```rust
pub enum UserRole {
    Admin,
    User,  // Platform users (simplified)
}
```

**Reasoning:** There's no separate "NodeUser" - all platform users create backends using nodes.

---

## Key Principles

### 1. **Two Backends Concept**
- **Platform Backend** (`platform/`) - Manages users, projects, canvas
- **Runtime Engine** (`runtime/`) - Executes user-created graphs

### 2. **Everything is a Node**
All user-facing functionality must implement:
```rust
trait Node {
    fn execute(&self, ctx: &mut Context) -> NodeResult;
}
```

### 3. **Stateless Execution**
- No shared state between executions
- All state in `Context`
- Horizontally scalable

### 4. **Multi-Tenant Database**
- No per-user databases
- Logical isolation via `project_id`
- Shared infrastructure

### 5. **Shared Auth Utilities**
- `core/auth/` contains reusable crypto/JWT
- Platform and nodes both use these
- Separation at handler/node level

---

## Testing Strategy

### Unit Tests
- Each node in isolation
- Context mocking
- DB query tests

### Integration Tests
- Graph execution end-to-end
- API endpoint tests
- Auth flow tests

### Performance Tests
- Graph execution benchmarks
- Concurrent execution
- Database query optimization

---

## Open Questions

1. **Graph versioning strategy?**
   - How do we handle graph updates?
   - Rollback mechanism?

2. **Node marketplace?**
   - Allow users to publish custom nodes?
   - Security implications?

3. **Execution limits?**
   - Timeout per node?
   - Memory limits?
   - Rate limiting?

4. **Secrets management?**
   - How do users store API keys?
   - Encryption strategy?

5. **Multi-region deployment?**
   - Edge execution?
   - Data residency?

---

## Timeline Estimate

- **Phase 1 (Restructuring):** 1-2 days
- **Phase 2 (Runtime Core):** 1 week
- **Phase 3 (Basic Nodes):** 3-4 days
- **Phase 4 (Platform Features):** 1-2 weeks
- **Phase 5 (Advanced):** Ongoing

**Total MVP:** ~3-4 weeks

---

## Next Steps

1. ✅ Review this document
2. ⏳ Approve proposed structure
3. ⏳ Begin Phase 1: Restructure existing code
4. ⏳ Implement runtime engine
5. ⏳ Build first nodes
6. ⏳ Create project/canvas APIs
7. ⏳ Implement compiler & deployment

---

## References

- `docs/idea.md` - Original vision document
- `backend/src/*` - Current implementation
- Rust best practices: https://rust-lang.github.io/api-guidelines/
- Axum documentation: https://docs.rs/axum/latest/axum/
