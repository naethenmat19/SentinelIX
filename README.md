# SentinelX — SOC Monitoring Platform

SentinelX is a full-stack, SIEM-inspired Security Operations Center (SOC) monitoring platform. It simulates an organization's internal security telemetry, processes security events dynamically using a rule-based detection engine, generates actionable alerts mapped to MITRE ATT&CK techniques, and empowers SOC analysts to triage, investigate, and remediate incidents.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **Visualization**: Recharts *(to be added in dashboard phases)*
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Architecture**: Modular layered architecture (Routes -> Controllers -> Services -> Middleware)
- **Runtime/Development**: `tsx` (fast TypeScript execution with zero-transpile dev watch)
- **Database**: PostgreSQL with Prisma ORM *(configured in Phase 2/3)*
- **Testing**: Vitest & Supertest

---

## 📁 Project Structure

```
SentinelX/
├── frontend/                 # React + TypeScript + Vite frontend
│   ├── public/               # Static assets
│   ├── src/                  # Application source code
│   │   ├── assets/           # Client-side static assets
│   │   ├── App.tsx           # Root UI component
│   │   ├── index.css         # Tailwind CSS directives & global styling
│   │   └── main.tsx          # React application entry point
│   ├── index.html            # Vite HTML host template
│   ├── package.json          # Frontend dependencies & scripts
│   ├── postcss.config.js     # PostCSS configuration for Tailwind
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── tsconfig.json         # Frontend TypeScript configuration
│   └── vite.config.ts        # Vite configuration
│
├── backend/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/           # Environment and server configuration
│   │   ├── controllers/      # Request handlers & HTTP responses
│   │   ├── middleware/       # Express middlewares (error handling, 404, security)
│   │   ├── routes/           # REST API route definitions
│   │   ├── services/         # Business logic layer
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server startup & port binding
│   ├── .env.example          # Template for backend environment variables
│   ├── package.json          # Backend dependencies & scripts
│   └── tsconfig.json         # Backend TypeScript configuration
│
├── docs/                     # Architectural and technical documentation
│   └── ARCHITECTURE.md       # Architecture & Roadmap documentation
│
├── .gitignore                # Workspace gitignore
├── package.json              # Root orchestrator scripts
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended, verified on v22+)
- npm (v9+ recommended, verified on v10+)

### 1. Installation
Install dependencies for both frontend and backend from the root directory:
```bash
npm run install:all
```
Or install each independently:
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Running in Development Mode

Both applications can run independently:

#### Backend Server
```bash
cd backend
npm run dev
```
- Runs on: `http://localhost:5000`
- Health check endpoint: `http://localhost:5000/api/health`

#### Frontend Application
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173`

#### From Workspace Root
You can also invoke commands directly from the root:
```bash
# Start backend
npm run dev:backend

# Start frontend
npm run dev:frontend
```

### 3. Building for Production

```bash
# Build both
npm run build

# Or independently
cd frontend && npm run build
cd backend && npm run build
```

---

## 🔒 Security & Architecture Principles
- **No Hardcoded Secrets**: All configuration is managed via strictly validated environment variables.
- **Layered Decoupling**: Routes only delegate to controllers; controllers only manage HTTP payload validation and status codes; services encapsulate business logic.
- **Dynamic Rule Engine**: Detection rules evaluate incoming security telemetry dynamically rather than displaying static mocks.
