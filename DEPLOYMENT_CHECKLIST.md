# Live Deployment Checklist

Use this checklist before going live with SPATIFY on Render and Vercel.

## Render (backend)

- [ ] Create a Render account and connect the GitHub repo.
- [ ] Select the backend folder as the service root, or configure the root build directory correctly.
- [ ] Use the Java runtime environment for the backend service.
- [ ] Set the backend service build command to:
  - `./mvnw clean package -DskipTests`
  - or use the project Maven wrapper if available.
- [ ] Set the start command to:
  - `java -jar target/spatify-backend-1.0.0.jar`
- [ ] Add required environment variables:
  - `SERVER_PORT=10000`
  - `DB_URL=jdbc:postgresql://<host>:5432/spatify_db`
  - `DB_USERNAME=<db-user>`
  - `DB_PASSWORD=<db-password>`
  - `JWT_SECRET=<strong-random-secret>`
  - `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`
- [ ] Provision or attach a PostgreSQL database.
- [ ] Confirm the backend health endpoint responds successfully.
- [ ] Test login and public APIs from the deployed frontend.

## Vercel (frontend)

- [ ] Import the repository into Vercel.
- [ ] Set the project root to the repository root.
- [ ] Use the frontend build settings for the Vite app.
- [ ] Set the environment variable:
  - `VITE_API_URL=https://your-backend-domain.onrender.com/api`
- [ ] Confirm the build succeeds without warnings that block deployment.
- [ ] Publish the site and test the public landing page.
- [ ] Verify login, booking, and dashboard routes work with the deployed backend.
- [ ] Update the CORS configuration in the backend to include the Vercel domain.

## Final launch checks

- [ ] Public page loads without console errors.
- [ ] Login works for admin, manager, staff, and customer accounts.
- [ ] Booking flow submits data successfully.
- [ ] Admin pages load correctly with role-based access control.
- [ ] Database connection is stable after deployment.
- [ ] SMTP email configuration works or falls back to a valid production provider.
- [ ] Remove or replace local-only secrets from the repository.
- [ ] Confirm the README reflects the current deployed URLs.
