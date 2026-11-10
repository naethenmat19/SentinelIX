# SentinelX — SOC Monitoring Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white" alt="Node.js 22" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma ORM" />
</p>

<p align="center">
  A full-stack Security Operations Center (SOC) monitoring dashboard for managing security alerts, incidents, events, and analyst activity.
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🔍 Overview

**SentinelX** is a full-stack SOC dashboard project designed to demonstrate how security monitoring interfaces and backend services work together.

The platform provides a centralized interface for monitoring security activity, reviewing alerts, managing incidents, and viewing threat analytics.

It combines a React-based frontend with a Node.js and Express backend, using PostgreSQL for persistent data storage and Prisma ORM for database operations.

The project is intended for learning, demonstration, and portfolio development. It is not a production SIEM platform.

## ✨ Features

| Feature | Description |
|---|---|
| **SOC Overview** | Monitor security activity through dashboard metrics, charts, and system status. |
| **Security Alerts** | View, create, update, and manage security alerts. |
| **Incident Management** | Create incidents, update their status, and assign analysts. |
| **Security Events** | Review security events with severity indicators, search, and filtering. |
| **Threat Analytics** | Visualize security trends, severity distribution, and common event types. |
| **Analyst Management** | View and register analyst accounts with assigned roles. |
| **Notifications** | View recent alerts and monitor unresolved alert counts. |
| **System Health** | Check backend and database health through dedicated API endpoints. |

## 🛠️ Technology Stack

### Frontend

- **React 18** — Component-based user interface.
- **TypeScript** — Static typing and improved maintainability.
- **Vite** — Frontend development and build tooling.
- **Tailwind CSS** — Utility-first styling.
- **Recharts** — Dashboard charts and visualizations.
- **Lucide React** — Interface icons.

### Backend

- **Node.js** — JavaScript runtime.
- **Express 4** — REST API framework.
- **TypeScript** — Backend type safety.
- **Prisma ORM** — Database access and schema management.
- **bcryptjs** — Password hashing.
- **Helmet** — HTTP security headers.
- **Morgan** — HTTP request logging.
- **CORS** — Cross-origin resource sharing.

### Database and Development Tools

- **PostgreSQL 16** — Relational database.
- **Docker** — Optional containerized PostgreSQL environment.
- **Git and GitHub** — Version control and source code management.

## 🏗️ Architecture

SentinelX follows a simple client-server architecture.

```mermaid
flowchart TD
    A(["SOC Analyst"]) --> B["Frontend<br/>React + TypeScript"]
    B -->|"HTTP / JSON"| C["Backend API<br/>Node.js + Express"]
    C --> D["Prisma ORM"]
    D --> E[("PostgreSQL Database")]

    classDef user fill:#172554,stroke:#60A5FA,color:#DBEAFE
    classDef frontend fill:#0C354A,stroke:#38BDF8,color:#E0F2FE
    classDef backend fill:#292044,stroke:#A78BFA,color:#EDE9FE
    classDef database fill:#12372B,stroke:#34D399,color:#D1FAE5

    class A user
    class B frontend
    class C,D backend
    class E database
```

### Application Flow

1. The SOC analyst interacts with the React frontend.
2. The frontend communicates with the backend through REST API requests.
3. Express routes requests to the appropriate controllers and services.
4. Prisma handles database operations.
5. PostgreSQL stores and returns application data.

## 📁 Project Structure

<details>
<summary><strong>View project structure</strong></summary>

```text
SentinelIX/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
├── .gitignore
├── package.json
└── README.md
```

</details>

## 🚀 Getting Started

Follow these instructions to run SentinelX locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js 22](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for containerized PostgreSQL)

You can verify your Node.js and npm installations with:

```powershell
node --version
npm --version
```

### 1. Clone the Repository

Open PowerShell and run:

```powershell
git clone https://github.com/naethenmat19/SentinelIX.git

cd SentinelIX
```

### 2. Install Dependencies

From the project root:

```powershell
npm.cmd run install:all
```

This installs dependencies for both the frontend and backend.

> **Windows note:** `npm.cmd` is used in these examples because some PowerShell configurations block the `npm.ps1` script. On macOS or Linux, use `npm` instead.

### 3. Set Up PostgreSQL

You can use an existing PostgreSQL installation or run PostgreSQL through Docker.

<details>
<summary><strong>Option A — Run PostgreSQL using Docker (recommended for a quick setup)</strong></summary>

Make sure Docker Desktop is running.

Create a PostgreSQL 16 container:

```powershell
docker run -d `
  --name sentinelx-postgres `
  --restart unless-stopped `
  -e POSTGRES_USER=sentinelx_admin `
  -e POSTGRES_PASSWORD=CHANGE_ME `
  -e POSTGRES_DB=sentinelx `
  -p 5432:5432 `
  -v sentinelx-postgres-data:/var/lib/postgresql/data `
  postgres:16-alpine
```

Replace `CHANGE_ME` with a password of your choice. Use the same password in your backend environment configuration.

Check whether the container is running:

```powershell
docker ps
```

Stop the database container:

```powershell
docker stop sentinelx-postgres
```

Start it again:

```powershell
docker start sentinelx-postgres
```

The named Docker volume keeps database data persistent even if the container is removed.

</details>

<details>
<summary><strong>Option B — Use an existing PostgreSQL installation</strong></summary>

Create a PostgreSQL database named:

```sql
CREATE DATABASE sentinelx;
```

Make sure your PostgreSQL server is running and that you have a database username and password available.

</details>

### 4. Configure Environment Variables

Create a backend `.env` file from the example template.

Run this command from the project root:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

Open the new file:

```powershell
notepad .\backend\.env
```

Configure the values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Database
DATABASE_URL="postgresql://sentinelx_admin:CHANGE_ME@localhost:5432/sentinelx?schema=public"
```

Update the database username and password to match your PostgreSQL setup.

For an existing PostgreSQL installation, use its actual username and password instead.

**Important:** Never commit your actual `.env` file or database credentials to GitHub.

### 5. Apply Database Migrations

Open a terminal at the project root and navigate to the backend:

```powershell
cd backend
```

Apply the existing Prisma migrations:

```powershell
npx.cmd prisma migrate deploy
```

Generate the Prisma Client if needed:

```powershell
npx.cmd prisma generate
```

Return to the project root:

```powershell
cd ..
```

### 6. Start the Backend

From the project root, open a terminal and run:

```powershell
npm.cmd run dev:backend
```

The backend API will run at:

```text
http://localhost:5000
```

### 7. Start the Frontend

Open a **second terminal** at the project root and run:

```powershell
npm.cmd run dev:frontend
```

The frontend will run at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to access SentinelX.

### 8. Build the Project

To build both frontend and backend:

```powershell
npm.cmd run build
```

The root build command runs the backend TypeScript build followed by the frontend production build.

## 🔌 API Documentation

The backend exposes REST API endpoints for application functionality.

**Base URL:**

```text
http://localhost:5000/api
```

<details>
<summary><strong>Health API</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check backend health |
| GET | `/health/database` | Check database connectivity |

</details>

<details>
<summary><strong>Alerts API</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/alerts` | Retrieve all alerts |
| GET | `/alerts/:id` | Retrieve an alert by ID |
| POST | `/alerts` | Create a new alert |
| PATCH | `/alerts/:id` | Update an alert |
| DELETE | `/alerts/:id` | Delete an alert |

</details>

<details>
<summary><strong>Incidents API</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/incidents` | Retrieve all incidents |
| GET | `/incidents/:id` | Retrieve an incident by ID |
| POST | `/incidents` | Create a new incident |
| PATCH | `/incidents/:id` | Update an incident |
| DELETE | `/incidents/:id` | Delete an incident |

</details>

<details>
<summary><strong>Security Events API</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/security-events` | Retrieve security events |
| GET | `/security-events/:id` | Retrieve an event by ID |
| POST | `/security-events` | Create a security event |

</details>

<details>
<summary><strong>Users API</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Retrieve analyst accounts |
| GET | `/users/:id` | Retrieve a user by ID |
| POST | `/users` | Create a user account |

</details>

## 🗄️ Database

SentinelX uses PostgreSQL for persistent application data and Prisma ORM for database access.

The Prisma schema defines the following core models:

| Model | Purpose |
|---|---|
| **User** | Stores analyst account information and roles. |
| **Alert** | Stores security alert information and status. |
| **Incident** | Stores incident records, assignments, and status. |
| **SecurityEvent** | Stores security event details and severity information. |

Database schema and migration files are located in:

```text
backend/prisma/
```

## 🔐 Security Considerations

Current security-related implementation includes:

- Helmet middleware for HTTP security headers.
- CORS configuration for frontend-backend communication.
- Password hashing using bcryptjs.
- Environment variables for database credentials and configuration.
- Input validation for user creation and supported user roles.
- Separation of backend routes, controllers, and services.

**Current limitations:**

- Authentication and authorization are not yet implemented.
- User roles are stored but are not currently enforced through authorization middleware.
- The project is not a production-ready SIEM or security monitoring platform.
- Security telemetry is intended for demonstration and application-level testing rather than live enterprise security monitoring.

Do not expose the application publicly or use it to store real sensitive information without implementing appropriate security controls.

## 🗺️ Planned Improvements

-  User authentication and session management.
-  Role-based access control enforcement.
-  Advanced alert filtering and investigation workflows.
-  Real-time security event updates.
-  Audit logging and activity tracking.
-  Integration with external security data sources.
-  Improved automated testing.
-  Further UI and accessibility improvements.

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  <strong>SentinelX</strong>
  <br />
  Security Monitoring · Incident Management · Threat Analytics
</p>