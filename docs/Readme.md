# Donut

A modern web platform built with Next.js frontend and Rust backend, featuring a visual node-based workflow engine for building and deploying applications.

## Project Structure

### Backend Structure (Rust)

```
backend/
├── src/
│   ├── main.rs
│   ├── server.rs
│   │
│   ├── platform/                  # Platform backend
│   │   ├── auth/                  # Authentication, organizations, billing
│   │   ├── projects/              # User project management
│   │   ├── canvas/                # Node graph storage
│   │   ├── deployment/            # Compilation & deployment
│   │   ├── agents/                # Reusable agents
│   │   └── permissions/           # Permission management
│   │
│   ├── runtime/                   # Core execution engine 🔥
│   │   ├── engine.rs              # Node graph executor
│   │   ├── node.rs                # Node trait definition
│   │   ├── context.rs             # Request/user/database context
│   │   ├── scheduler.rs           # Async & background processing
│   │   └── sandbox.rs             # Isolated execution environment
│   │
│   ├── nodes/                     # Node implementations
│   │   ├── core/                  # Built-in nodes
│   │   │   ├── request.rs
│   │   │   ├── response.rs
│   │   │   ├── condition.rs
│   │   │   ├── transform.rs
│   │   │   └── auth_check.rs
│   │   │
│   │   ├── db/                    # Database nodes
│   │   │   ├── query.rs
│   │   │   ├── insert.rs
│   │   │   └── update.rs
│   │   │
│   │   ├── auth/                  # Authentication nodes
│   │   │   ├── internal_auth.rs
│   │   │   └── clerk.rs
│   │   │
│   │   ├── integrations/          # Third-party integrations
│   │   │   ├── http.rs
│   │   │   ├── stripe.rs
│   │   │   └── webhook.rs
│   │   │
│   │   └── agents/                # AI agent nodes
│   │       ├── agent_call.rs
│   │       └── agent_chain.rs
│   │
│   ├── core/                   # Shared infrastructure
│   │   ├── db.rs
│   │   ├── cache.rs
│   │   └── queue.rs
│   │
│   ├── api/                       # Platform APIs
│   │   ├── routes.rs
│   │   └── middleware.rs
│   │
│   └── config/
│       └── settings.rs
```

### Frontend Structure (Next.js)

```
frontend/
├── app/                          # App router
│   └── page.js                   # Landing page
│
├── components/                   # React components
│   ├── landingpage/             # Landing page components
│   │   ├── navbar.js
│   │   ├── hero.js
│   │   ├── features.js
│   │   ├── serviceshowcase.js
│   │   ├── videoshowcase.js
│   │   ├── stats.js
│   │   ├── testimonials.js
│   │   ├── pricing.js
│   │   ├── cta.js
│   │   └── footer.js
│   │
│   ├── dashboard/               # Dashboard components
│   ├── layout/                  # Layout components
│   └── project/                 # Project-related components
│
├── context/                     # React context providers
├── lib/                         # Utility libraries
├── utils/                       # Helper functions
├── public/                      # Static assets
│
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.mjs
├── eslint.config.mjs
├── jsconfig.json
└── setup-database.js
```

## Technology Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **React Flow** - Node graph visualization
- **Supabase** - Database client
- **Google Generative AI** - AI integration

### Backend

- **Rust** - Systems programming language
- **Axum** - Modern async web framework
- **Tokio** - Async runtime for Rust
- **Serde** - Serialization/deserialization framework
- **Chrono** - Date and time library
- **Custom runtime engine** - Node graph execution
- **Modular node system** - Extensible workflow nodes

## Key Features

- **Visual Workflow Builder** - Node-based workflow creation
- **Runtime Engine** - Execute complex workflows
- **Authentication System** - User management and permissions
- **Database Integration** - Query and manipulate data
- **Third-party Integrations** - HTTP, Stripe, webhooks
- **AI Agents** - Intelligent automation
- **Real-time Execution** - Async processing and scheduling

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Bun (optional, for faster package management)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
cargo run
```

## Development

- **Frontend Dev Server**: `npm run dev` (with Turbopack)
- **Database Setup**: `npm run setup-db`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Architecture

The Donut platform consists of two main components:

1. **Frontend**: A modern Next.js application providing the user interface for workflow creation and management
2. **Backend**: A high-performance Rust runtime that executes node-based workflows with sandboxed execution

The runtime engine is the core of the platform, enabling visual programming through interconnected nodes that can handle various tasks from simple data transformations to complex AI agent interactions.
