# SentinelX — System Architecture Document

## Overview
SentinelX is designed as a Security Operations Center (SOC) platform and Security Information and Event Management (SIEM) simulator.

## Layered Architecture

```
[ Frontend: React 18 / Tailwind / Recharts ]
                     │  HTTP / REST
                     ▼
           [ API Gateway / Express App ]
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
[ Security Middleware ]     [ Controllers ]
                                   │
                                   ▼
                            [ Services Layer ]
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
     [ Event Generator ]    [ Detection Engine ]   [ Audit Trail ]
              │                    │
              └─────────┬──────────┘
                        ▼
             [ Prisma ORM Client ]
                        │
                        ▼
              [ PostgreSQL Database ]
```

## Modular Responsibilities

1. **`routes/`**: Declares API URL paths and attaches middleware guards.
2. **`controllers/`**: Extracts parameters, calls corresponding service functions, returns HTTP status codes and responses.
3. **`services/`**: Encapsulates core business logic, database queries, and external interactions.
4. **`middleware/`**: Handles authentication (JWT verification), authorization (RBAC), validation, request logging, and error handling.
5. **`config/`**: Parses and validates environment variables.
6. **`event-generator/`** *(Upcoming Phase)*: Emits simulated normal and malicious security events.
7. **`detection-engine/`** *(Upcoming Phase)*: Evaluates event streams against detection rules and creates alerts.

## Phased Delivery
- **Phase 1**: Project Initialization & Environment Setup (Completed)
- **Phase 2**: Authentication & Role-Based Access Control (RBAC)
- **Phase 3**: Core Database Modeling & Asset Inventory
- **Phase 4**: Security Event Simulation & Event Explorer
- **Phase 5**: Rule-Based Threat Detection Engine
- **Phase 6**: Incident Management & Investigation Workflow
- **Phase 7**: Frontend UI Shell & SOC Layout
- **Phase 8**: Frontend Dashboards & Visualizations
- **Phase 9**: MITRE ATT&CK Mapping & Compliance Reports
- **Phase 10**: End-to-End Simulation Testing & Hardening
