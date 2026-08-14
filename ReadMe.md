# SPATIFY Luxury Salon & Spa

SPATIFY is a full-stack salon and spa management system with role-based access for customers, staff, managers, and administrators. The platform supports service browsing, appointment booking, staff management, payroll processing, audit tracking, and admin settings.

## Tech Stack

- Frontend: React + Vite + JavaScript
- Backend: Spring Boot 3 + Java 17 + PostgreSQL
- Authentication: JWT
- Styling: custom CSS
- Database: PostgreSQL

## Project Structure

```text
SPATIFY_salonweb/
├── .env.example
├── README.md
├── run_spatify.bat
├── spatify-backend/
│   ├── pom.xml
│   ├── src/
│   └── target/
├── spatify-database/
│   └── spatify_db_dump.sql
└── spatify-frontend/
    ├── package.json
    ├── src/
    └── dist/
```

## Features

- Customer-facing salon home page and services catalog
- Secure login and registration flow
- Booking management for customers
- Staff scheduling and attendance tracking
- Manager dashboard with appointments, payroll, and inventory
- Admin dashboard for users, services, audits, reviews, and settings
- JWT-protected backend endpoints with role-based access control

## Roles

- Admin
- Manager
- Staff
- Customer

## Prerequisites

Before running the project, make sure the following are installed:

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15 or 17
- Git

## Quick Start

### 1) Clone the repository

```bash
git clone https://github.com/uiflame29/SPATIFY_salonweb.git
cd SPATIFY_salonweb
```

### 2) Set up environment variables

Copy the sample environment files and update values as needed:

```bash
copy .env.example .env
copy spatify-frontend\.env.example spatify-frontend\.env
```

Update the values in the `.env` and `spatify-frontend/.env` files for your local database, email, and secret values.

### 3) Create the PostgreSQL database

Open PostgreSQL and create a database named:

```sql
CREATE DATABASE spatify_db;
```

Then import the SQL dump:

```bash
psql -U postgres -d spatify_db -f spatify-database/spatify_db_dump.sql
```

### 4) Start the backend

```bash
cd spatify-backend
mvn spring-boot:run
```

Default backend URL:

```text
http://localhost:5218
```

### 5) Start the frontend

```bash
cd spatify-frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:8126
```

## Windows Launcher

A Windows batch launcher is included:

```bash
run_spatify.bat
```

This script attempts to start PostgreSQL, the Spring Boot backend, and the Vite frontend automatically.

## Production Build

### Frontend

```bash
cd spatify-frontend
npm install
npm run build
```

The built files will be generated in:

```text
spatify-frontend/dist
```

### Backend

```bash
cd spatify-backend
mvn clean package
```

This creates a runnable JAR in the `target` folder.

## Deployment Notes

For deployment, configure environment variables instead of hardcoding hostnames and API URLs.

Example production backend environment:

```bash
SERVER_PORT=8080
DB_URL=jdbc:postgresql://your-db-host:5432/spatify_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-production-jwt-secret
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Example production frontend environment:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## Default Test Accounts

| Role | Full Name | Email | Password |
| --- | --- | --- | --- |
| Admin | Alexandra Chen | admin@spatify.com | Alex@Spatify2026 |
| Admin | Default Admin | admin | admin123 |
| Manager | Michael Torres | manager@spatify.com | Mich@Spatify2026 |
| Staff | Maria Santos | maria@spatify.ph | Maria@Spatify123! |
| Customer | Anna D. | anna@example.com | Anna@Password123! |

## Notes

- The app uses a local PostgreSQL instance by default.
- Email is configured through Ethereal for testing unless replaced with real SMTP settings.
- The frontend currently uses `VITE_API_URL` and the backend uses environment variables to support deployment setups more safely.

## License

This project is for educational and portfolio/demo use unless otherwise specified.
