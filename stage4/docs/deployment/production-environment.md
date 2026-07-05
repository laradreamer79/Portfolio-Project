# Production Environment

## Status

Planned for Sprint 4.

## Environments

| Component | Provider | URL | Status |
|---|---|---|---|
| Frontend | [Add provider] | [Add URL] | Planned |
| Backend API | [Add provider] | [Add URL] | Planned |
| PostgreSQL | [Add provider] | Private connection | Planned |

## Release Information

- Deployment branch: `main`
- Release commit: [Add commit]
- Deployment date: [Add date]
- Deployed by: [Add owner]

## Build and Start Commands

### Frontend

```bash
npm ci
npm run build
```

### Backend

```bash
npm ci
npm run build
npm start
```

## Environment Variables

Document names only. Never commit production values.

```text
DATABASE_URL
PORT
JWT_SECRET
JWT_EXPIRES_IN
MOYASAR_SECRET_KEY
FRONTEND_URL
```

## Production Verification

- [ ] Frontend loads over HTTPS.
- [ ] Backend health endpoint returns `200`.
- [ ] Database migration succeeds.
- [ ] CORS accepts only the production frontend.
- [ ] Register and Login work.
- [ ] Booking and payment smoke tests pass.
- [ ] No secrets appear in logs or repository files.

## Rollback

1. Identify the last stable release commit.
2. Redeploy the stable application version.
3. Do not roll back a database migration until its data impact is reviewed.
4. Run the production smoke tests again.

