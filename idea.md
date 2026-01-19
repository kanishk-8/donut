# Node-Based Backend Architecture (n8n + Supabase Style)

## Purpose

Design a **scalable backend platform** where users can:

- Build backends using a **drag-and-drop canvas**
- Use **nodes** for auth, DB, logic, agents, and integrations
- Create APIs without writing backend code
- Get Supabase-like capabilities (auth, DB, backend) with n8n-like UX

This backend behaves more like a **compiler + runtime**, not a traditional server.

---

## Core Idea (Mental Model)

> **Everything the user builds is a node.**  
> The platform:
>
> 1. Stores node graphs
> 2. Compiles them
> 3. Executes them in a runtime engine

There are **two backends**:

1. **Platform Backend** – manages users, projects, billing, canvas
2. **User Backend Runtime** – executes user-created node graphs

---

## High-Level Architecture

```

User Canvas (Nodes)
↓
Graph Compiler
↓
Runtime Engine
↓
Shared Infra (DB, Auth, Queue)

```

- The backend is **stateless**
- Execution happens via **context**
- Scales horizontally

---

## Backend Folder Structure (Recommended)

```

backend/
├── src/
│ ├── main.rs
│ ├── server.rs
│
│ ├── platform/ # Your product backend
│ │ ├── auth/ # accounts, orgs
│ │ ├── projects/ # user projects
│ │ ├── canvas/ # node graph storage
│ │ ├── deployment/ # compile & deploy backends
│ │ ├── agents/ # reusable agents
│ │ └── permissions/
│
│ ├── runtime/ # Execution engine (MOST IMPORTANT)
│ │ ├── engine.rs
│ │ ├── node.rs
│ │ ├── context.rs
│ │ ├── scheduler.rs
│ │ └── sandbox.rs
│
│ ├── nodes/ # All nodes users can drag
│ │ ├── core/
│ │ │ ├── request.rs
│ │ │ ├── response.rs
│ │ │ ├── condition.rs
│ │ │ ├── transform.rs
│ │ │ └── auth_check.rs
│ │ │
│ │ ├── db/
│ │ │ ├── query.rs
│ │ │ ├── insert.rs
│ │ │ └── update.rs
│ │ │
│ │ ├── auth/
│ │ │ ├── internal_auth.rs
│ │ │ └── clerk.rs
│ │ │
│ │ ├── integrations/
│ │ │ ├── http.rs
│ │ │ ├── stripe.rs
│ │ │ └── webhook.rs
│ │ │
│ │ └── agents/
│ │ ├── agent_call.rs
│ │ └── agent_chain.rs
│
│ ├── storage/ # Shared infra
│ │ ├── db.rs
│ │ ├── cache.rs
│ │ └── queue.rs
│
│ ├── api/ # Platform APIs
│ │ ├── routes.rs
│ │ └── middleware.rs
│
│ └── config/
│ └── settings.rs

```

---

## Node System (Core Abstraction)

All nodes implement a **single interface**.

```rust
trait Node {
  fn id(&self) -> NodeId;
  fn execute(&self, ctx: &mut Context) -> NodeResult;
}
```

### Context Contains

- Request data
- Response builder
- Auth state
- DB access
- Secrets
- Agent access

Nodes **read/write context**.

---

## Request & Response Design (Routes)

### Key Rule

> **ONE Request Node, MANY routes**

### Why

- Cleaner canvas
- Better UX
- Scales to many APIs

### Example

```
Request Node
 ├── POST /login     → auth → response
 ├── GET  /users     → auth → db → response
 └── POST /orders    → auth → logic → db → response
```

Each route maps to a separate execution graph.

---

## Auth as Nodes

Auth is **pluggable and node-based**.

### Auth Provider Nodes

- Internal Auth
- Clerk
- Firebase (future)
- Custom JWT

### Auth Check Node

```
if user is authenticated:
  continue
else:
  error (401)
```

Other nodes simply read:

```
ctx.auth.user_id
```

---

## Agents (First-Class Feature)

Agents:

- Created separately
- Versioned
- Tested independently
- Used as nodes

### Usage in Graph

```
Request → Auth → Agent Node → DB → Response
```

Agent node:

```rust
ctx.call_agent(agent_id, input)
```

This allows:

- Reuse
- Composition
- Independent scaling

---

## Database Design (No Per-User DBs)

### ❌ Avoid

- One DB per user
- One schema per user

### ✅ Use Multi-Tenant DB

Shared database with logical isolation.

### Example Tables

```
projects
users
data
```

`data` table:

```
project_id
table_name
row_data (JSONB)
```

Access control:

- project_id
- auth context
- permissions

This is how Supabase / Firebase / Convex scale.

---

## How Execution Scales

```
API Gateway
   ↓
Runtime Engine
   ↓
Worker Pool
   ↓
Shared DB + Cache
```

- Stateless execution
- Horizontal scaling
- Kubernetes-friendly

---

## Key Product Insight

> **Your backend is a compiler, not a server.**

Users design workflows →
You compile them →
Runtime executes them.

---

## Design Rules to Remember

1. Everything user-facing is a node
2. Nodes only talk via context
3. Agents are reusable and separate
4. Routes come from ONE request node
5. DB is shared, not per user
6. Platform backend ≠ user runtime

---

## Future Extensions

- Plugin marketplace (custom nodes)
- Versioned deployments
- Edge execution
- RBAC per node
- Audit logs
- Rate limiting nodes

---

## One-Line Summary

> **Build a backend platform where users assemble backend logic visually, and your system compiles and runs it safely at scale.**
