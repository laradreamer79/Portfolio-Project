# Production Environment

## Status

The Oyster frontend, backend API, and PostgreSQL database are deployed on
Render. The Render services deploy the `develop` integration branch.

## Environments

| Component | Provider | URL | Status |
|---|---|---|---|
| Frontend | Render | [https://zeroyster.onrender.com](https://zeroyster.onrender.com) | Live |
| Backend API | Render | [Health endpoint](https://oyster-kwn3.onrender.com/api/health) | Live |
| PostgreSQL | Render | Private connection | Live |

## Deployment Configuration

- Deployment branch: `develop`
- Frontend root directory: `stage4/frontend`
- Backend root directory: `stage4/backend`
- Production database migrations: Prisma migration deploy
- Secrets and database connection strings: Render environment variables

## Build and Start Commands

### Frontend

```bash
npm ci
npm run build
```

The generated Vite `dist` directory is published by the frontend service. SPA
rewrites must return `index.html` for direct routes such as `/centers` and
`/admin`.

### Backend

```bash
npm ci
npm run build
npx prisma migrate deploy
npm start
```

The migration command must run as part of deployment after a pull request with
a Prisma migration is merged. `prisma migrate dev` and `prisma db push` must
not be used against the production database.

## Environment Variables

Only variable names are documented. Production values must never be committed.

```text
DATABASE_URL
PORT
JWT_SECRET
JWT_EXPIRES_IN
PAYMENT_PROVIDER_MODE
MOYASAR_SECRET_KEY
MOYASAR_BASE_URL
MOYASAR_CALLBACK_URL
MOYASAR_WEBHOOK_SECRET
MOYASAR_PUBLISHABLE_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
VITE_API_URL
```

## Production Verification

- [ ] Frontend loads over HTTPS.
- [ ] Direct frontend routes refresh without a `404`.
- [ ] Backend health endpoint returns `200`.
- [ ] `npx prisma migrate deploy` succeeds.
- [ ] Registration, login, refresh, and logout work.
- [ ] Role-protected pages and endpoints reject unauthorized accounts.
- [ ] Public centers, trips, and courses load.
- [ ] Booking and payment smoke tests pass in the configured payment mode.
- [ ] Dashboard data loads for every role.
- [ ] Browser console and Render logs contain no unexpected errors.
- [ ] No secrets appear in logs or repository files.

## Release Process

1. Merge an approved pull request into `develop`.
2. Confirm the required GitHub checks pass.
3. Confirm Render starts the frontend and backend deployments.
4. Check the backend build log for a successful Prisma migration.
5. Run the production verification checklist.
6. Record the result in the current sprint testing evidence.

## Rollback

1. Identify the last stable deployment commit in Render.
2. Review whether the release included a database migration.
3. Redeploy the stable application version.
4. Do not reverse a production migration until its data impact is reviewed.
5. Run the production smoke tests again and record the result.
