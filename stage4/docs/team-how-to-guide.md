# Oyster Setup, Commands, and Testing Guide

## Requirements

- Node.js and npm
- PostgreSQL
- Two terminals for running the backend and frontend

The Stage 4 application contains two separate Node.js projects:

```text
stage4/
├── backend/    Express, TypeScript, Prisma, PostgreSQL
└── frontend/   React, TypeScript, Vite, Tailwind CSS
```

## First-Time Backend Setup

```bash
cd stage4/backend
npm install
cp .env.example .env
```

Set the local PostgreSQL connection and JWT secret in `backend/.env`:

```dotenv
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/oyster?schema=public"
PORT=3000
JWT_SECRET="use-a-long-random-development-secret"
```

Create an empty PostgreSQL database named `oyster`, then run:

```bash
npx prisma migrate dev
npm run seed
```

## First-Time Frontend Setup

In another terminal:

```bash
cd stage4/frontend
npm install
cp .env.example .env
```

The frontend `.env` should contain:

```dotenv
VITE_API_URL="http://localhost:3000/api"
```

## Start the Application

Terminal 1 — backend:

```bash
cd stage4/backend
npm run dev
```

Backend URL: <http://localhost:3000>

Terminal 2 — frontend:

```bash
cd stage4/frontend
npm run dev
```

The frontend URL printed by Vite is normally <http://localhost:5173>.

Stop either server with `Ctrl+C`.

## Backend Commands

Run these commands from `stage4/backend`.

| Command | Purpose |
| --- | --- |
| `npm install` | Install backend dependencies |
| `npm ci` | Install exactly what is recorded in the lockfile |
| `npm run dev` | Start the API with automatic reload |
| `npm run typecheck` | Check TypeScript without creating output |
| `npm run build` | Generate Prisma Client and compile the backend |
| `npm start` | Run the compiled backend from `dist` |
| `npm run seed` | Create or refresh development seed data |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma validate` | Validate the Prisma schema and configuration |
| `npx prisma format` | Format the Prisma schema |
| `npx prisma migrate status` | Show whether database migrations are current |
| `npx prisma migrate dev` | Apply development migrations |
| `npx prisma migrate dev --name NAME` | Create a migration after a schema change |
| `npx prisma migrate deploy` | Apply committed migrations outside development |
| `npx prisma studio` | Open the database browser |
| `npx prisma migrate reset` | Delete local data, reapply migrations, and reseed |

## Frontend Commands

Run these commands from `stage4/frontend`.

| Command | Purpose |
| --- | --- |
| `npm install` | Install frontend dependencies |
| `npm ci` | Install exactly what is recorded in the lockfile |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run Oxlint |
| `npm run typecheck` | Check TypeScript |
| `npm run build` | Type-check and create the production build |
| `npm run preview` | Preview the production build |
| `npm run dev -- --port 5174` | Start Vite on another port |

## Seeded Test Accounts

Run `npm run seed` from `stage4/backend` before using these accounts.

| Role | Email | Password | Expected dashboard |
| --- | --- | --- | --- |
| User | `user@example.com` | `123456` | `/dashboard` |
| Instructor | `instructor@example.com` | `123456` | `/dashboard` |
| Diving center | `divingcenter@example.com` | `123456` | `/center/dashboard` |
| Admin | `admin@example.com` | `123456` | `/admin` |

These accounts and passwords are for local development only.

## API Tests

Start the backend before running these commands.

### Health

```bash
curl http://localhost:3000/api/health
```

Expected status: `200`

Expected body:

```json
{"status":"ok","service":"oyster-api"}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

Expected status: `200`. Copy the returned token.

### Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected status: `200` with the authenticated user.

### Admin Authorization

```bash
curl http://localhost:3000/api/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Expected status: `200` for an admin token.

Also verify these failure cases:

- Invalid registration data returns `400`.
- Wrong login details return `401`.
- A duplicate registration email returns `409`.
- A protected endpoint without a token returns `401`.
- A non-admin token on `/api/admin` returns `403`.
- An unknown endpoint returns `404`.

## Frontend Authentication Tests

Test these flows in the browser:

1. Register a new user and confirm it opens `/dashboard`.
2. Log out and confirm the authenticated menu disappears.
3. Log in with each seeded account.
4. Confirm each role opens the dashboard listed in the seeded-account table.
5. Refresh the page and confirm the session remains active.
6. Remove or corrupt `oyster_auth` in browser local storage and refresh.
7. Confirm an invalid session returns to the login page.
8. Open `/admin` as a regular user and confirm access is blocked.
9. Open `/center/dashboard` as a regular user and confirm access is blocked.
10. Open `/booking/1` while logged out and confirm redirection to `/auth`.
11. After login, confirm the user returns to the requested protected page.
12. Stop the backend and confirm login displays a connection error.

## Frontend Page Tests

Check these routes:

```text
/
/centers
/centers/1
/trips
/trips/1
/courses
/courses/1
/about
/booking/1
/auth
/admin
/dashboard
/center/dashboard
/a-route-that-does-not-exist
```

For every changed page, confirm:

- It loads without a blank screen.
- There are no new browser console errors.
- Navigation and browser back/forward work.
- Buttons and links perform the expected action.
- Forms prevent invalid or duplicate submissions.
- Loading, empty, error, and success states work when relevant.
- Layout works at mobile, tablet, and desktop widths.
- Keyboard focus is visible.
- Inputs and controls have understandable labels.
- An unknown URL displays the not-found page.

## Required Checks Before Review

Backend:

```bash
cd stage4/backend
npm run typecheck
npm run build
```

Frontend:

```bash
cd stage4/frontend
npm run lint
npm run typecheck
npm run build
```

There is currently no automated `npm test` script. API smoke tests and browser
testing are required until an automated test suite is added.

## Git Workflow

Start new work from the latest `develop`:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/short-description
```

Use a branch prefix that matches the work:

- `feature/` for new functionality
- `fix/` for bug fixes
- `test/` for testing work
- `docs/` for documentation
- `chore/` for maintenance

Before committing:

```bash
git branch --show-current
git status --short
git diff
```

Stage only files related to the task:

```bash
git add path/to/file
git diff --staged
```

If the wrong file was staged:

```bash
git restore --staged path/to/file
```

Create a focused commit:

```bash
git commit -m "feat: short description"
```

Common commit prefixes are `feat`, `fix`, `test`, `docs`, and `chore`.

Push the branch:

```bash
git push -u origin feature/short-description
```

Create a pull request with:

- Base branch: `develop`
- Compare branch: the feature or fix branch
- A summary of the changes
- Testing evidence
- `Closes #ISSUE_NUMBER` when the pull request should close an issue

Review everything the pull request will contain:

```bash
git fetch origin
git log --oneline origin/develop..HEAD
git diff --stat origin/develop...HEAD
git diff origin/develop...HEAD
```

After the pull request is merged:

```bash
git switch develop
git pull --ff-only origin develop
git branch -d feature/short-description
```

Do not commit directly to `develop` or `main`, mix unrelated tasks in one
commit, or commit `.env`, tokens, real credentials, and generated build output.

## Important Notes

- Never commit `.env`, JWT tokens, or real passwords and database credentials.
- `docker-compose.yml` is currently empty and does not start PostgreSQL.
- Authentication uses the backend API and PostgreSQL.
- `npm run seed` writes users, a diving center, a trip, and a course to
  PostgreSQL.
- Frontend catalog pages still read mock data from
  `frontend/src/app/data.ts`; they do not display the seeded catalog records.
- Booking and payment screens currently use browser state and do not create
  database records.
- Always create and commit a Prisma migration after changing
  `prisma/schema.prisma`.
- `npx prisma migrate reset` deletes all data in the selected database. Use it
  only with a local development database.
- Do not delete or rewrite committed migrations without coordinating with the
  team.

## Quick Diagnostics

Check whether the normal development ports are already in use on macOS:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
lsof -nP -iTCP:5173 -sTCP:LISTEN
```

Show HTTP response headers and status codes while testing:

```bash
curl -i http://localhost:3000/api/health
```

Confirm the backend production build can start:

```bash
cd stage4/backend
npm run build
npm start
```

Confirm the frontend production build can be previewed:

```bash
cd stage4/frontend
npm run build
npm run preview
```
