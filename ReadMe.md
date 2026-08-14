# SPATIFY Luxury Salon & Spa

![SPATIFY Banner](docs/spatify-banner.svg)

SPATIFY is a full-stack salon and spa management system for luxury grooming, appointment booking, staff coordination, and business operations. The app includes role-based access for customers, staff, managers, and administrators across the customer journey and operational workflow.

## Features

- Customer browsing and salon service discovery
- Secure login and registration flow
- Appointment booking and scheduling
- Staff attendance and roster tracking
- Manager dashboards for payroll, inventory, and operations
- Admin tools for users, services, reviews, audits, and settings
- JWT-based authentication with role-aware API protections

## Tech Stack

- Frontend: React + Vite + JavaScript
- Backend: Spring Boot 3 + Java 17 + PostgreSQL
- Auth: JWT
- Deployment-ready config: environment variables and static build output

## Project Structure

```text
SPATIFY_salonweb/
├── .env.example
├── README.md
├── netlify.toml
├── render.yaml
├── vercel.json
├── run_spatify.bat
├── docs/
│   └── spatify-banner.svg
├── spatify-backend/
│   ├── pom.xml
│   └── src/
├── spatify-database/
│   └── spatify_db_dump.sql
└── spatify-frontend/
    ├── package.json
    ├── src/
    └── dist/
```

## How to run

### Fastest way for Windows users

1. Install Git, Node.js, Java 17+, Maven, and PostgreSQL 17.
2. Clone the project.
3. Create the database `spatify_db` in PostgreSQL.
4. Double-click the launcher:

```bat
run_spatify.bat
```

This single script will:

- check PostgreSQL
- clear stale app ports
- start the backend on `http://localhost:5218`
- start the frontend on `http://localhost:8126`
- open the browser automatically if the app is ready

If port 8126 is already in use, the frontend will fall back to `http://localhost:8127`.

### 1) Prerequisites

Install the following before starting the app:

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15 or 17
- Git

### 2) Clone and configure

```bash
git clone https://github.com/uiflame29/SPATIFY_salonweb.git
cd SPATIFY_salonweb
```

Create your local database before running the app:

```sql
CREATE DATABASE spatify_db;
```

Then run the one-click launcher from the project root:

```bat
run_spatify.bat
```

### 3) Manual startup (if needed)

#### Start the backend

```bash
cd spatify-backend
"C:\tools\apache-maven-3.9.15\bin\mvn.cmd" spring-boot:run
```

Default backend URL:

```text
http://localhost:5218
```

If port 5218 is already in use, change the server port in `.env` before starting:

```env
SERVER_PORT=5219
```

#### Start the frontend

```bash
cd spatify-frontend
npm install
npm run dev -- --host 0.0.0.0 --port 8126
```

Default frontend URL:

```text
http://localhost:8126
```

If 8126 is busy, Vite will usually choose another port such as 8127 automatically. You can also set:

```env
VITE_PORT=8127
```

### 4) Open the app

Open the frontend in the browser:

```text
http://localhost:8126
```

or:

```text
http://localhost:8127
```

### Runtime note

When starting both services together, the most common issue is port conflict. The backend failed during verification because port 5218 was already occupied, and the frontend also switched ports when 8126 was busy. This is expected behavior; the fix is to set a free port in the environment variables or let Vite pick another one. The included launcher automatically handles this for local Windows users.

## Screenshots / preview

The project includes a branded cover image and a UI hero image for the GitHub page.

<div align="center">
  <img src="docs/spatify-banner.svg" alt="SPATIFY banner" width="900" />
</div>

### App preview

![SPATIFY homepage hero](spatify-frontend/src/assets/hero.png)

This project includes a salon landing experience with role-based dashboards, booking flows, and management views for customers, staff, managers, and admins.

## Local browser test flow

Use this sequence to launch the app cleanly and test it in a browser without port conflicts.

### 1) Start PostgreSQL

Make sure PostgreSQL is running before launching the backend.

### 2) Start the backend

```powershell
cd 'c:\Users\judya\Documents\SPATIFY_salonweb\spatify-backend'
& 'C:\tools\apache-maven-3.9.15\bin\mvn.cmd' spring-boot:run
```

The backend should bind to port 5218 if it is free.

### 3) Start the frontend

```powershell
cd 'c:\Users\judya\Documents\SPATIFY_salonweb\spatify-frontend'
npm install
npm run dev -- --host 0.0.0.0 --port 8126
```

Open the app at:

```text
http://localhost:8126
```

If 8126 is unavailable, Vite will switch to another port automatically. You can also set a custom value via the environment variable `VITE_PORT`.

### 4) Test the app

- Visit the landing page
- Register or sign in with a test account
- Check the customer booking flow
- Check manager and admin dashboard access
- Confirm the backend API is responding from the frontend

## Production environment examples

Use these values for deployment in Render or Vercel.

### Backend production example

```env
SERVER_PORT=10000
DB_URL=jdbc:postgresql://your-db-host:5432/spatify_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=your-smtp-user
MAIL_PASSWORD=your-smtp-password
LOG_LEVEL=INFO
```

### Frontend production example

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
VITE_PORT=8126
```

## Windows launcher

A quick Windows launcher is included for local development:

```cmd
run_spatify.bat
```

This script attempts to start PostgreSQL, the backend, and the frontend automatically. If the machine has different port usage, adjust the environment variables before launching.

## Production build

### Frontend

```bash
cd spatify-frontend
npm install
npm run build
```

Build output:

```text
spatify-frontend/dist
```

### Backend

```bash
cd spatify-backend
"C:\tools\apache-maven-3.9.15\bin\mvn.cmd" clean package
```

This produces a JAR in the `target` folder for deployment.

## Deployment setup

### Frontend deployment: Vercel / Netlify

The repository includes deployment config files for both platforms:

- [vercel.json](vercel.json)
- [netlify.toml](netlify.toml)

Recommended setup:

1. Import the repo into Vercel or Netlify.
2. Set the project root to the repository root.
3. Set the build command for Vercel/Netlify to the frontend folder.
4. Set the environment variable:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend deployment: Render / Railway

The repository includes deployment config for Render:

- [render.yaml](render.yaml)

Recommended setup:

1. Connect the repo to Render or Railway.
2. Use the backend as the service root.
3. Add these environment variables:

```env
SERVER_PORT=10000
DB_URL=jdbc:postgresql://your-db-host:5432/spatify_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-production-jwt-secret
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

For Railway, add the same variables in the service dashboard and make sure the backend health check is enabled.

## Default test accounts

| Role | Full Name | Email | Password |
| --- | --- | --- | --- |
| Admin | Alexandra Chen | admin@spatify.com | Alex@Spatify2026 |
| Admin | Default Admin | admin | admin123 |
| Manager | Michael Torres | manager@spatify.com | Mich@Spatify2026 |
| Staff | Maria Santos | maria@spatify.ph | Maria@Spatify123! |
| Customer | Anna D. | anna@example.com | Anna@Password123! |

## Notes

- PostgreSQL is required for the app to run correctly.
- Email is set up for Ethereal testing by default.
- The app is environment-driven for easier deployment and safer local configuration.
- Both the backend and frontend use port configuration values that can be overridden if a local port is already occupied.

## License

This project is for educational and portfolio/demo use unless otherwise specified.
