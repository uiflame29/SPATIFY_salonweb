# Deploy to Render + Vercel: Exact Step-by-Step Checklist

This is the exact deployment flow for the SPATIFY project using the GitHub repo:

- Repository: `uiflame29/SPATIFY_salonweb`
- Branch: `main`

## 1) Deploy the backend to Render

### Step 1: Create the Render service

- [ ] Open Render dashboard.
- [ ] Click `New`.
- [ ] Select `Web Service`.
- [ ] Click `Connect a repository`.
- [ ] Choose GitHub repo: `uiflame29/SPATIFY_salonweb`.
- [ ] Select branch: `main`.

### Step 2: Fill in the Render service settings

- [ ] Name: `spatify-backend`
- [ ] Region: choose the closest region to your users.
- [ ] Runtime: `Java`
- [ ] Root Directory: `spatify-backend`
- [ ] Build Command: `mvn clean package -DskipTests`
- [ ] Start Command: `java -jar target/spatify-backend-1.0.0.jar`
- [ ] Plan: `Free`

### Step 3: Add backend environment variables in Render

In the Render dashboard, open the `Environment` tab and add:

- [ ] `SERVER_PORT=10000`
- [ ] `SERVER_ADDRESS=0.0.0.0`
- [ ] `APP_NAME=spatify-backend`
- [ ] `DB_URL=jdbc:postgresql://<your-render-postgres-host>:5432/spatify_db`
- [ ] `DB_USERNAME=<your-postgres-user>`
- [ ] `DB_PASSWORD=<your-postgres-password>`
- [ ] `JPA_DDL_AUTO=update`
- [ ] `SHOW_SQL=false`
- [ ] `JWT_SECRET=<generate-a-long-random-string>`
- [ ] `JWT_EXPIRATION_MS=86400000`
- [ ] `CORS_ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app`
- [ ] `LOG_LEVEL=INFO`
- [ ] `MAIL_HOST=smtp.sendgrid.net`
- [ ] `MAIL_PORT=587`
- [ ] `MAIL_USERNAME=<smtp-user>`
- [ ] `MAIL_PASSWORD=<smtp-password>`

### Step 4: Create or attach PostgreSQL

- [ ] In Render, click `New`.
- [ ] Select `PostgreSQL`.
- [ ] Name it: `spatify-db`
- [ ] Use the default free plan.
- [ ] Copy the generated host, username, password, and database name.
- [ ] Paste them into the backend environment variables.

### Step 5: Deploy the backend

- [ ] Click `Create Web Service`.
- [ ] Wait for Render to finish the build.
- [ ] Open the service URL once deployment is complete.
- [ ] Confirm the backend responds successfully.

Example Render endpoint:

- `https://spatify-backend.onrender.com`

---

## 2) Deploy the frontend to Vercel

### Step 1: Import the repo into Vercel

- [ ] Open Vercel dashboard.
- [ ] Click `Add New`.
- [ ] Select `Project`.
- [ ] Import GitHub repo: `uiflame29/SPATIFY_salonweb`.
- [ ] Select branch: `main`.

### Step 2: Fill in the Vercel project settings

- [ ] Project Name: `spatify-frontend`
- [ ] Framework Preset: `Vite`
- [ ] Root Directory: `spatify-frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Output Directory: `dist`

If Vercel does not auto-detect correctly, use the manual values above.

### Step 3: Add frontend environment variables in Vercel

In the `Settings` -> `Environment Variables` section, add:

- [ ] `VITE_API_URL=https://<your-render-backend-url>.onrender.com/api`
- [ ] `VITE_PORT=8126`

### Step 4: Deploy the frontend

- [ ] Click `Deploy`.
- [ ] Wait for the production build to finish.
- [ ] Open the generated Vercel preview URL.

Example final frontend URL:

- `https://spatify-frontend.vercel.app`

---

## 3) Update backend CORS after frontend deployment

Once the frontend URL exists, update the backend CORS setting:

- [ ] In Render, open the backend service.
- [ ] Go to `Environment`.
- [ ] Update:
  - `CORS_ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app`

If you also want localhost support during testing, set:

- `CORS_ALLOWED_ORIGINS=http://localhost:8126,https://<your-vercel-project>.vercel.app`

---

## 4) Final live checks

### Frontend checks

- [ ] Homepage loads without errors.
- [ ] Login page renders.
- [ ] Customer booking flow loads.
- [ ] Admin dashboard loads.
- [ ] Manager dashboard loads.
- [ ] Staff dashboard loads.

### Backend checks

- [ ] API health is reachable.
- [ ] Login endpoint works.
- [ ] Booking endpoint works.
- [ ] Admin endpoints require admin permissions.
- [ ] Manager endpoints require manager/admin permissions.
- [ ] Staff endpoints require staff/manager/admin permissions.

### Data checks

- [ ] PostgreSQL database is reachable.
- [ ] Users can log in with seeded account data.
- [ ] Booking creation works end-to-end.
- [ ] Email sending works for real SMTP or the configured provider.

---

## 5) Final production note

If any deploy fails, the most common root cause is one of these:

- [ ] port conflict on local machine
- [ ] wrong `Root Directory`
- [ ] wrong `Build Command`
- [ ] missing `CORS_ALLOWED_ORIGINS`
- [ ] missing `VITE_API_URL`
- [ ] PostgreSQL connection string is wrong

This project is designed to work with:

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

The repo is already prepared for that deployment flow.
