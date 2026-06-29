# CIISIC Innovation Ecosystem Platform (Version 1.0)

A production-ready Innovation Portal and Ecosystem manager coordinating students, mentors, corporate companies, excellence cells, and reviewer committee panels.

---

## Technical Stack Overview

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, Material-UI, Socket.IO Client.
* **Backend**: Node.js 20, Express, Socket.IO, Mongoose/MongoDB, Redis Cache, Pino Logger.
* **Storage Abstraction**: S3, MinIO, Local Provider.

---

## Directory Structure

```text
/saasable-ui
├── backend/            # Express, Mongoose, Socket.IO APIs code
├── frontend/           # Next.js App Router UI portals
├── docker-compose.yml  # Composite container orchestration config
└── README.md           # This guides doc
```

---

## Installation & Setup Instructions

### 1. Database & Cache
Make sure MongoDB and Redis are running locally or use docker-compose:
```bash
docker compose up -d database cache
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

The application is reachable at `http://localhost:3000`.
